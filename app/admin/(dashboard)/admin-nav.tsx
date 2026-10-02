'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin/quotations', label: 'Quotations' },
  { href: '/admin/customers', label: 'Customers' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="mt-4 space-y-1 px-3">
      {NAV.map((item) => {
        const isActive = pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              isActive ? 'bg-white/15 font-semibold text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}