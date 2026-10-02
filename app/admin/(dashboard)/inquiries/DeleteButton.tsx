'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteInquiry } from './actions'

export default function DeleteButton({ id, reference, redirectTo }: { id: number; reference: string; redirectTo?: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(`Delete inquiry "${reference}"? This can't be undone.`)) return
    startTransition(async () => {
      const result = await deleteInquiry(id)
      if (!result.success) alert(result.error)
      else if (redirectTo) router.push(redirectTo)
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
