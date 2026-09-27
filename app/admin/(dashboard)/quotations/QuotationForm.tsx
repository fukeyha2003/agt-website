'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Customer = { id: number; company: string | null; contact_person: string }
type ProductOption = { id: number; name: string; unit: string | null }
type QuoteRequestOption = { id: number; reference: string; name: string }

type Item = { product_id: string; description: string; quantity: string; unit: string; unit_price: string }

type InitialData = {
  customer_id: number
  quote_request_id: number | null
  quotation_date: string
  valid_until: string | null
  delivery_location: string | null
  payment_terms: string | null
  remarks: string | null
  currency: string
  tax_percent: number
  items: Item[]
}

type QuotationFormProps = {
  action: (formData: FormData) => Promise<{ success: true; id: number }>
  customers: Customer[]
  products: ProductOption[]
  quoteRequests: QuoteRequestOption[]
  initialData?: InitialData
  submitLabel?: string
}

const inputClass =
  'mt-1.5 block h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#062F4F] shadow-sm transition focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30'
const labelClass = 'text-sm font-semibold text-[#062F4F]'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function plus30Days() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

const emptyItem: Item = { product_id: '', description: '', quantity: '', unit: 'MT', unit_price: '' }

export default function QuotationForm({
  action,
  customers,
  products,
  quoteRequests,
  initialData,
  submitLabel = 'Save Quotation',
}: QuotationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState('')
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing')
  const [items, setItems] = useState<Item[]>(initialData?.items?.length ? initialData.items : [emptyItem])
  const [taxPercent, setTaxPercent] = useState(String(initialData?.tax_percent ?? 0))

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError('')
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const result = await action(formData)
        if (result?.success) router.push('/admin/quotations')
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      }
    })
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => {
      const q = parseFloat(it.quantity) || 0
      const p = parseFloat(it.unit_price) || 0
      return sum + q * p
    }, 0)
    const tax = subtotal * ((parseFloat(taxPercent) || 0) / 100)
    return { subtotal, tax, total: subtotal + tax }
  }, [items, taxPercent])

  function updateItem(index: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  function handleProductPick(index: number, productId: string) {
    const product = products.find((p) => String(p.id) === productId)
    updateItem(index, {
      product_id: productId,
      description: items[index].description || product?.name || '',
      unit: product?.unit || items[index].unit,
    })
  }

  const currency = initialData?.currency ?? 'PKR'

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {submitError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {submitError}
        </div>
      )}

      {/* Customer */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-4">
          <label className={labelClass}>Customer</label>
          <div className="flex gap-3 text-sm">
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                checked={customerMode === 'existing'}
                onChange={() => setCustomerMode('existing')}
                className="h-3.5 w-3.5"
              />
              Existing
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                checked={customerMode === 'new'}
                onChange={() => setCustomerMode('new')}
                className="h-3.5 w-3.5"
              />
              New customer
            </label>
          </div>
        </div>

        {customerMode === 'existing' ? (
          <select name="customer_id" defaultValue={initialData?.customer_id ?? ''} className={`${inputClass} max-w-md`}>
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company ? `${c.company} — ${c.contact_person}` : c.contact_person}
              </option>
            ))}
          </select>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input type="hidden" name="new_customer" value="on" />
            <input name="new_company" placeholder="Company" className={inputClass} />
            <input name="new_contact_person" required placeholder="Contact person *" className={inputClass} />
            <input name="new_phone" placeholder="Phone" className={inputClass} />
            <input name="new_email" placeholder="Email" type="email" className={inputClass} />
          </div>
        )}

        {quoteRequests.length > 0 && (
          <div className="mt-4">
            <label className={labelClass}>Linked Inquiry (optional)</label>
            <select name="quote_request_id" defaultValue={initialData?.quote_request_id ?? ''} className={`${inputClass} max-w-md`}>
              <option value="">— None —</option>
              {quoteRequests.map((qr) => (
                <option key={qr.id} value={qr.id}>
                  {qr.reference} — {qr.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-5 rounded-xl border border-gray-100 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Quotation Date</label>
          <input type="date" name="quotation_date" defaultValue={initialData?.quotation_date ?? todayString()} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Valid Until</label>
          <input type="date" name="valid_until" defaultValue={initialData?.valid_until ?? plus30Days()} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Delivery Location</label>
          <input name="delivery_location" defaultValue={initialData?.delivery_location ?? ''} className={inputClass} placeholder="City, depot or terminal" />
        </div>
        <div>
          <label className={labelClass}>Payment Terms</label>
          <input name="payment_terms" defaultValue={initialData?.payment_terms ?? ''} className={inputClass} placeholder="e.g. 50% advance, balance on delivery" />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <input name="currency" defaultValue={currency} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tax %</label>
          <input
            type="number"
            step="0.01"
            name="tax_percent"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Remarks</label>
          <textarea name="remarks" rows={3} defaultValue={initialData?.remarks ?? ''} className={`${inputClass} h-auto resize-y py-2.5`} />
        </div>
      </div>

      {/* Line items */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Line Items</label>
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, emptyItem])}
            className="text-sm font-medium text-[#D89B16] hover:underline"
          >
            + Add item
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {items.map((item, i) => {
            const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
            return (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-gray-100 p-3 sm:grid-cols-12 sm:items-start">
                <select
                  value={item.product_id}
                  onChange={(e) => handleProductPick(i, e.target.value)}
                  className={`${inputClass} mt-0 sm:col-span-3`}
                >
                  <option value="">Product (optional)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input type="hidden" name="item_product_id" value={item.product_id} />

                <input
                  name="item_description"
                  required
                  value={item.description}
                  onChange={(e) => updateItem(i, { description: e.target.value })}
                  placeholder="Description"
                  className={`${inputClass} mt-0 sm:col-span-3`}
                />
                <input
                  type="number"
                  step="0.001"
                  name="item_quantity"
                  required
                  value={item.quantity}
                  onChange={(e) => updateItem(i, { quantity: e.target.value })}
                  placeholder="Qty"
                  className={`${inputClass} mt-0 sm:col-span-1`}
                />
                <input
                  name="item_unit"
                  value={item.unit}
                  onChange={(e) => updateItem(i, { unit: e.target.value })}
                  placeholder="Unit"
                  className={`${inputClass} mt-0 sm:col-span-1`}
                />
                <input
                  type="number"
                  step="0.01"
                  name="item_unit_price"
                  required
                  value={item.unit_price}
                  onChange={(e) => updateItem(i, { unit_price: e.target.value })}
                  placeholder="Unit Price"
                  className={`${inputClass} mt-0 sm:col-span-2`}
                />
                <div className="flex h-11 items-center justify-between gap-2 text-sm font-medium text-[#062F4F] sm:col-span-2">
                  <span>
                    {lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label="Remove item"
                    className="shrink-0 rounded-lg px-2 text-red-500 transition hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>
                {currency} {totals.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax ({taxPercent || 0}%)</span>
              <span>
                {currency} {totals.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-1.5 text-base font-bold text-[#062F4F]">
              <span>Total</span>
              <span>
                {currency} {totals.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
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
        <a href="/admin/quotations" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
    </form>
  )
}