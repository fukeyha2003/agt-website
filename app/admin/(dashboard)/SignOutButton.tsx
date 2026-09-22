'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button onClick={handleSignOut}
      className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
      Sign out
    </button>
  )
}