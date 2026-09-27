import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { createAdminClient } from '@/app/lib/supabase/admin'
import PrintButton from './PrintButton'
import LogoImage from './LogoImage'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  rejected: 'Rejected',
  expired: 'Expired',
}

export const metadata = {
  title: 'AG Oil & Gas Traders',
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

function money(value: number) {
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function QuotationPdfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // This route sits outside app/admin/(dashboard)/, so it doesn't inherit that
  // layout's auth redirect — check the session here too.
  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  if (!user) redirect('/admin/login')

  const supabase = createAdminClient()

  const { data: quotation } = await supabase
    .from('quotations')
    .select('*, customers(company, contact_person, phone, email, city, address)')
    .eq('id', id)
    .single()

  if (!quotation) notFound()

  const { data: items } = await supabase
    .from('quotation_items')
    .select('*')
    .eq('quotation_id', id)
    .order('sort_order', { ascending: true })

  let inquiryReference: string | null = null
  if (quotation.quote_request_id) {
    const { data: qr } = await supabase
      .from('quote_requests')
      .select('reference')
      .eq('id', quotation.quote_request_id)
      .single()
    inquiryReference = qr?.reference ?? null
  }

  const customer = Array.isArray(quotation.customers) ? quotation.customers[0] : quotation.customers

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          @page { size: A4; margin: 15mm; }
          body { background: white; }
        }
      `}</style>

      <div className="no-print mx-auto mb-4 flex max-w-[820px] items-center justify-between px-4">
        <a href={`/admin/quotations/${id}`} className="text-sm font-medium text-gray-500 hover:text-gray-700">
          ← Back to edit
        </a>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-[820px] bg-white px-10 py-10 shadow-sm print:shadow-none print:px-0 print:py-0">
        {/* Letterhead */}
        <div className="flex items-start justify-between border-b-2 border-[#062F4F] pb-6">
          <div className="flex items-start gap-3">
            <LogoImage />
            <div>
              <p className="font-serif text-2xl font-bold text-[#062F4F]">
                AG <span className="text-[#D89B16]">OIL &amp; GAS TRADERS</span>
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                Petroleum · Lubricants · Energy · Logistics Solutions
              </p>
              <div className="mt-3 space-y-0.5 text-xs leading-5 text-gray-600">
                <p>Office# R-57, Sector Z-6, Gulshan-e-Maymar, Karachi</p>
                <p>+92 331 1363614 · +92 332 3361352</p>
                <p>agogt77@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl font-bold text-[#062F4F]">QUOTATION</p>
            <p className="mt-1 text-sm font-semibold text-[#D89B16]">{quotation.number}</p>
            <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {STATUS_LABELS[quotation.status] ?? quotation.status}
            </span>
          </div>
        </div>

        {/* Meta + Bill To */}
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Bill To</p>
            <p className="mt-1.5 text-sm font-bold text-[#062F4F]">{customer?.company || customer?.contact_person}</p>
            {customer?.company && <p className="text-sm text-gray-600">{customer.contact_person}</p>}
            {customer?.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
            {customer?.email && <p className="text-sm text-gray-600">{customer.email}</p>}
            {customer?.address && <p className="text-sm text-gray-600">{customer.address}</p>}
            {inquiryReference && <p className="mt-1.5 text-xs text-gray-400">Ref. Inquiry: {inquiryReference}</p>}
          </div>
          <div className="text-right">
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-400">Date: </span>
                <span className="font-medium text-[#062F4F]">{formatDate(quotation.quotation_date)}</span>
              </p>
              <p>
                <span className="text-gray-400">Valid Until: </span>
                <span className="font-medium text-[#062F4F]">{formatDate(quotation.valid_until)}</span>
              </p>
              {quotation.delivery_location && (
                <p>
                  <span className="text-gray-400">Delivery: </span>
                  <span className="font-medium text-[#062F4F]">{quotation.delivery_location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <table className="mt-8 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-[#062F4F] text-left text-xs uppercase tracking-wide text-[#062F4F]">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">Description</th>
              <th className="py-2 pr-2 text-right">Qty</th>
              <th className="py-2 pr-2">Unit</th>
              <th className="py-2 pr-2 text-right">Unit Price</th>
              <th className="py-2 pl-2 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, i) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2.5 pr-2 text-gray-400">{i + 1}</td>
                <td className="py-2.5 pr-2 text-[#062F4F]">{item.description}</td>
                <td className="py-2.5 pr-2 text-right text-gray-600">{item.quantity}</td>
                <td className="py-2.5 pr-2 text-gray-600">{item.unit}</td>
                <td className="py-2.5 pr-2 text-right text-gray-600">{money(item.unit_price)}</td>
                <td className="py-2.5 pl-2 text-right font-medium text-[#062F4F]">{money(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 flex justify-end">
          <div className="w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>
                {quotation.currency} {money(quotation.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax ({quotation.tax_percent}%)</span>
              <span>
                {quotation.currency} {money(quotation.tax_amount)}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-[#062F4F] pt-1.5 text-base font-bold text-[#062F4F]">
              <span>Total</span>
              <span>
                {quotation.currency} {money(quotation.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Terms / Remarks */}
        {(quotation.payment_terms || quotation.remarks) && (
          <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
            {quotation.payment_terms && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Payment Terms</p>
                <p className="mt-1 text-sm text-gray-700">{quotation.payment_terms}</p>
              </div>
            )}
            {quotation.remarks && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Remarks</p>
                <p className="mt-1 text-sm text-gray-700">{quotation.remarks}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          Thank you for considering AG Oil &amp; Gas Traders. For questions about this quotation, contact us at
          agogt77@gmail.com or +92 331 1363614.
        </div>
      </div>
    </div>
  )
}