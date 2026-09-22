import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  quotation_sent: 'bg-purple-100 text-purple-700',
  negotiation: 'bg-orange-100 text-orange-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  quotation_sent: 'Quotation Sent',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
}

const TABS = ['all', 'new', 'contacted', 'quotation_sent', 'negotiation', 'won', 'lost']

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const activeTab = status ?? 'all'

  const supabase = createAdminClient()
  let query = supabase
    .from('quote_requests')
    .select('id, reference, name, company, product, quantity, status, created_at')
    .order('created_at', { ascending: false })

  if (activeTab !== 'all') query = query.eq('status', activeTab)

  const { data: inquiries, error } = await query

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Inquiries</h1>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto border-b border-gray-200">
        {TABS.map((tab) => (
          <Link
            key={tab}
            href={tab === 'all' ? '/admin/inquiries' : `/admin/inquiries?status=${tab}`}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-[#D89B16] text-[#062F4F]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'all' ? 'All' : STATUS_LABELS[tab]}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Quantity</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries?.map((inq) => (
              <tr key={inq.id} className="transition hover:bg-gray-50">
                <td className="px-5 py-3">
                  <Link href={`/admin/inquiries/${inq.id}`} className="font-medium text-[#062F4F] hover:underline">
                    {inq.reference}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  {inq.name}
                  {inq.company && <span className="block text-xs text-gray-400">{inq.company}</span>}
                </td>
                <td className="px-5 py-3">{inq.product}</td>
                <td className="px-5 py-3">{inq.quantity}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[inq.status]}`}>
                    {STATUS_LABELS[inq.status]}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(inq.created_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inquiries?.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-gray-400">No inquiries in this status yet.</p>
        )}
        {error && <p className="px-5 py-10 text-center text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}