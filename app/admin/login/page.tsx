'use client'

import { useActionState } from 'react'
import { signIn } from './actions'

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, undefined)

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#062F4F] px-4">
      {/* grid texture — same as Hero / Request a Quote */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_40%,black_20%,transparent_75%)]"
      />

      {/* soft gold glow, matching the rest of the site */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D89B16]/10 blur-3xl"
      />

      <form action={formAction} className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Admin Login</h1>
        <p className="mt-1 text-sm text-gray-500">AG Oil &amp; Gas Traders</p>

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