'use client'

import { useTransition } from 'react'
import { deleteCustomer } from './actions'

export default function DeleteButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return
    startTransition(async () => {
      const result = await deleteCustomer(id)
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