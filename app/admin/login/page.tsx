'use client'

import { useActionState } from 'react'
import { signIn } from './actions'

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, undefined)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#062F4F] px-4">
      <form action={formAction} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Admin Login</h1>
        <p className="mt-1 text-sm text-gray-500">Abdul Ghafoor Oil &amp; Gas Traders</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#D89B16] focus:outline-none focus:ring-1 focus:ring-[#D89B16]" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#D89B16] focus:outline-none focus:ring-1 focus:ring-[#D89B16]" />
          </div>
        </div>

        {state?.error && <p className="mt-4 text-sm text-red-600">{state.error}</p>}

        <button type="submit" disabled={pending}
          className="mt-6 w-full rounded-lg bg-[#062F4F] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3f68] disabled:opacity-60">
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}