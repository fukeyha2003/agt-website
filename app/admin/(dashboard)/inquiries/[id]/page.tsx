import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/lib/supabase/admin'
import DeleteButton from '../DeleteButton'

function formatDate(value: string | null, withTime = false) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
}

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: inquiry }, { data: quotations }] = await Promise.all([
    supabase.from('quote_requests').select('*').eq('id', id).single(),
    supabase.from('quotations').select('id, number, status').eq('quote_request_id', id),
  ])

  if (!inquiry) notFound()

  // The attachments bucket is private, so make a link that works for 1 hour
  let attachmentUrl: string | null = null
  if (inquiry.attachment_path) {
    const { data } = await supabase.storage.from('quote-attachments').createSignedUrl(inquiry.attachment_path, 60 * 60)
    attachmentUrl = data?.signedUrl ?? null
  }

  const rows: [string, string | null][] = [
    ['Name', inquiry.name],
    ['Company', inquiry.company],
    ['Mobile', inquiry.mobile],
    ['Email', inquiry.email],
    ['Product', inquiry.product],
    ['Quantity', inquiry.quantity],
    ['Delivery Location', inquiry.delivery_location],
    ['Required Date', formatDate(inquiry.required_date)],
    ['Received', formatDate(inquiry.created_at, true)],
  ]

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inquiries" className="text-sm font-medium text-gray-500 hover:text-gray-700">
        ← Inquiries
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Inquiry {inquiry.reference}</h1>
        {quotations && quotations.length === 0 && (
          <Link
            href={`/admin/quotations/new?inquiry=${inquiry.id}`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D89B16] px-4 text-sm font-bold text-white transition hover:bg-[#C58D12]"
          >
            Create Quotation
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th className="w-44 bg-gray-50 px-5 py-3 text-left font-medium text-gray-500">{label}</th>
                <td className="px-5 py-3 text-[#062F4F]">{value || '—'}</td>
              </tr>
            ))}
            <tr>
              <th className="w-44 bg-gray-50 px-5 py-3 text-left align-top font-medium text-gray-500">Message</th>
              <td className="whitespace-pre-wrap px-5 py-3 text-[#062F4F]">{inquiry.message || '—'}</td>
            </tr>
            <tr>
              <th className="w-44 bg-gray-50 px-5 py-3 text-left font-medium text-gray-500">Attachment</th>
              <td className="px-5 py-3">
                {attachmentUrl ? (
                  <a href={attachmentUrl} target="_blank" rel="noreferrer" className="font-medium text-[#D89B16] hover:underline">
                    {inquiry.attachment_name || 'Download file'}
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {quotations && quotations.length > 0 && (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-[#062F4F]">Quotations</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {quotations.map((q) => (
              <li key={q.id} className="flex items-center gap-4">
                <Link href={`/admin/quotations/${q.id}`} className="font-medium text-[#062F4F] hover:underline">
                  {q.number}
                </Link>
                <span className="capitalize text-gray-500">{q.status}</span>
                <Link href={`/admin/quotations/${q.id}/pdf`} target="_blank" className="font-medium text-[#D89B16] hover:underline">
                  PDF
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <DeleteButton id={inquiry.id} reference={inquiry.reference} redirectTo="/admin/inquiries" />
      </div>
    </div>
  )
}
