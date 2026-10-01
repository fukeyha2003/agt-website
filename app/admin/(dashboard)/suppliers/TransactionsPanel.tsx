'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addTransaction, deleteTransaction } from './actions'

type ProductOption = { id: number; name: string }

type Transaction = {
  id: number
  product_id: number | null
  transaction_date: string
  reference: string | null
  quantity: number | null
  unit: string | null
  amount: number | null
  currency: string
  notes: string | null
}

const inputClass =
  'block h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-[#062F4F] focus:border-[#D89B16] focus:outline-none focus:ring-2 focus:ring-[#D89B16]/30'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

export default function TransactionsPanel({
  supplierId,
  products,
  transactions,
}: {
  supplierId: number
  products: ProductOption[]
  transactions: Transaction[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const productName = (id: number | null) => products.find((p) => p.id === id)?.name ?? '—'

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      try {
        await addTransaction(supplierId, formData)
        form.reset()
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save the transaction.')
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this transaction?')) return
    startTransition(async () => {
      await deleteTransaction(id, supplierId)
      router.refresh()
    })
  }

  return (
    <div className="mt-10 max-w-4xl">
      <h2 className="font-serif text-lg font-bold text-[#062F4F]">Transaction History</h2>

      <div className="mt-3 overflow-hidden rounded-xl bg-white shadow-sm">
        {transactions.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(t.transaction_date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-[#062F4F]">
                    {t.reference || '—'}
                    {t.notes && <span className="block text-xs text-gray-400">{t.notes}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{productName(t.product_id)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {t.quantity != null ? `${t.quantity} ${t.unit ?? ''}` : '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#062F4F]">
                    {t.amount != null
                      ? `${t.currency} ${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      disabled={isPending}
                      className="text-red-600 transition hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-6 text-sm text-gray-400">No transactions recorded yet.</p>
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-4 rounded-xl border border-gray-100 bg-white p-5">
        <p className="text-sm font-semibold text-[#062F4F]">Record a transaction</p>

        {error && (
          <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input type="date" name="transaction_date" required defaultValue={todayString()} className={inputClass} />
          <input name="reference" placeholder="Reference / PO #" className={inputClass} />
          <select name="product_id" defaultValue="" className={inputClass}>
            <option value="">Product (optional)</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input type="number" step="0.001" name="quantity" placeholder="Quantity" className={inputClass} />
          <input name="unit" placeholder="Unit (MT)" className={inputClass} />
          <input type="number" step="0.01" name="amount" placeholder="Amount" className={inputClass} />
          <input name="currency" defaultValue="PKR" className={inputClass} />
          <input name="notes" placeholder="Notes" className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-[#062F4F] px-5 text-sm font-bold text-white transition hover:bg-[#0a3f68] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Saving…' : 'Add Transaction'}
        </button>
      </form>
    </div>
  )
}