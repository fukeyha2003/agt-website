import { createAdminClient } from '@/app/lib/supabase/admin'
import QuotationForm from '../QuotationForm'
import { createQuotation } from '../actions'

export default async function NewQuotationPage() {
  const supabase = createAdminClient()

  const [{ data: customers }, { data: products }, { data: quoteRequests }] = await Promise.all([
    supabase.from('customers').select('id, company, contact_person').order('company', { ascending: true }),
    supabase.from('products').select('id, name, unit').order('name', { ascending: true }),
    supabase
      .from('quote_requests')
      .select('id, reference, name')
      .not('status', 'in', '(won,lost)')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">New Quotation</h1>
      <div className="mt-6">
        <QuotationForm
          action={createQuotation}
          customers={customers ?? []}
          products={products ?? []}
          quoteRequests={quoteRequests ?? []}
          submitLabel="Create Quotation"
        />
      </div>
    </div>
  )
}