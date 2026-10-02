import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/lib/supabase/admin'
import CustomerForm from '../CustomerForm'
import { updateCustomer } from '../actions'

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: customer }, { data: quotations }] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase
      .from('quotations')
      .select('id, number, quotation_date, currency, total, status')
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!customer) notFound()

  const boundUpdate = updateCustomer.bind(null, customer.id)

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">
        Edit Customer — {customer.company || customer.contact_person}
      </h1>

      <div className="mt-6">
        <CustomerForm
          action={boundUpdate}
          submitLabel="Save Changes"
          initialData={{
            company: customer.company,
            contact_person: customer.contact_person,
            phone: customer.phone,
            email: customer.email,
            city: customer.city,
            address: customer.address,
          }}
        />
      </div>

      <div className="mt-10 max-w-3xl">
        <h2 className="font-serif text-lg font-bold text-[#062F4F]">Quotations</h2>
        <div className="mt-3 overflow-hidden rounded-xl bg-white shadow-sm">
          {quotations && quotations.length > 0 ? (
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-gray-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/quotations/${q.id}`} className="font-medium text-[#062F4F] hover:underline">
                        {q.number}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(q.quotation_date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3 font-medium text-[#062F4F]">
                      {q.currency} {Number(q.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 capitalize text-gray-500">{q.status}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/quotations/${q.id}/pdf`} target="_blank" className="font-medium text-[#062F4F] hover:underline">
                        PDF
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-6 text-sm text-gray-400">No quotations for this customer yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}