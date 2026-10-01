'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type InitialData = {
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  coverUrl: string | null
  is_published: boolean
}

type PostFormProps = {
  action: (formData: FormData) => Promise<{ success: true; id: number }>
  initialData?: InitialData
  submitLabel?: string
}

const inputClass =
  'mt-1.5 block h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#062F4F] shadow-sm transition focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30'
const labelClass = 'text-sm font-semibold text-[#062F4F]'

export default function PostForm({ action, initialData, submitLabel = 'Save Post' }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState('')

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!initialData)
  const [preview, setPreview] = useState<string | null>(initialData?.coverUrl ?? null)
  const [removeCover, setRemoveCover] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) {
      setSlug(value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setRemoveCover(false)
    }
  }

  function handleRemoveToggle(checked: boolean) {
    setRemoveCover(checked)
    setPreview(checked ? null : initialData?.coverUrl ?? null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError('')
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const result = await action(formData)
        if (result?.success) router.push('/admin/content/posts')
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
          <input name="title" required value={title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
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
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={initialData?.excerpt ?? ''}
            className={`${inputClass} h-auto resize-y py-2.5`}
            placeholder="Short teaser shown in news listings"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Body</label>
          <textarea
            name="body"
            rows={12}
            defaultValue={initialData?.body ?? ''}
            className={`${inputClass} h-auto resize-y py-2.5 leading-6`}
          />
          <p className="mt-1 text-xs text-gray-400">Plain text. Leave a blank line between paragraphs.</p>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            defaultChecked={initialData?.is_published ?? false}
            className="h-4 w-4 rounded border-gray-300 text-[#D89B16] focus:ring-[#D89B16]"
          />
          <label htmlFor="is_published" className="text-sm font-medium text-[#062F4F]">
            Published (visible on site)
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <p className={labelClass}>Cover Image</p>
        <div className="mt-3 flex items-center gap-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-20 w-32 rounded-lg border border-gray-200 object-cover" />
          ) : (
            <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
              No image
            </div>
          )}
          <div className="flex-1 space-y-2">
            <input
              type="file"
              name="cover_image"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#062F4F] file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#0a3f68]"
            />
            {initialData?.coverUrl && (
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  name="remove_cover"
                  checked={removeCover}
                  onChange={(e) => handleRemoveToggle(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300"
                />
                Remove current image
              </label>
            )}
          </div>
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
        <a href="/admin/content/posts" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
    </form>
  )
}