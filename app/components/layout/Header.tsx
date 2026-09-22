'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const SERVICE_LINKS = [
  ['Petroleum & Energy Trading', '/#service-petroleum'],
  ['Logistics Solutions', '/#service-logistics'],
  ['Finance & Tax Consultancy', '/#service-finance'],
  ['Legal Consultancy', '/#service-legal'],
] as const

const PRODUCT_LINKS = [
  ['LPG', '/#product-lpg'],
  ['MS / Petrol', '/#product-ms-petrol'],
  ['HSD / Diesel', '/#product-hsd-diesel'],
  ['Lubricants', '/#product-lubricants'],
  ['Other Products', '/#product-other-petroleum'],
] as const

type NavItem =
  | { type: 'link'; id: string; label: string; href: string }
  | { type: 'menu'; id: string; label: string; href: string; items: readonly (readonly [string, string])[] }

const NAV: NavItem[] = [
  { type: 'link', id: 'home', label: 'Home', href: '/#home' },
  { type: 'link', id: 'about', label: 'About Us', href: '/#about' },
  { type: 'menu', id: 'services', label: 'Our Services', href: '/#services', items: SERVICE_LINKS },
  { type: 'menu', id: 'products', label: 'Products', href: '/#products', items: PRODUCT_LINKS },
  { type: 'link', id: 'industries', label: 'Industries', href: '/#industries' },
  { type: 'link', id: 'why-us', label: 'Why Us', href: '/#why-us' },
]

