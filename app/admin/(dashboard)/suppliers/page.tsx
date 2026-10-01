import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import ActiveToggle from './ActiveToggle'
import DeleteButton from './DeleteButton'

export default async function SuppliersPage() {
  const supabase = createAdminClient()

  const { data: suppliers, error } = await supabase
    .from('suppliers')
    .select('id, name, country, contact_person, phone, is_active, product_supplier(count)')
    .order('name', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Suppliers</h1>
        <Link
          href="/admin/suppliers/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D89B16] px-4 text-sm font-bold text-white transition hover:bg-[#C58D12]"
        >
          + Add Supplier
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Supplier</th>
              <th className="px-5 py-3">Country</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {suppliers?.map((s) => {
              const productCount = Array.isArray(s.product_supplier) ? (s.product_supplier[0]?.count ?? 0) : 0
              return (
                <tr key={s.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/suppliers/${s.id}`} className="font-medium text-[#062F4F] hover:underline">
                      {s.name}
                    </Link>
                    {s.contact_person && <span className="block text-xs text-gray-400">{s.contact_person}</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{s.country || '—'}</td>
                  <td className="px-5 py-3 text-gray-600">{s.phone || '—'}</td>
                  <td className="px-5 py-3 text-gray-600">{productCount}</td>
                  <td className="px-5 py-3">
                    <ActiveToggle id={s.id} isActive={s.is_active} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/suppliers/${s.id}`} className="font-medium text-[#062F4F] hover:underline">
                        Edit
                      </Link>
                      <DeleteButton id={s.id} name={s.name} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {suppliers?.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-400">No suppliers yet.</p>}
        {error && <p className="px-5 py-10 text-center text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}