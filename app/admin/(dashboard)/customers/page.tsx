import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import DeleteButton from './DeleteButton'

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  // strip characters that would break PostgREST's or() filter syntax
  const search = (q ?? '').replace(/[,()]/g, ' ').trim()

  const supabase = createAdminClient()
  let query = supabase
    .from('customers')
    .select('id, company, contact_person, phone, email, city, quotations(count)')
    .order('created_at', { ascending: false })

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

      <form className="mt-4" action="/admin/customers">
        <input
          name="q"
          defaultValue={search}
          placeholder="Search name, company, email, phone"
          className="h-9 w-72 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#062F4F] focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30"
        />
      </form>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">City</th>
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