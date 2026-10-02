import type { createAdminClient } from '@/app/lib/supabase/admin'

type SupabaseAdmin = ReturnType<typeof createAdminClient>

// Finds an existing customer by email (case-insensitive) or phone, so the
// same person isn't added twice. Server-only helper, not a Server Action.
export async function findCustomerId(supabase: SupabaseAdmin, email: string | null, phone: string | null) {
  if (email) {
    // escape LIKE wildcards so "john_doe@x.com" only matches itself
    const pattern = email.replace(/[\\%_]/g, (c) => `\\${c}`)
    const { data } = await supabase.from('customers').select('id').ilike('email', pattern).limit(1)
    if (data?.[0]) return data[0].id as number
  }
  if (phone) {
    const { data } = await supabase.from('customers').select('id').eq('phone', phone).limit(1)
    if (data?.[0]) return data[0].id as number
  }
  return null
}
