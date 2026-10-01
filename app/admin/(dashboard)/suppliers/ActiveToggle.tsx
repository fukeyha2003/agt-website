'use client'

import { useTransition } from 'react'
import { toggleSupplierActive } from './actions'

export default function ActiveToggle({ id, isActive }: { id: number; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={isActive}
      onClick={() => startTransition(() => toggleSupplierActive(id, isActive))}
      className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${
        isActive ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          isActive ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}