import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import TogglePublished from '../content/TogglePublished'
import DeleteButton from '../content/DeleteButton'
import { deleteProduct, toggleProductActive } from './actions'

export default async function ProductsPage() {
  const supabase = createAdminClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, unit, is_active, sort_order, product_supplier(count)')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D89B16] px-4 text-sm font-bold text-white transition hover:bg-[#C58D12]"
        >
          + Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Unit</th>
              <th className="px-5 py-3">Suppliers</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3">Sort</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products?.map((p) => {
              const supplierCount = Array.isArray(p.product_supplier) ? (p.product_supplier[0]?.count ?? 0) : 0
              return (
                <tr key={p.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-[#062F4F] hover:underline">
                      {p.name}
                    </Link>
                    <span className="block text-xs text-gray-400">{p.slug}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.unit || '—'}</td>
                  <td className="px-5 py-3 text-gray-600">{supplierCount}</td>
                  <td className="px-5 py-3">
                    <TogglePublished id={p.id} isPublished={p.is_active} action={toggleProductActive} />
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.sort_order}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/products/${p.id}`} className="font-medium text-[#062F4F] hover:underline">
                        Edit
                      </Link>
                      <DeleteButton id={p.id} label={p.name} action={deleteProduct} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {products?.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-400">No products yet.</p>}
        {error && <p className="px-5 py-10 text-center text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}
