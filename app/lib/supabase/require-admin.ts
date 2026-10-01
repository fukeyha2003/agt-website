import { createAdminClient } from './admin'
import { createClient } from './server'

// Server Actions and Route Handlers are public HTTP endpoints, so the
// dashboard layout's redirect does not protect them. Call this at the top of
// every admin mutation: it checks the signed-in session and only then hands
// back the service-role client.
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to do that.')

  return createAdminClient()
}
