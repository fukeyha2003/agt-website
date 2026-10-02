'use server'

import { requireAdmin } from '@/app/lib/supabase/require-admin'
import { revalidatePath } from 'next/cache'

export async function deleteInquiry(id: number) {
  const supabase = await requireAdmin()

  const { data: inquiry } = await supabase.from('quote_requests').select('attachment_path').eq('id', id).single()

  const { error } = await supabase.from('quote_requests').delete().eq('id', id)
  if (error) {
    if (error.code === '23503') {
      return {
        success: false as const,
        error: 'This inquiry has a quotation linked to it. Delete that quotation first.',
      }
    }
    return { success: false as const, error: error.message }
  }

  if (inquiry?.attachment_path) {
    await supabase.storage.from('quote-attachments').remove([inquiry.attachment_path])
  }

  revalidatePath('/admin/inquiries')
  return { success: true as const }
}
