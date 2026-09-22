'use client'

import { useRef, useState } from 'react'
import { QUOTE_PRODUCTS } from '@/app/lib/quote-products'

type FieldName =
  | 'name'
  | 'company'
  | 'mobile'
  | 'email'
  | 'product'
  | 'quantity'
  | 'delivery_location'
  | 'required_date'

const FIELDS: {
  name: FieldName
  label: string
  type: string
  required: boolean
  max?: number
  autoComplete?: string
  placeholder: string
}[] = [
  { name: 'name', label: 'Full Name', type: 'text', required: true, max: 120, autoComplete: 'name', placeholder: 'Your full name' },
  { name: 'company', label: 'Company', type: 'text', required: false, max: 160, autoComplete: 'organization', placeholder: 'Company name' },
  { name: 'mobile', label: 'Mobile', type: 'tel', required: true, max: 20, autoComplete: 'tel', placeholder: '+92 3XX XXXXXXX' },
  { name: 'email', label: 'Email', type: 'email', required: true, max: 160, autoComplete: 'email', placeholder: 'you@company.com' },
  { name: 'product', label: 'Product', type: 'select', required: true, placeholder: 'Select a product or service' },
  { name: 'quantity', label: 'Required Quantity', type: 'text', required: true, max: 100, placeholder: 'e.g. 20 MT or 5,000 Litres' },
  { name: 'delivery_location', label: 'Delivery Location', type: 'text', required: true, max: 200, placeholder: 'City, depot or terminal' },
  { name: 'required_date', label: 'Required Date', type: 'date', required: false, placeholder: '' },
]

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']

function todayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function validateField(name: FieldName, value: string): string {
  switch (name) {
    case 'name':
      if (!value) return 'Please enter your full name.'
      if (value.length < 2) return 'Your name looks too short.'
      if (value.length > 120) return 'Please keep your name under 120 characters.'
      if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(value)) return "Please use letters only (spaces, dots and hyphens are fine)."
      return ''
    case 'company':
      if (value.length > 160) return 'Please keep the company name under 160 characters.'
      return ''
    case 'mobile': {
      if (!value) return 'Please enter your mobile number.'
      const n = value.replace(/[\s\-()]/g, '')
      if (!/^\+?\d+$/.test(n)) return 'Use only numbers, spaces, dashes and an optional + at the start.'
      if (/^03/.test(n)) {
        if (n.length !== 11) return 'Pakistani mobile numbers have 11 digits, e.g. 0331 1234567.'
        return ''
      }
      if (/^(\+92|0092|92)/.test(n)) {
        const rest = n.replace(/^(\+92|0092|92)/, '')
        if (rest.length !== 10) return 'Enter the number as +92 331 1234567 (10 digits after +92).'
        return ''
      }
      const digits = n.replace(/^\+/, '')
      if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number (7 to 15 digits).'
      return ''
    }
    case 'email':
      if (!value) return 'Please enter your email address.'
      if (value.length > 160) return 'That email address is too long.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Please enter a valid email, e.g. name@company.com.'
      return ''
    case 'product':
      if (!value) return 'Please select a product or service.'
      return ''
    case 'quantity':
      if (!value) return 'Please enter the quantity you need.'
      if (!/\d/.test(value)) return 'Include a number, e.g. 20 MT or 5,000 Litres.'
      if (value.length > 100) return 'Please keep this under 100 characters.'
      return ''
    case 'delivery_location':
      if (!value) return 'Please enter the delivery location.'
      if (value.length < 3) return 'Please enter a fuller location (city, depot or terminal).'
      if (value.length > 200) return 'Please keep the location under 200 characters.'
      return ''
    case 'required_date':
      if (value && value < todayString()) return 'The required date cannot be in the past.'
      return ''
    default:
      return ''
  }
}

