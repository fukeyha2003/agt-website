'use server'

import { requireAdmin } from '@/app/lib/supabase/require-admin'
import { revalidatePath } from 'next/cache'

function fieldsFromForm(formData: FormData) {
  const contactPerson = String(formData.get('contact_person') || '').trim()
  if (!contactPerson) throw new Error('Contact person is required.')

  return {
    company: String(formData.get('company') || '').trim() || null,
    contact_person: contactPerson,
    phone: String(formData.get('phone') || '').trim() || null,
    email: String(formData.get('email') || '').trim() || null,
    city: String(formData.get('city') || '').trim() || null,
    address: String(formData.get('address') || '').trim() || null,
    source: String(formData.get('source') || '').trim() || null,
    type: formData.get('type') === 'customer' ? 'customer' : 'lead',
    product_interest: formData.getAll('product_interest') as string[],
  }
}

export async function createCustomer(formData: FormData) {
  const supabase = await requireAdmin()
  const fields = fieldsFromForm(formData)

  const { data, error } = await supabase.from('customers').insert(fields).select('id').single()
  if (error) throw new Error(error.message)

  revalidatePath('/admin/customers')
  return { success: true as const, id: data.id as number }
}

export async function updateCustomer(id: number, formData: FormData) {
  const supabase = await requireAdmin()
  const fields = fieldsFromForm(formData)

  const { error } = await supabase.from('customers').update(fields).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/customers')
  revalidatePath(`/admin/customers/${id}`)
  return { success: true as const, id }
}

export async function deleteCustomer(id: number) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('customers').delete().eq('id', id)

  if (error) {
    // quotations.customer_id is ON DELETE RESTRICT
    if (error.code === '23503') {
      return {
        success: false as const,
        error: "This customer has quotations, so it can't be deleted. Delete those quotations first.",
      }
    }
    return { success: false as const, error: error.message }
  }

  revalidatePath('/admin/customers')
  return { success: true as const }
}