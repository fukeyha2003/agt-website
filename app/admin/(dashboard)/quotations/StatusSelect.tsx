'use client'

import { useTransition } from 'react'
import { updateQuotationStatus } from './actions'

const STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired']

const STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-amber-100 text-amber-700',
}

export default function StatusSelect({ id, status }: { id: number; status: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateQuotationStatus(id, e.target.value))}
      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-[#D89B16]/40 disabled:opacity-50 ${STYLES[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}