function checkFile(file: File | null): string {
  if (!file) return ''
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (!ALLOWED_EXT.includes(ext)) return 'Please upload a PDF, Word, Excel, JPG or PNG file.'
  if (file.size > MAX_FILE_BYTES) return 'The file must be 5 MB or smaller.'
  return ''
}

const baseInput =
  'block h-12 w-full rounded-lg border bg-white px-4 text-sm text-[#062F4F] shadow-sm transition placeholder:text-[#062F4F]/40 focus:outline-none focus:ring-2'
const defaultBorder = 'border-[#062F4F]/15 hover:border-[#062F4F]/30 focus:border-[#D89B16] focus:ring-[#D89B16]/30'
const errorBorder = '!border-red-500 focus:!border-red-500 focus:!ring-red-500/25'
const errorText = 'mt-1.5 text-xs font-medium text-red-600'

const emptyValues: Record<FieldName, string> = {
  name: '',
  company: '',
  mobile: '',
  email: '',
  product: '',
  quantity: '',
  delivery_location: '',
  required_date: '',
}

export default function QuoteForm() {
  const [values, setValues] = useState<Record<FieldName, string>>(emptyValues)
  const [message, setMessageValue] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [reference, setReference] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function setField(name: FieldName, value: string) {
    setValues((v) => ({ ...v, [name]: value }))
    if (touched[name]) {
      setErrors((e) => ({ ...e, [name]: validateField(name, value) }))
    }
  }

  function blurField(name: FieldName) {
    setTouched((t) => ({ ...t, [name]: true }))
    const trimmed = values[name].trim()
    setValues((v) => ({ ...v, [name]: trimmed }))
    setErrors((e) => ({ ...e, [name]: validateField(name, trimmed) }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null
    const err = checkFile(f)
    if (err) {
      setErrors((prev) => ({ ...prev, attachment: err }))
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } else {
      setErrors((prev) => ({ ...prev, attachment: '' }))
      setFile(f)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    ;(Object.keys(values) as FieldName[]).forEach((name) => {
      newErrors[name] = validateField(name, values[name])
    })
    newErrors.message = message.length > 3000 ? 'Please keep your message under 3,000 characters.' : ''
    newErrors.attachment = checkFile(file)

    setTouched(
      Object.fromEntries(
        (Object.keys(values) as string[]).concat(['message', 'attachment']).map((k) => [k, true])
      )
    )
    setErrors(newErrors)

    const firstInvalidName = Object.keys(newErrors).find((k) => newErrors[k])
    if (firstInvalidName) {
      const el = formRef.current?.elements.namedItem(firstInvalidName) as HTMLElement | null
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      el?.focus()
      return
    }

    setSubmitting(true)
    setStatus('idle')

    try {
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => formData.append(k, v))
      formData.append('message', message)
      if (file) formData.append('attachment', file)

      const res = await fetch('/api/request-quote', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrors(data.errors || { form: 'Something went wrong. Please try again.' })
        setStatus('error')
        return
      }

      setStatus('success')
      setReference(data.reference)
      setValues(emptyValues)
      setMessageValue('')
      setFile(null)
      setTouched({})
      setErrors({})
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrors({ form: 'Network error — please check your connection and try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const hasErrors = Object.values(errors).some(Boolean)

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(6,47,79,0.14)] ring-1 ring-[#062F4F]/5 sm:p-8 lg:p-10">
        <h2 className="font-serif text-2xl font-bold text-[#062F4F] sm:text-[28px]">Thank you — request received</h2>
        <p className="mt-3 text-sm leading-6 text-[#062F4F]/70">
          Your reference number is <span className="font-bold text-[#062F4F]">{reference}</span>. Our team will review
          your requirement and get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-[#062F4F] px-6 text-sm font-bold text-white transition hover:bg-[#0a3f68]"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="scroll-mt-6 rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(6,47,79,0.14)] ring-1 ring-[#062F4F]/5 sm:p-8 lg:p-10"
    >
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-[-0.01em] text-[#062F4F] sm:text-[28px]">
          Tell us what you need
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#062F4F]/70">
          Fields marked <span className="font-bold text-[#D89B16]">*</span> are required.
        </p>
      </div>

      {(hasErrors && Object.keys(touched).length > 0) || status === 'error' ? (
        <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errors.form || 'Please fix the highlighted fields and submit again.'}
        </div>
      ) : null}

      <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-semibold text-[#062F4F]">
              {field.label}
              {field.required && <span className="text-[#D89B16]"> *</span>}
            </label>

            {field.type === 'select' ? (
              <div className="relative mt-1.5">
                <select
                  id={field.name}
                  name={field.name}
                  required
                  value={values[field.name]}
                  onChange={(e) => setField(field.name, e.target.value)}
                  onBlur={() => blurField(field.name)}
                  className={`${baseInput} ${errors[field.name] ? errorBorder : defaultBorder} appearance-none pr-11`}
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {Object.entries(QUOTE_PRODUCTS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#062F4F]/60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={values[field.name]}
                onChange={(e) => setField(field.name, e.target.value)}
                onBlur={() => blurField(field.name)}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                maxLength={field.max}
                inputMode={field.type === 'tel' ? 'tel' : undefined}
                min={field.type === 'date' ? todayString() : undefined}
                required={field.required}
                className={`${baseInput} ${errors[field.name] ? errorBorder : defaultBorder} mt-1.5`}
              />
            )}

            {errors[field.name] && <p className={errorText}>{errors[field.name]}</p>}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-semibold text-[#062F4F]">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={3000}
            value={message}
            onChange={(e) => setMessageValue(e.target.value)}
            placeholder="Grade or specification, delivery terms, or anything else we should know."
            className={`${baseInput.replace('h-12', 'min-h-[140px]')} ${errors.message ? errorBorder : defaultBorder} mt-1.5 resize-y py-3 leading-6`}
          />
          <div className="flex items-start justify-between gap-3">
            {errors.message && <p className={errorText}>{errors.message}</p>}
            <p className="ml-auto mt-1.5 shrink-0 text-xs tabular-nums text-[#062F4F]/50">
              {message.length.toLocaleString('en-US')} / 3,000
            </p>
          </div>
        </div>

        <div className="sm:col-span-2">
          <span className="block text-sm font-semibold text-[#062F4F]">
            Upload Document <span className="font-normal text-[#062F4F]/55">(optional)</span>
          </span>
          <label
            htmlFor="attachment"
            className={`mt-1.5 flex cursor-pointer items-center gap-4 rounded-lg border border-dashed px-4 py-4 transition border-[#062F4F]/25 bg-[#F6F8FB] hover:border-[#D89B16] focus-within:border-[#D89B16] focus-within:ring-2 focus-within:ring-[#D89B16]/30 ${
              errors.attachment ? '!border-red-500 !bg-red-50/40 focus-within:!ring-red-500/25' : ''
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#062F4F] text-[#E5B33A]">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#062F4F]">
                {file ? file.name : 'Choose a file'}
              </span>
              <span className="block text-xs text-[#062F4F]/60">PDF, Word, Excel, JPG or PNG. Up to 5 MB.</span>
            </span>
            <input
              ref={fileInputRef}
              id="attachment"
              name="attachment"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          {errors.attachment && <p className={errorText}>{errors.attachment}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-[#062F4F]/60">
          Your details are used only to respond to this inquiry.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-[#D89B16] px-9 text-sm font-bold text-white shadow-[0_8px_25px_rgba(216,155,22,0.22)] ring-1 ring-inset ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C58D12] hover:shadow-[0_12px_30px_rgba(216,155,22,0.32)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B33A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto sm:min-w-[220px]"
        >
          <span>{submitting ? 'Sending…' : 'Submit Inquiry'}</span>
          {!submitting ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <path d="M12 3a9 9 0 1 0 9 9" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}