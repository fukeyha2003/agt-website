'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type ProductOption = { id: number; name: string }

type InitialData = {
  name: string
  country: string | null
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  terms: string | null
  is_active: boolean
  product_ids: number[]
}

type SupplierFormProps = {
  action: (formData: FormData) => Promise<{ success: true; id: number }>
  products: ProductOption[]
  initialData?: InitialData
  submitLabel?: string
}

const inputClass =
  'mt-1.5 block h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#062F4F] shadow-sm transition focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30'
const labelClass = 'text-sm font-semibold text-[#062F4F]'

export default function SupplierForm({ action, products, initialData, submitLabel = 'Save Supplier' }: SupplierFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError('')
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const result = await action(formData)
        if (result?.success) router.push('/admin/suppliers')
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      }
    })
  }

  const linked = initialData?.product_ids ?? []

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {submitError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 rounded-xl border border-gray-100 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Supplier Name <span className="text-[#D89B16]">*</span>
          </label>
          <input name="name" required defaultValue={initialData?.name ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input name="country" defaultValue={initialData?.country ?? ''} className={inputClass} placeholder="Pakistan, UAE…" />
        </div>
        <div>
          <label className={labelClass}>Contact Person</label>
          <input name="contact_person" defaultValue={initialData?.contact_person ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input name="phone" type="tel" defaultValue={initialData?.phone ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input name="email" type="email" defaultValue={initialData?.email ?? ''} className={inputClass} />
        </div>
        <div className="flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            defaultChecked={initialData?.is_active ?? true}
            className="h-4 w-4 rounded border-gray-300 text-[#D89B16] focus:ring-[#D89B16]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-[#062F4F]">
            Active supplier
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Address</label>
          <textarea name="address" rows={2} defaultValue={initialData?.address ?? ''} className={`${inputClass} h-auto resize-y py-2.5`} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Payment / Delivery Terms</label>
          <textarea name="terms" rows={3} defaultValue={initialData?.terms ?? ''} className={`${inputClass} h-auto resize-y py-2.5`} />
        </div>
      </div>

      {products.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className={labelClass}>Products this supplier can provide</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {products.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm text-[#062F4F]">
                <input
                  type="checkbox"
                  name="product_id"
                  value={p.id}
                  defaultChecked={linked.includes(p.id)}
                  className="h-4 w-4 rounded border-gray-300 text-[#D89B16] focus:ring-[#D89B16]"
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#D89B16] px-6 text-sm font-bold text-white transition hover:bg-[#C58D12] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
        <Link href="/admin/suppliers" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancel
        </Link>
      </div>
    </form>
  )
}