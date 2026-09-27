'use client'

import { useTransition } from 'react'
import { deleteQuotation } from './actions'

export default function DeleteButton({ id, number }: { id: number; number: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(`Delete quotation "${number}"? This can't be undone.`)) return
    startTransition(() => deleteQuotation(id))
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