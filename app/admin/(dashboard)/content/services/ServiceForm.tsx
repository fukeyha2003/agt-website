'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type InitialData = {
  title: string
  slug: string
  summary: string | null
  items: string[]
  icon: string | null
  is_published: boolean
  sort_order: number
}

type ServiceFormProps = {
  action: (formData: FormData) => Promise<{ success: true; id: number }>
  initialData?: InitialData
  submitLabel?: string
}

const inputClass =
  'mt-1.5 block h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#062F4F] shadow-sm transition focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30'
const labelClass = 'text-sm font-semibold text-[#062F4F]'

export default function ServiceForm({ action, initialData, submitLabel = 'Save Service' }: ServiceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState('')

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!initialData)
  const [items, setItems] = useState<string[]>(initialData?.items?.length ? initialData.items : [''])

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) {
      setSlug(value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError('')
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const result = await action(formData)
        if (result?.success) router.push('/admin/content/services')
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
            Title <span className="text-[#D89B16]">*</span>
          </label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inputClass}
            placeholder="Petroleum Trading"
          />
        </div>
        <div>
          <label className={labelClass}>
            Slug <span className="text-[#D89B16]">*</span>
          </label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTouched(true)
            }}
            className={inputClass}
            placeholder="petroleum-trading"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Summary</label>
          <textarea
            name="summary"
            rows={3}
            defaultValue={initialData?.summary ?? ''}
            className={`${inputClass} h-auto resize-y py-2.5`}
            placeholder="One or two sentences describing this service"
          />
        </div>
        <div>
          <label className={labelClass}>Icon</label>
          <input name="icon" defaultValue={initialData?.icon ?? ''} className={inputClass} placeholder="fuel, truck, briefcase…" />
        </div>
        <div>
          <label className={labelClass}>Sort Order</label>
          <input type="number" name="sort_order" defaultValue={initialData?.sort_order ?? 0} className={inputClass} />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            defaultChecked={initialData?.is_published ?? true}
            className="h-4 w-4 rounded border-gray-300 text-[#D89B16] focus:ring-[#D89B16]"
          />
          <label htmlFor="is_published" className="text-sm font-medium text-[#062F4F]">
            Published (visible on site)
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Bullet list</label>
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, ''])}
            className="text-sm font-medium text-[#D89B16] hover:underline"
          >
            + Add item
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="item"
                value={item}
                onChange={(e) => setItems((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
                placeholder="e.g. LPG"
                className={`${inputClass} mt-0 flex-1`}
              />
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                aria-label="Remove item"
                className="shrink-0 rounded-lg px-3 text-sm text-red-500 transition hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          ))}
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
        <a href="/admin/content/services" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
    </form>
  )
}