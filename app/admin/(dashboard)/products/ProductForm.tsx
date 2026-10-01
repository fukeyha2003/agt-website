'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type InitialData = {
  name: string
  slug: string
  unit: string | null
  description: string | null
  is_active: boolean
  sort_order: number
}

type ProductFormProps = {
  action: (formData: FormData) => Promise<{ success: true; id: number }>
  initialData?: InitialData
  submitLabel?: string
}

const inputClass =
  'mt-1.5 block h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#062F4F] shadow-sm transition focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30'
const labelClass = 'text-sm font-semibold text-[#062F4F]'

const UNITS = ['MT', 'Litres', 'KG', 'Drums', 'Cylinders', 'Trips', 'Job']

export default function ProductForm({ action, initialData, submitLabel = 'Save Product' }: ProductFormProps) {
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
        if (result?.success) router.push('/admin/products')
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
            Product Name <span className="text-[#D89B16]">*</span>
          </label>
          <input name="name" required defaultValue={initialData?.name ?? ''} className={inputClass} placeholder="HSD / Diesel" />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={initialData?.slug ?? ''} className={inputClass} placeholder="Generated from the name" />
        </div>
        <div>
          <label className={labelClass}>Default Unit</label>
          <input name="unit" list="product-units" defaultValue={initialData?.unit ?? 'MT'} className={inputClass} />
          <datalist id="product-units">
            {UNITS.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>
        </div>
        <div>
          <label className={labelClass}>Sort Order</label>
          <input name="sort_order" type="number" defaultValue={initialData?.sort_order ?? 0} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialData?.description ?? ''}
            className={`${inputClass} h-auto resize-y py-2.5`}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            defaultChecked={initialData?.is_active ?? true}
            className="h-4 w-4 rounded border-gray-300 text-[#D89B16] focus:ring-[#D89B16]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-[#062F4F]">
            Active product
          </label>
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
        <Link href="/admin/products" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancel
        </Link>
      </div>
    </form>
  )
}
