import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import DeleteButton from './DeleteButton'

const QUOTED_STATUSES = ['quotation_sent', 'won']

const TABS = [
  { key: 'waiting', label: 'Waiting' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'all', label: 'All' },
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams
  const activeTab = tab === 'quoted' || tab === 'all' ? tab : 'waiting'

  const supabase = createAdminClient()
  let query = supabase
    .from('quote_requests')
    .select('id, reference, name, company, mobile, product, quantity, status, created_at')
    .order('created_at', { ascending: false })

  if (activeTab === 'waiting') query = query.not('status', 'in', '(quotation_sent,won,lost)')
  if (activeTab === 'quoted') query = query.in('status', QUOTED_STATUSES)

  const { data: inquiries, error } = await query

  // Which inquiries already have a quotation, so we can link straight to it
  const ids = (inquiries ?? []).map((i) => i.id)
  const { data: linked } = ids.length
    ? await supabase.from('quotations').select('id, quote_request_id').in('quote_request_id', ids)
    : { data: [] }
  const quotationFor = new Map((linked ?? []).map((q) => [q.quote_request_id, q.id]))

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Inquiries</h1>
      <p className="mt-1 text-sm text-gray-500">Quote requests sent from the website.</p>

      <div className="mt-4 flex gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === 'waiting' ? '/admin/inquiries' : `/admin/inquiries?tab=${t.key}`}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition ${
              activeTab === t.key ? 'border-[#D89B16] text-[#062F4F]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Quantity</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries?.map((inq) => {
              const quotationId = quotationFor.get(inq.id)
              return (
                <tr key={inq.id} className="transition hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-3 text-gray-500">{formatDate(inq.created_at)}</td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/inquiries/${inq.id}`} className="font-medium text-[#062F4F] hover:underline">
                      {inq.name}
                    </Link>
                    <span className="block text-xs text-gray-400">{inq.company || inq.reference}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600">{inq.mobile}</td>
                  <td className="px-5 py-3 text-gray-600">{inq.product}</td>
                  <td className="px-5 py-3 text-gray-600">{inq.quantity}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-4 whitespace-nowrap">
                      {quotationId ? (
                        <Link href={`/admin/quotations/${quotationId}`} className="font-medium text-green-700 hover:underline">
                          View Quotation
                        </Link>
                      ) : (
                        <Link
                          href={`/admin/quotations/new?inquiry=${inq.id}`}
                          className="inline-flex h-8 items-center rounded-lg bg-[#D89B16] px-3 text-xs font-bold text-white transition hover:bg-[#C58D12]"
                        >
                          Create Quotation
                        </Link>
                      )}
                      <Link href={`/admin/inquiries/${inq.id}`} className="font-medium text-[#062F4F] hover:underline">
                        View
                      </Link>
                      <DeleteButton id={inq.id} reference={inq.reference} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {inquiries?.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-gray-400">
            {activeTab === 'waiting' ? 'No inquiries waiting for a quotation.' : 'No inquiries here yet.'}
          </p>
        )}
        {error && <p className="px-5 py-10 text-center text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}
