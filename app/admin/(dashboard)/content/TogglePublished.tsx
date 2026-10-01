'use client'

import { useTransition } from 'react'

export default function TogglePublished({
  id,
  isPublished,
  action,
}: {
  id: number
  isPublished: boolean
  action: (id: number, current: boolean) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={isPublished}
      onClick={() => startTransition(() => action(id, isPublished))}
      className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${
        isPublished ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          isPublished ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}