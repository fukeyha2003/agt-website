'use client'

import { useTransition } from 'react'
import { deleteSupplier } from './actions'

export default function DeleteButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(`Delete "${name}" and its transaction history? This can't be undone.`)) return
    startTransition(async () => {
      const result = await deleteSupplier(id)
      if (!result.success) alert(result.error)
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