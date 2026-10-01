'use server'

import type { createAdminClient } from '@/app/lib/supabase/admin'
import { requireAdmin } from '@/app/lib/supabase/require-admin'
import { revalidatePath } from 'next/cache'

type SupabaseAdmin = ReturnType<typeof createAdminClient>

async function generateQuotationNumber(supabase: SupabaseAdmin) {
  const year = new Date().getFullYear()
  const prefix = `AGT-${year}-`

  const { data } = await supabase
    .from('quotations')
    .select('number')
    .like('number', `${prefix}%`)
    .order('number', { ascending: false })
    .limit(1)

  let next = 1
  if (data && data.length > 0) {
    const suffix = data[0].number.slice(prefix.length)
    const n = parseInt(suffix, 10)
    if (!isNaN(n)) next = n + 1
  }

  return `${prefix}${String(next).padStart(3, '0')}`
}

function parseItems(formData: FormData) {
  const productIds = formData.getAll('item_product_id') as string[]
  const descriptions = formData.getAll('item_description') as string[]
  const quantities = formData.getAll('item_quantity') as string[]
  const units = formData.getAll('item_unit') as string[]
  const unitPrices = formData.getAll('item_unit_price') as string[]

  return descriptions
    .map((description, i) => ({
      product_id: productIds[i] ? Number(productIds[i]) : null,
      description: description.trim(),
      quantity: Number(quantities[i] || 0),
      unit: (units[i] || 'MT').trim(),
      unit_price: Number(unitPrices[i] || 0),
      sort_order: i,
    }))
    .filter((it) => it.description && it.quantity > 0)
}

function calculateTotals(items: ReturnType<typeof parseItems>, taxPercent: number) {
  const subtotal = Math.round(items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0) * 100) / 100
  const taxAmount = Math.round(subtotal * (taxPercent / 100) * 100) / 100
  const total = Math.round((subtotal + taxAmount) * 100) / 100
  return { subtotal, taxAmount, total }
}

async function resolveCustomerId(supabase: SupabaseAdmin, formData: FormData): Promise<number> {
  const isNewCustomer = formData.get('new_customer') === 'on'

  if (!isNewCustomer) {
    const id = formData.get('customer_id')
    if (!id) throw new Error('Please select a customer.')
    return Number(id)
  }

  const contactPerson = String(formData.get('new_contact_person') || '').trim()
  if (!contactPerson) throw new Error('Contact person is required for a new customer.')

  const { data, error } = await supabase
    .from('customers')
    .insert({
      company: String(formData.get('new_company') || '').trim() || null,
      contact_person: contactPerson,
      phone: String(formData.get('new_phone') || '').trim() || null,
      email: String(formData.get('new_email') || '').trim() || null,
      type: 'customer',
      source: 'quotation',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data.id
}

function sharedFields(formData: FormData) {
  return {
    quotation_date: String(formData.get('quotation_date') || '') || new Date().toISOString().slice(0, 10),
    valid_until: String(formData.get('valid_until') || '') || null,
    delivery_location: String(formData.get('delivery_location') || '').trim() || null,
    payment_terms: String(formData.get('payment_terms') || '').trim() || null,
    remarks: String(formData.get('remarks') || '').trim() || null,
    currency: String(formData.get('currency') || 'PKR').trim() || 'PKR',
  }
}

export async function createQuotation(formData: FormData) {
  const supabase = await requireAdmin()

  const customerId = await resolveCustomerId(supabase, formData)
  const items = parseItems(formData)
  if (items.length === 0) throw new Error('Add at least one line item.')

  const taxPercent = Number(formData.get('tax_percent') || 0)
  const { subtotal, taxAmount, total } = calculateTotals(items, taxPercent)
  const number = await generateQuotationNumber(supabase)
  const quoteRequestId = formData.get('quote_request_id')

  const { data: quotation, error } = await supabase
    .from('quotations')
    .insert({
      number,
      customer_id: customerId,
      quote_request_id: quoteRequestId ? Number(quoteRequestId) : null,
      ...sharedFields(formData),
      subtotal,
      tax_percent: taxPercent,
      tax_amount: taxAmount,
      total,
      status: 'draft',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  const { error: itemsError } = await supabase
    .from('quotation_items')
    .insert(items.map((it) => ({ ...it, quotation_id: quotation.id })))
  if (itemsError) throw new Error(itemsError.message)

  revalidatePath('/admin/quotations')
  return { success: true as const, id: quotation.id }
}

export async function updateQuotation(id: number, formData: FormData) {
  const supabase = await requireAdmin()

  const customerId = await resolveCustomerId(supabase, formData)
  const items = parseItems(formData)
  if (items.length === 0) throw new Error('Add at least one line item.')

  const taxPercent = Number(formData.get('tax_percent') || 0)
  const { subtotal, taxAmount, total } = calculateTotals(items, taxPercent)

  const { error } = await supabase
    .from('quotations')
    .update({
      customer_id: customerId,
      ...sharedFields(formData),
      subtotal,
      tax_percent: taxPercent,
      tax_amount: taxAmount,
      total,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  // Items have no stable client-side ids in this form, so replace them wholesale.
  const { error: deleteError } = await supabase.from('quotation_items').delete().eq('quotation_id', id)
  if (deleteError) throw new Error(deleteError.message)

  const { error: itemsError } = await supabase
    .from('quotation_items')
    .insert(items.map((it) => ({ ...it, quotation_id: id })))
  if (itemsError) throw new Error(itemsError.message)

  revalidatePath('/admin/quotations')
  revalidatePath(`/admin/quotations/${id}`)
  return { success: true as const, id }
}

export async function deleteQuotation(id: number) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('quotations').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/quotations')
}

export async function updateQuotationStatus(id: number, status: string) {
  const supabase = await requireAdmin()
  const patch: Record<string, unknown> = { status }
  if (status === 'sent') patch.sent_at = new Date().toISOString()
  const { error } = await supabase.from('quotations').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/quotations')
}