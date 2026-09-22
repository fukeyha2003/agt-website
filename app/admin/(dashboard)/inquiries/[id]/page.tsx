import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/lib/supabase/admin'
import StatusUpdateForm from './StatusUpdateForm'

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: inquiry } = await supabase.from('quote_requests').select('*').eq('id', id).single()
  if (!inquiry) notFound()

  const FIELDS: [string, string | null][] = [
    ['Name', inquiry.name],
    ['Company', inquiry.company],
    ['Mobile', inquiry.mobile],
    ['Email', inquiry.email],
    ['Product', inquiry.product],
    ['Quantity', inquiry.quantity],
    ['Delivery Location', inquiry.delivery_location],
    ['Required Date', inquiry.required_date],
    ['Message', inquiry.message],
  ]

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">Inquiry</p>
      <h1 className="mt-1 font-serif text-2xl font-bold text-[#062F4F]">{inquiry.reference}</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
                <dd className="mt-1 text-sm text-gray-700">{value || '—'}</dd>
              </div>
            ))}
          </dl>

          {inquiry.attachment_path && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <a href={inquiry.attachment_path} target="_blank" className="text-sm font-medium text-[#062F4F] hover:underline">
                📎 {inquiry.attachment_name || 'View attachment'}
              </a>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#062F4F]">Update Status</h2>
          <StatusUpdateForm inquiryId={inquiry.id} currentStatus={inquiry.status} />
        </div>
      </div>
    </div>
  )
}