'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Values = {
  hero_headline: string
  hero_subtext: string
  about_body: string
  contact_address: string
  contact_phone_1: string
  contact_phone_2: string
  contact_email: string
}

const inputClass =
  'mt-1.5 block h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#062F4F] shadow-sm transition focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30'
const areaClass = `${inputClass} h-auto resize-y py-2.5 leading-6`
const labelClass = 'text-sm font-semibold text-[#062F4F]'

export default function SettingsForm({
  action,
  initialValues,
}: {
  action: (formData: FormData) => Promise<{ success: true }>
  initialValues: Values
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSaved(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await action(formData)
        setSaved(true)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save settings.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Settings saved.
        </div>
      )}

      <section className="space-y-5 rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="font-serif text-lg font-bold text-[#062F4F]">Hero</h2>
        <div>
          <label className={labelClass}>Headline</label>
          <input name="hero_headline" defaultValue={initialValues.hero_headline} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Sub-text</label>
          <textarea name="hero_subtext" rows={3} defaultValue={initialValues.hero_subtext} className={areaClass} />
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="font-serif text-lg font-bold text-[#062F4F]">About</h2>
        <div>
          <label className={labelClass}>About text</label>
          <textarea name="about_body" rows={8} defaultValue={initialValues.about_body} className={areaClass} />
          <p className="mt-1 text-xs text-gray-400">Plain text. Leave a blank line between paragraphs.</p>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="font-serif text-lg font-bold text-[#062F4F]">Contact details</h2>
        <div>
          <label className={labelClass}>Office address</label>
          <textarea name="contact_address" rows={2} defaultValue={initialValues.contact_address} className={areaClass} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone 1</label>
            <input name="contact_phone_1" type="tel" defaultValue={initialValues.contact_phone_1} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone 2</label>
            <input name="contact_phone_2" type="tel" defaultValue={initialValues.contact_phone_2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Email</label>
            <input name="contact_email" type="email" defaultValue={initialValues.contact_email} className={inputClass} />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#D89B16] px-6 text-sm font-bold text-white transition hover:bg-[#C58D12] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  )
}