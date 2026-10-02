import { createAdminClient } from '@/app/lib/supabase/admin'
import QuotationForm from '../QuotationForm'
import { createQuotation } from '../actions'

export default async function NewQuotationPage() {
  const supabase = createAdminClient()
  const { data: customers } = await supabase
    .from('customers')
    .select('id, company, contact_person')
    .order('company', { ascending: true })

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">New Quotation</h1>
      <div className="mt-6">
        <QuotationForm action={createQuotation} customers={customers ?? []} submitLabel="Create Quotation" />
      </div>
    </div>
  )
}