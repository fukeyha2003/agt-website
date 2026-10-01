'use server'

import type { createAdminClient } from '@/app/lib/supabase/admin'
import { requireAdmin } from '@/app/lib/supabase/require-admin'
import { revalidatePath } from 'next/cache'

type SupabaseAdmin = ReturnType<typeof createAdminClient>

function fieldsFromForm(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  if (!name) throw new Error('Supplier name is required.')

  return {
    name,
    country: String(formData.get('country') || '').trim() || null,
    contact_person: String(formData.get('contact_person') || '').trim() || null,
    phone: String(formData.get('phone') || '').trim() || null,
    email: String(formData.get('email') || '').trim() || null,
    address: String(formData.get('address') || '').trim() || null,
    terms: String(formData.get('terms') || '').trim() || null,
    is_active: formData.get('is_active') === 'on',
  }
}

async function syncProducts(supabase: SupabaseAdmin, supplierId: number, formData: FormData) {
  const productIds = (formData.getAll('product_id') as string[]).map(Number).filter(Boolean)

  const { error: delError } = await supabase.from('product_supplier').delete().eq('supplier_id', supplierId)
  if (delError) throw new Error(delError.message)

  if (productIds.length > 0) {
    const { error } = await supabase
      .from('product_supplier')
      .insert(productIds.map((product_id) => ({ supplier_id: supplierId, product_id })))
    if (error) throw new Error(error.message)
  }
}

export async function createSupplier(formData: FormData) {
  const supabase = await requireAdmin()
  const fields = fieldsFromForm(formData)

  const { data, error } = await supabase.from('suppliers').insert(fields).select('id').single()
  if (error) throw new Error(error.message)

  await syncProducts(supabase, data.id, formData)

  revalidatePath('/admin/suppliers')
  return { success: true as const, id: data.id as number }
}

export async function updateSupplier(id: number, formData: FormData) {
  const supabase = await requireAdmin()
  const fields = fieldsFromForm(formData)

  const { error } = await supabase.from('suppliers').update(fields).eq('id', id)
  if (error) throw new Error(error.message)

  await syncProducts(supabase, id, formData)

  revalidatePath('/admin/suppliers')
  revalidatePath(`/admin/suppliers/${id}`)
  return { success: true as const, id }
}

export async function deleteSupplier(id: number) {
  const supabase = await requireAdmin()
  // product_supplier and supplier_transactions rows cascade automatically
  const { error } = await supabase.from('suppliers').delete().eq('id', id)
  if (error) return { success: false as const, error: error.message }

  revalidatePath('/admin/suppliers')
  return { success: true as const }
}

export async function toggleSupplierActive(id: number, current: boolean) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('suppliers').update({ is_active: !current }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/suppliers')
}

function numberOrNull(value: FormDataEntryValue | null) {
  const s = String(value ?? '').trim()
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export async function addTransaction(supplierId: number, formData: FormData) {
  const supabase = await requireAdmin()

  const date = String(formData.get('transaction_date') || '').trim()
  if (!date) throw new Error('Transaction date is required.')

  const productId = String(formData.get('product_id') || '')

  const { error } = await supabase.from('supplier_transactions').insert({
    supplier_id: supplierId,
    product_id: productId ? Number(productId) : null,
    transaction_date: date,
    reference: String(formData.get('reference') || '').trim() || null,
    quantity: numberOrNull(formData.get('quantity')),
    unit: String(formData.get('unit') || '').trim() || null,
    amount: numberOrNull(formData.get('amount')),
    currency: String(formData.get('currency') || 'PKR').trim() || 'PKR',
    notes: String(formData.get('notes') || '').trim() || null,
  })
  if (error) throw new Error(error.message)

  revalidatePath(`/admin/suppliers/${supplierId}`)
  return { success: true as const }
}

export async function deleteTransaction(id: number, supplierId: number) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('supplier_transactions').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/suppliers/${supplierId}`)
}