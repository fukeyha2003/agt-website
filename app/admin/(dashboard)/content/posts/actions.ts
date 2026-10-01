'use server'

import { createAdminClient } from '@/app/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

type SupabaseAdmin = ReturnType<typeof createAdminClient>

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function uploadCover(supabase: SupabaseAdmin, file: File | null, existingPath: string | null) {
  if (!file || file.size === 0) return existingPath

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${crypto.randomUUID()}.${ext}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from('post-images')
    .upload(path, bytes, { contentType: file.type, upsert: false })
  if (error) throw new Error(`Image upload failed: ${error.message}`)

  if (existingPath) {
    await supabase.storage.from('post-images').remove([existingPath])
  }

  return path
}

function fieldsFromForm(formData: FormData) {
  const title = String(formData.get('title') || '').trim()
  if (!title) throw new Error('Title is required.')

  const rawSlug = String(formData.get('slug') || '').trim()

  return {
    title,
    slug: slugify(rawSlug || title),
    excerpt: String(formData.get('excerpt') || '').trim() || null,
    body: String(formData.get('body') || '').trim() || null,
    is_published: formData.get('is_published') === 'on',
  }
}

function friendlyError(error: { code?: string; message: string }) {
  if (error.code === '23505') return 'That slug is already used by another post. Please choose a different one.'
  return error.message
}

export async function createPost(formData: FormData) {
  const supabase = createAdminClient()
  const fields = fieldsFromForm(formData)

  const cover = await uploadCover(supabase, formData.get('cover_image') as File | null, null)

  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...fields,
      cover_image: cover,
      published_at: fields.is_published ? new Date().toISOString() : null,
    })
    .select('id')
    .single()
  if (error) throw new Error(friendlyError(error))

  revalidatePath('/admin/content/posts')
  return { success: true as const, id: data.id as number }
}

export async function updatePost(id: number, formData: FormData) {
  const supabase = createAdminClient()
  const fields = fieldsFromForm(formData)

  const { data: existing } = await supabase.from('posts').select('cover_image, published_at').eq('id', id).single()

  let coverPath: string | null = existing?.cover_image ?? null
  const file = formData.get('cover_image') as File | null

  if (formData.get('remove_cover') === 'on' && coverPath && (!file || file.size === 0)) {
    await supabase.storage.from('post-images').remove([coverPath])
    coverPath = null
  }
  if (file && file.size > 0) {
    coverPath = await uploadCover(supabase, file, coverPath)
  }

  // Stamp published_at the first time a post goes live; keep it afterwards.
  const publishedAt = fields.is_published ? (existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null

  const { error } = await supabase
    .from('posts')
    .update({ ...fields, cover_image: coverPath, published_at: publishedAt })
    .eq('id', id)
  if (error) throw new Error(friendlyError(error))

  revalidatePath('/admin/content/posts')
  revalidatePath(`/admin/content/posts/${id}`)
  return { success: true as const, id }
}

export async function deletePost(id: number) {
  const supabase = createAdminClient()

  const { data: existing } = await supabase.from('posts').select('cover_image').eq('id', id).single()
  if (existing?.cover_image) {
    await supabase.storage.from('post-images').remove([existing.cover_image])
  }

  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { success: false as const, error: error.message }

  revalidatePath('/admin/content/posts')
  return { success: true as const }
}

export async function togglePostPublished(id: number, current: boolean) {
  const supabase = createAdminClient()

  const patch: Record<string, unknown> = { is_published: !current }
  if (!current) {
    const { data: existing } = await supabase.from('posts').select('published_at').eq('id', id).single()
    if (!existing?.published_at) patch.published_at = new Date().toISOString()
  }

  const { error } = await supabase.from('posts').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/posts')
}