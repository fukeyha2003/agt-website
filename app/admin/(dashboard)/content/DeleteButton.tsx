'use client'

import { useTransition } from 'react'

export default function DeleteButton({
  id,
  label,
  action,
}: {
  id: number
  label: string
  action: (id: number) => Promise<{ success: boolean; error?: string }>
}) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(`Delete "${label}"? This can't be undone.`)) return
    startTransition(async () => {
      const result = await action(id)
      if (!result.success) alert(result.error ?? 'Could not delete.')
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="font-medium text-red-600 transition hover:underline disabled:opacity-50"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}