import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import QuotationForm from '../QuotationForm'
import { updateQuotation } from '../actions'

export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: quotation }, { data: items }, { data: customers }] = await Promise.all([
    supabase.from('quotations').select('*').eq('id', id).single(),
    supabase.from('quotation_items').select('*').eq('quotation_id', id).order('sort_order', { ascending: true }),
    supabase.from('customers').select('id, company, contact_person').order('company', { ascending: true }),
  ])

  if (!quotation) notFound()

  const boundUpdate = updateQuotation.bind(null, quotation.id)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Edit Quotation — {quotation.number}</h1>
        <Link
          href={`/admin/quotations/${quotation.id}/pdf`}
          target="_blank"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[#062F4F]/15 px-4 text-sm font-medium text-[#062F4F] transition hover:bg-gray-50"
        >
          View / Print PDF
        </Link>
      </div>
      <div className="mt-6">
        <QuotationForm
          action={boundUpdate}
          customers={customers ?? []}
          submitLabel="Save Changes"
          initialData={{
            customer_id: quotation.customer_id,
            quotation_date: quotation.quotation_date,
            valid_until: quotation.valid_until,
            delivery_location: quotation.delivery_location,
            payment_terms: quotation.payment_terms,
            remarks: quotation.remarks,
            currency: quotation.currency,
            tax_percent: quotation.tax_percent,
            items: (items ?? []).map((it) => ({
              description: it.description,
              quantity: String(it.quantity),
              unit: it.unit,
              unit_price: String(it.unit_price),
            })),
          }}
        />
      </div>
    </div>
  )
}