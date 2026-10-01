import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'

const INQUIRY_STATUS: Record<string, { label: string; style: string }> = {
  new: { label: 'New', style: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacted', style: 'bg-amber-100 text-amber-700' },
  quotation_sent: { label: 'Quotation Sent', style: 'bg-purple-100 text-purple-700' },
  negotiation: { label: 'Negotiation', style: 'bg-orange-100 text-orange-700' },
  won: { label: 'Won', style: 'bg-green-100 text-green-700' },
  lost: { label: 'Lost', style: 'bg-gray-100 text-gray-500' },
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  const [{ data: stats }, { data: inquiries }, { data: quotations }] = await Promise.all([
    supabase.from('dashboard_stats').select('*').single(),
    supabase
      .from('quote_requests')
      .select('id, reference, name, company, product, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('quotations')
      .select('id, number, quotation_date, currency, total, status, customers(company, contact_person)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const cards = [
    { label: 'New Inquiries', value: stats?.new_inquiries ?? 0, href: '/admin/inquiries?status=new' },
    { label: 'Pending Quotes', value: stats?.pending_quotes ?? 0, href: '/admin/quotations' },
    { label: 'Active Deals', value: stats?.active_deals ?? 0, href: '/admin/inquiries?status=negotiation' },
    { label: 'Customers', value: stats?.customers ?? 0, href: '/admin/customers' },
    { label: 'Suppliers', value: stats?.suppliers ?? 0, href: '/admin/suppliers' },
    { label: 'Products', value: stats?.products ?? 0, href: '/admin/products' },
  ]

  const quickActions = [
    { href: '/admin/quotations/new', label: '+ New Quotation' },
    { href: '/admin/customers/new', label: '+ Add Customer' },
    { href: '/admin/suppliers/new', label: '+ Add Supplier' },
    { href: '/admin/products/new', label: '+ Add Product' },
    { href: '/admin/content/posts/new', label: '+ News Post' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
            <p className="text-2xl font-bold text-[#062F4F]">{c.value}</p>
            <p className="mt-1 text-xs text-gray-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-[#062F4F] transition hover:border-[#D89B16] hover:text-[#D89B16]"
          >
            {a.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-serif text-lg font-bold text-[#062F4F]">Latest Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm font-medium text-[#D89B16] hover:underline">
              View all
            </Link>
          </div>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {inquiries?.map((inq) => {
                const status = INQUIRY_STATUS[inq.status]
                return (
                  <tr key={inq.id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/inquiries/${inq.id}`} className="font-medium text-[#062F4F] hover:underline">
                        {inq.reference}
                      </Link>
                      <span className="block text-xs text-gray-400">{inq.company || inq.name}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{inq.product}</td>
                    <td className="px-5 py-3">
                      {status && (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.style}`}>{status.label}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500">{formatDate(inq.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {inquiries?.length === 0 && <p className="px-5 py-8 text-center text-sm text-gray-400">No inquiries yet.</p>}
        </section>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-serif text-lg font-bold text-[#062F4F]">Recent Quotations</h2>
            <Link href="/admin/quotations" className="text-sm font-medium text-[#D89B16] hover:underline">
              View all
            </Link>
          </div>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {quotations?.map((q) => {
                const customer = Array.isArray(q.customers) ? q.customers[0] : q.customers
                return (
                  <tr key={q.id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/quotations/${q.id}`} className="font-medium text-[#062F4F] hover:underline">
                        {q.number}
                      </Link>
                      <span className="block text-xs text-gray-400">
                        {customer?.company || customer?.contact_person || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-[#062F4F]">
                      {q.currency}{' '}
                      {Number(q.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 capitalize text-gray-600">{q.status}</td>
                    <td className="px-5 py-3 text-right text-gray-500">{formatDate(q.quotation_date)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {quotations?.length === 0 && <p className="px-5 py-8 text-center text-sm text-gray-400">No quotations yet.</p>}
        </section>
      </div>
    </div>
  )
}
