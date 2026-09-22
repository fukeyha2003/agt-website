import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/server'
import SignOutButton from './SignOutButton';
const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/inquiries', label: 'Inquiries' },
  { href: '/admin/quotations', label: 'Quotations' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/suppliers', label: 'Suppliers' },
  { href: '/admin/content', label: 'Content' },
]

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="relative w-60 shrink-0 bg-[#062F4F] text-white">
        <div className="p-5">
          <p className="font-serif text-lg font-bold">AGT Admin</p>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-3 right-3">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}