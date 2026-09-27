import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import StatusSelect from './StatusSelect'
import DeleteButton from './DeleteButton'

export default async function QuotationsPage() {
  const supabase = createAdminClient()

  const { data: quotations, error } = await supabase
    .from('quotations')
    .select('id, number, quotation_date, currency, total, status, customers(company, contact_person)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Quotations</h1>
        <Link
          href="/admin/quotations/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D89B16] px-4 text-sm font-bold text-white transition hover:bg-[#C58D12]"
        >
          + New Quotation
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Number</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotations?.map((q) => {
              // Supabase types this relation as an array even though it's a single row via FK
              const customer = Array.isArray(q.customers) ? q.customers[0] : q.customers
              return (
                <tr key={q.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/quotations/${q.id}`} className="font-medium text-[#062F4F] hover:underline">
                      {q.number}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    {customer?.company || customer?.contact_person || '—'}
                    {customer?.company && customer?.contact_person && (
                      <span className="block text-xs text-gray-400">{customer.contact_person}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(q.quotation_date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3 font-medium text-[#062F4F]">
                    {q.currency} {Number(q.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3">
                    <StatusSelect id={q.id} status={q.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/quotations/${q.id}/pdf`} target="_blank" className="font-medium text-[#062F4F] hover:underline">
                        PDF
                      </Link>
                      <Link href={`/admin/quotations/${q.id}`} className="font-medium text-[#062F4F] hover:underline">
                        Edit
                      </Link>
                      <DeleteButton id={q.id} number={q.number} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {quotations?.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-400">No quotations yet.</p>}
        {error && <p className="px-5 py-10 text-center text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}