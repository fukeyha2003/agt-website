'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type InitialData = {
  company: string | null
  contact_person: string
  phone: string | null
  email: string | null
  city: string | null
  address: string | null
}

type CustomerFormProps = {
  action: (formData: FormData) => Promise<{ success: true; id: number }>
  initialData?: InitialData
  submitLabel?: string
}

const inputClass =
  'mt-1.5 block h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#062F4F] shadow-sm transition focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30'
const labelClass = 'text-sm font-semibold text-[#062F4F]'

export default function CustomerForm({ action, initialData, submitLabel = 'Save Customer' }: CustomerFormProps) {
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
        if (result?.success) router.push('/admin/customers')
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      }
    })
  }

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
            Contact Person <span className="text-[#D89B16]">*</span>
          </label>
          <input name="contact_person" required defaultValue={initialData?.contact_person ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Company</label>
          <input name="company" defaultValue={initialData?.company ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input name="phone" type="tel" defaultValue={initialData?.phone ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input name="email" type="email" defaultValue={initialData?.email ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input name="city" defaultValue={initialData?.city ?? ''} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Address</label>
          <textarea name="address" rows={2} defaultValue={initialData?.address ?? ''} className={`${inputClass} h-auto resize-y py-2.5`} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#D89B16] px-6 text-sm font-bold text-white transition hover:bg-[#C58D12] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
        <Link href="/admin/customers" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancel
        </Link>
      </div>
    </form>
  )
}