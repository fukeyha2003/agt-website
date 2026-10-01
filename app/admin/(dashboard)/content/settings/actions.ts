'use server'

import { createAdminClient } from '@/app/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

function text(formData: FormData, name: string) {
  return String(formData.get(name) || '').trim()
}

export async function saveSettings(formData: FormData) {
  const supabase = createAdminClient()

  const rows = [
    {
      key: 'hero_text',
      value: { headline: text(formData, 'hero_headline'), subtext: text(formData, 'hero_subtext') },
    },
    {
      key: 'about_text',
      value: { body: text(formData, 'about_body') },
    },
    {
      key: 'contact_details',
      value: {
        address: text(formData, 'contact_address'),
        phone_1: text(formData, 'contact_phone_1'),
        phone_2: text(formData, 'contact_phone_2'),
        email: text(formData, 'contact_email'),
      },
    },
  ]

  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) throw new Error(error.message)

  revalidatePath('/admin/content/settings')
  return { success: true as const }
}