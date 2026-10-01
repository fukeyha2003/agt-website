import { createAdminClient } from '@/app/lib/supabase/admin'
import CustomerForm from '../CustomerForm'
import { createCustomer } from '../actions'

export default async function NewCustomerPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase.from('products').select('slug, name').order('sort_order', { ascending: true })

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Add Customer</h1>
      <div className="mt-6">
        <CustomerForm action={createCustomer} products={products ?? []} submitLabel="Create Customer" />
      </div>
    </div>
  )
}