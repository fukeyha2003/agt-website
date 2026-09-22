import { createAdminClient } from '@/app/lib/supabase/admin'

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()
  const { data: stats } = await supabase.from('dashboard_stats').select('*').single()

  const cards = [
    { label: 'New Inquiries', value: stats?.new_inquiries ?? 0 },
    { label: 'Pending Quotes', value: stats?.pending_quotes ?? 0 },
    { label: 'Active Deals', value: stats?.active_deals ?? 0 },
    { label: 'Customers', value: stats?.customers ?? 0 },
    { label: 'Suppliers', value: stats?.suppliers ?? 0 },
    { label: 'Products', value: stats?.products ?? 0 },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-[#062F4F]">{c.value}</p>
            <p className="mt-1 text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}