import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/lib/supabase/admin'
import ProductForm from '../ProductForm'
import { updateProduct } from '../actions'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: product }, { data: links }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('product_supplier').select('suppliers(id, name, is_active)').eq('product_id', id),
  ])

  if (!product) notFound()

  const boundUpdate = updateProduct.bind(null, product.id)
  const suppliers = (links ?? [])
    .flatMap((l) => (Array.isArray(l.suppliers) ? l.suppliers : l.suppliers ? [l.suppliers] : []))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Edit Product — {product.name}</h1>

      <div className="mt-6">
        <ProductForm
          action={boundUpdate}
          submitLabel="Save Changes"
          initialData={{
            name: product.name,
            slug: product.slug,
            unit: product.unit,
            description: product.description,
            is_active: product.is_active,
            sort_order: product.sort_order ?? 0,
          }}
        />
      </div>

      <div className="mt-8 max-w-3xl rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="font-serif text-lg font-bold text-[#062F4F]">Suppliers</h2>
        {suppliers.length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">No suppliers linked yet. Link products from a supplier&apos;s page.</p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100 text-sm">
            {suppliers.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2">
                <Link href={`/admin/suppliers/${s.id}`} className="font-medium text-[#062F4F] hover:underline">
                  {s.name}
                </Link>
                {!s.is_active && <span className="text-xs text-gray-400">Inactive</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
