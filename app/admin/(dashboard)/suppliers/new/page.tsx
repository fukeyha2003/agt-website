import { createAdminClient } from '@/app/lib/supabase/admin'
import SupplierForm from '../SupplierForm'
import { createSupplier } from '../actions'

export default async function NewSupplierPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase.from('products').select('id, name').order('sort_order', { ascending: true })

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Add Supplier</h1>
      <div className="mt-6">
        <SupplierForm action={createSupplier} products={products ?? []} submitLabel="Create Supplier" />
      </div>
    </div>
  )
}