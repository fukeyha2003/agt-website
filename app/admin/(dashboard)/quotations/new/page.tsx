import { createAdminClient } from '@/app/lib/supabase/admin'
import { findCustomerId } from '@/app/lib/customers'
import QuotationForm from '../QuotationForm'
import { createQuotation } from '../actions'

// "20 MT" -> { quantity: "20", unit: "MT" }, "5,000 Litres" -> { quantity: "5000", unit: "Litres" }
function splitQuantity(text: string) {
  const match = text.match(/([\d][\d,]*(?:\.\d+)?)\s*([A-Za-z][A-Za-z ./]*)?/)
  if (!match) return { quantity: '', unit: 'MT' }
  return { quantity: match[1].replace(/,/g, ''), unit: match[2]?.trim() || 'MT' }
}

export default async function NewQuotationPage({ searchParams }: { searchParams: Promise<{ inquiry?: string }> }) {
  const { inquiry: inquiryId } = await searchParams
  const supabase = createAdminClient()

  const [{ data: customers }, { data: inquiry }] = await Promise.all([
    supabase.from('customers').select('id, company, contact_person').order('company', { ascending: true }),
    inquiryId
      ? supabase
          .from('quote_requests')
          .select('id, reference, name, company, mobile, email, product, quantity, delivery_location')
          .eq('id', inquiryId)
          .single()
      : Promise.resolve({ data: null }),
  ])

  let initialData = undefined
  if (inquiry) {
    const existingCustomerId = await findCustomerId(supabase, inquiry.email, inquiry.mobile)
    const { quantity, unit } = splitQuantity(inquiry.quantity ?? '')

    initialData = {
      customer_id: existingCustomerId,
      quote_request_id: inquiry.id,
      new_customer: existingCustomerId
        ? null
        : {
            company: inquiry.company ?? '',
            contact_person: inquiry.name ?? '',
            phone: inquiry.mobile ?? '',
            email: inquiry.email ?? '',
          },
      quotation_date: new Date().toISOString().slice(0, 10),
      valid_until: null,
      delivery_location: inquiry.delivery_location,
      payment_terms: null,
      remarks: null,
      currency: 'PKR',
      tax_percent: 0,
      items: [{ description: inquiry.product ?? '', quantity, unit, unit_price: '' }],
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">New Quotation</h1>
      {inquiry && (
        <p className="mt-1 text-sm text-gray-500">
          From inquiry <span className="font-medium text-[#062F4F]">{inquiry.reference}</span>, details filled in. Add
          the price and save.
        </p>
      )}
      <div className="mt-6">
        <QuotationForm
          action={createQuotation}
          customers={customers ?? []}
          initialData={initialData}
          submitLabel="Create Quotation"
        />
      </div>
    </div>
  )
}
