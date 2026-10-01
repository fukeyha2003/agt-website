'use server'

import { requireAdmin } from '@/app/lib/supabase/require-admin'
import { revalidatePath } from 'next/cache'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function fieldsFromForm(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  if (!name) throw new Error('Product name is required.')

  const rawSlug = String(formData.get('slug') || '').trim()

  return {
    name,
    slug: slugify(rawSlug || name),
    unit: String(formData.get('unit') || '').trim() || null,
    description: String(formData.get('description') || '').trim() || null,
    is_active: formData.get('is_active') === 'on',
    sort_order: Number(formData.get('sort_order') || 0),
  }
}

function friendlyError(error: { code?: string; message: string }) {
  if (error.code === '23505') return 'That slug is already used by another product. Please choose a different one.'
  if (error.code === '23503')
    return 'This product is used on quotations or supplier transactions. Mark it inactive instead of deleting it.'
  return error.message
}

function revalidateProducts(id?: number) {
  revalidatePath('/admin/products')
  if (id) revalidatePath(`/admin/products/${id}`)
  revalidatePath('/admin')
}

export async function createProduct(formData: FormData) {
  const supabase = await requireAdmin()
  const fields = fieldsFromForm(formData)

  const { data, error } = await supabase.from('products').insert(fields).select('id').single()
  if (error) throw new Error(friendlyError(error))

  revalidateProducts()
  return { success: true as const, id: data.id as number }
}

export async function updateProduct(id: number, formData: FormData) {
  const supabase = await requireAdmin()
  const fields = fieldsFromForm(formData)

  const { error } = await supabase.from('products').update(fields).eq('id', id)
  if (error) throw new Error(friendlyError(error))

  revalidateProducts(id)
  return { success: true as const, id }
}

export async function deleteProduct(id: number) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { success: false as const, error: friendlyError(error) }

  revalidateProducts()
  return { success: true as const }
}

export async function toggleProductActive(id: number, current: boolean) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidateProducts()
}
