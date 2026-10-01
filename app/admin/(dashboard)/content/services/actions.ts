'use server'

import { createAdminClient } from '@/app/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function fieldsFromForm(formData: FormData) {
  const title = String(formData.get('title') || '').trim()
  if (!title) throw new Error('Title is required.')

  const rawSlug = String(formData.get('slug') || '').trim()

  return {
    title,
    slug: slugify(rawSlug || title),
    summary: String(formData.get('summary') || '').trim() || null,
    items: (formData.getAll('item') as string[]).map((i) => i.trim()).filter(Boolean),
    icon: String(formData.get('icon') || '').trim() || null,
    is_published: formData.get('is_published') === 'on',
    sort_order: Number(formData.get('sort_order') || 0),
  }
}

function friendlyError(error: { code?: string; message: string }) {
  if (error.code === '23505') return 'That slug is already used by another service. Please choose a different one.'
  return error.message
}

export async function createService(formData: FormData) {
  const supabase = createAdminClient()
  const fields = fieldsFromForm(formData)

  const { data, error } = await supabase.from('services').insert(fields).select('id').single()
  if (error) throw new Error(friendlyError(error))

  revalidatePath('/admin/content/services')
  return { success: true as const, id: data.id as number }
}

export async function updateService(id: number, formData: FormData) {
  const supabase = createAdminClient()
  const fields = fieldsFromForm(formData)

  const { error } = await supabase.from('services').update(fields).eq('id', id)
  if (error) throw new Error(friendlyError(error))

  revalidatePath('/admin/content/services')
  revalidatePath(`/admin/content/services/${id}`)
  return { success: true as const, id }
}

export async function deleteService(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) return { success: false as const, error: error.message }

  revalidatePath('/admin/content/services')
  return { success: true as const }
}

export async function toggleServicePublished(id: number, current: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').update({ is_published: !current }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/services')
}