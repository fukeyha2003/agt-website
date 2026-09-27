import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import SignOutButton from './SignOutButton'
import AdminNav from './admin-nav'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="relative w-60 shrink-0 bg-[#062F4F] text-white">
        <div className="p-5">
          <p className="font-serif text-lg font-bold">AG Admin</p>
        </div>

        <AdminNav />

        <div className="absolute bottom-5 left-3 right-3">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}