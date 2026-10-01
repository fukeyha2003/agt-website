import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/lib/supabase/admin'
import SupplierForm from '../SupplierForm'
import TransactionsPanel from '../TransactionsPanel'
import { updateSupplier } from '../actions'

export default async function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: supplier }, { data: products }, { data: links }, { data: transactions }] = await Promise.all([
    supabase.from('suppliers').select('*').eq('id', id).single(),
    supabase.from('products').select('id, name').order('sort_order', { ascending: true }),
    supabase.from('product_supplier').select('product_id').eq('supplier_id', id),
    supabase
      .from('supplier_transactions')
      .select('*')
      .eq('supplier_id', id)
      .order('transaction_date', { ascending: false }),
  ])

  if (!supplier) notFound()

  const boundUpdate = updateSupplier.bind(null, supplier.id)

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Edit Supplier — {supplier.name}</h1>

      <div className="mt-6">
        <SupplierForm
          action={boundUpdate}
          products={products ?? []}
          submitLabel="Save Changes"
          initialData={{
            name: supplier.name,
            country: supplier.country,
            contact_person: supplier.contact_person,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address,
            terms: supplier.terms,
            is_active: supplier.is_active,
            product_ids: (links ?? []).map((l) => l.product_id),
          }}
        />
      </div>

      <TransactionsPanel supplierId={supplier.id} products={products ?? []} transactions={transactions ?? []} />
    </div>
  )
}