const SECTION_IDS = ['home', 'about', 'services', 'products', 'industries', 'why-us']

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [active, setActive] = useState('')

  // Scroll-spy: highlight the nav item for whichever section is on screen.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Escape closes the mobile menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const linkClass = (id: string) =>
    `group relative flex items-center whitespace-nowrap py-2 text-[12px] font-semibold transition-colors duration-200 hover:text-gold-dark ${
      active === id ? 'text-gold-dark' : 'text-navy'
    }`

  const barClass = (id: string) =>
    `absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100 ${
      active === id ? 'scale-x-100' : 'scale-x-0'
    }`

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* TOP CONTACT BAR */}
      <div className="bg-navy text-white">
        <div className="mx-auto flex min-h-[34px] max-w-[1440px] flex-wrap items-center justify-between gap-y-1 px-4 py-1 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:gap-x-6 sm:text-[12px]">
            <a href="tel:+923311363614" className="flex items-center gap-1.5 transition-colors duration-200 hover:text-gold-light">
              <svg aria-hidden className="h-3.5 w-3.5 shrink-0 text-gold-light" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.56 3.57.56a1 1 0 011 1V20a1 1 0 01-1 1C10.72 21 3 13.28 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.19 2.45.56 3.57a1 1 0 01-.25 1.02l-2.19 2.2z" />
              </svg>
              <span>+92 331 1363614</span>
            </a>
            <span aria-hidden className="hidden text-white/30 sm:inline">|</span>
            <a href="tel:+923323361352" className="hidden transition-colors duration-200 hover:text-gold-light sm:block">
              +92 332 3361352
            </a>
            <a href="mailto:agogt77@gmail.com" className="flex items-center gap-1.5 truncate transition-colors duration-200 hover:text-gold-light">
              <svg aria-hidden className="h-3.5 w-3.5 shrink-0 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              <span className="truncate">agogt77@gmail.com</span>
            </a>
          </div>

          <div className="hidden items-center gap-2 text-[11px] lg:flex">
            <svg aria-hidden className="h-3.5 w-3.5 shrink-0 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>Office# A-9-B, Sector R-4, Gulshan-e-Maymar, Karachi</span>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav aria-label="Main" className="border-b border-slate-100 bg-white shadow-[0_2px_15px_rgba(6,47,79,0.05)]">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* BRAND */}
          <Link
            href="/#home"
            onClick={() => setMobileOpen(false)}
            className="group flex min-w-0 shrink items-center gap-2.5"
            aria-label="Abdul Ghafoor Oil & Gas Traders Home"
          >
            <Image
              src="/images/agt-logo.png"
              alt="AGT"
              width={52}
              height={52}
              className="h-[44px] w-[44px] object-contain transition-transform duration-300 group-hover:scale-[1.04] sm:h-[48px] sm:w-[48px] lg:h-[52px] lg:w-[52px]"
            />
            <div className="min-w-0 leading-none">
              <div className="truncate font-serif text-[14px] font-bold tracking-[-0.02em] text-navy sm:text-[16px] md:whitespace-nowrap md:text-[18px] lg:text-[20px]">
                ABDUL GHAFOOR <span className="text-gold-dark">OIL &amp; GAS TRADERS</span>
              </div>
              <div className="mt-1 hidden whitespace-nowrap text-[6px] font-semibold tracking-[0.19em] text-slate-500 sm:block sm:text-[7px] lg:text-[8px]">
                PETROLEUM • LUBRICANTS • ENERGY • LOGISTICS SOLUTIONS
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden h-full items-center lg:flex">
            <div className="flex h-full items-center gap-3.5 xl:gap-5 2xl:gap-6">
              {NAV.map((item) =>
                item.type === 'link' ? (
                  <Link key={item.id} href={item.href} className={linkClass(item.id)}>
                    {item.label}
                    <span className={barClass(item.id)} />
                  </Link>
                ) : (
                  <div key={item.id} className="group relative flex h-full items-center">
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-1 whitespace-nowrap py-2 text-[12px] font-semibold transition-colors duration-200 hover:text-gold-dark ${
                        active === item.id ? 'text-gold-dark' : 'text-navy'
                      }`}
                    >
                      {item.label}
                      <svg aria-hidden className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                      <span className={barClass(item.id)} />
                    </Link>

                    <div className="pointer-events-none invisible absolute left-1/2 top-full w-[260px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-[0_15px_40px_rgba(6,47,79,0.14)]">
                        {item.items.map(([label, href]) => (
                          <Link key={href} href={href} className="block px-5 py-3 text-[12px] font-medium text-navy transition-colors hover:bg-slate-50 hover:text-gold-dark">
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}

              <Link
                href="/request-quote"
                className="ml-1 flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-gold px-4 text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(216,155,22,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-[0_7px_18px_rgba(216,155,22,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 xl:w-[148px]"
              >
                <svg aria-hidden className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="6" y="3" width="12" height="18" rx="2" />
                  <path d="M9 7h6M9 11h6M9 15h4" />
                </svg>
                <span className="whitespace-nowrap">Request a Quote</span>
              </Link>
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-navy transition-colors hover:border-gold hover:text-gold-dark lg:hidden"
          >
            {mobileOpen ? (
              <svg aria-hidden className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" d="M6 6l12 12" />
                <path strokeLinecap="round" d="M18 6L6 18" />
              </svg>
            ) : (
              <svg aria-hidden className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" d="M4 7h16" />
                <path strokeLinecap="round" d="M4 12h16" />
                <path strokeLinecap="round" d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div id="mobile-menu" className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-slate-100 bg-white lg:hidden">
            <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6">
              <div className="flex flex-col">
                {NAV.map((item) =>
                  item.type === 'link' ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`border-b border-slate-100 py-3.5 text-sm font-semibold transition-colors active:text-gold-dark ${
                        active === item.id ? 'text-gold-dark' : 'text-navy'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.id} className="border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setOpenMenu((m) => (m === item.id ? null : item.id))}
                        aria-expanded={openMenu === item.id}
                        className={`flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold ${
                          active === item.id ? 'text-gold-dark' : 'text-navy'
                        }`}
                      >
                        <span>{item.label}</span>
                        <svg
                          aria-hidden
                          className={`h-4 w-4 transition-transform duration-200 ${openMenu === item.id ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      {openMenu === item.id && (
                        <div className="pb-2">
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gold-dark hover:bg-slate-50"
                          >
                            View all {item.label.toLowerCase()}
                          </Link>
                          {item.items.map(([label, href]) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-gold-dark"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}

                <Link
                  href="/request-quote"
                  className="mt-4 flex h-12 items-center justify-center gap-2 rounded-lg bg-gold text-sm font-bold text-white shadow-md transition-colors hover:bg-gold-dark"
                >
                  <svg aria-hidden className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="6" y="3" width="12" height="18" rx="2" />
                    <path d="M9 7h6M9 11h6M9 15h4" />
                  </svg>
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}