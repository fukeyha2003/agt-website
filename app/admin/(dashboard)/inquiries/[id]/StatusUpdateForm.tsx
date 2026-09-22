'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const OPTIONS = [
  ['new', 'New'],
  ['contacted', 'Contacted'],
  ['quotation_sent', 'Quotation Sent'],
  ['negotiation', 'Negotiation'],
  ['won', 'Won'],
  ['lost', 'Lost'],
]

export default function StatusUpdateForm({ inquiryId, currentStatus }: { inquiryId: number; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleChange(newStatus: string) {
    setStatus(newStatus)
    startTransition(async () => {
      await fetch(`/api/admin/inquiries/${inquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    })
  }

  return (
    <div className="mt-3">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#D89B16] focus:outline-none focus:ring-1 focus:ring-[#D89B16] disabled:opacity-60"
      >
        {OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {isPending && <p className="mt-2 text-xs text-gray-400">Saving…</p>}
    </div>
  )
}