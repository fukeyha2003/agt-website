import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Server-only. NEVER import this file from a Client Component or expose
// SUPABASE_SERVICE_ROLE_KEY to the browser — it bypasses Row Level Security.
// It must NOT be prefixed with NEXT_PUBLIC_ in .env.local.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )
}