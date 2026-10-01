import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import DeleteButton from './DeleteButton'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'lead', label: 'Leads' },
  { key: 'customer', label: 'Customers' },
]

const TYPE_STYLES: Record<string, string> = {
  lead: 'bg-amber-100 text-amber-700',
  customer: 'bg-green-100 text-green-700',
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>
}) {
  const { q, type } = await searchParams
  const activeType = type === 'lead' || type === 'customer' ? type : 'all'
  // strip characters that would break PostgREST's or() filter syntax
  const search = (q ?? '').replace(/[,()]/g, ' ').trim()

  const supabase = createAdminClient()
  let query = supabase
    .from('customers')
    .select('id, company, contact_person, phone, email, city, type, quotations(count)')
    .order('created_at', { ascending: false })

  if (activeType !== 'all') query = query.eq('type', activeType)
  if (search) {
    query = query.or(
      `company.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    )
  }

  const { data: customers, error } = await query

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Customers</h1>
        <Link
          href="/admin/customers/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D89B16] px-4 text-sm font-bold text-white transition hover:bg-[#C58D12]"
        >
          + Add Customer
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === 'all' ? '/admin/customers' : `/admin/customers?type=${tab.key}`}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition ${
                activeType === tab.key
                  ? 'border-[#D89B16] text-[#062F4F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <form className="pb-2" action="/admin/customers">
          {activeType !== 'all' && <input type="hidden" name="type" value={activeType} />}
          <input
            name="q"
            defaultValue={search}
            placeholder="Search name, company, email, phone"
            className="h-9 w-64 rounded-lg border border-gray-200 px-3 text-sm text-[#062F4F] focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30"
          />
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Quotations</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers?.map((c) => {
              const quoteCount = Array.isArray(c.quotations) ? (c.quotations[0]?.count ?? 0) : 0
              return (
                <tr key={c.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-[#062F4F] hover:underline">
                      {c.company || c.contact_person}
                    </Link>
                    {c.company && <span className="block text-xs text-gray-400">{c.contact_person}</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{c.phone || '—'}</td>
                  <td className="px-5 py-3 text-gray-600">{c.email || '—'}</td>
                  <td className="px-5 py-3 text-gray-600">{c.city || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${TYPE_STYLES[c.type]}`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{quoteCount}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/customers/${c.id}`} className="font-medium text-[#062F4F] hover:underline">
                        Edit
                      </Link>
                      <DeleteButton id={c.id} name={c.company || c.contact_person} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {customers?.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-400">No customers found.</p>}
        {error && <p className="px-5 py-10 text-center text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}