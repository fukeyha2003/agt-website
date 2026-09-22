'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const STATS = [
  {
    value: 100,
    suffix: '+',
    label: 'Trusted Suppliers',
    icon: (
      <>
        <path d="M3 7h10v9H3z" />
        <path d="M13 10h4l3 3v3h-7z" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </>
    ),
  },
  {
    value: 200,
    suffix: '+',
    label: 'Business Partners',
    icon: (
      <>
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </>
    ),
  },
  {
    value: 500,
    suffix: '+',
    label: 'Satisfied Clients',
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    value: 20,
    suffix: '+',
    label: 'Years of Experience',
    icon: (
      <>
        <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </>
    ),
  },
]

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState<number | null>(null) // null = show the static target until JS decides

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !ref.current) return

    setValue(0)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const duration = 1800
          let start: number | null = null

          const step = (now: number) => {
            if (start === null) start = now
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(target * eased))
            if (progress < 1) requestAnimationFrame(step)
          }

          requestAnimationFrame(step)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.6 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="tabular-nums">
      {(value ?? target).toLocaleString('en-US')}
    </span>
  )
}

export default function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-us-heading" className="border-y border-navy/5 bg-[#F6F8FB] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[4fr_7fr] lg:gap-12 lg:px-12">
        {/* TEXT */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold sm:text-[13px]">Why Choose Us</p>
          <h2 id="why-us-heading" className="mt-3 font-serif text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-4xl">
            Your Trusted Partner in Energy &amp; Business
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-navy/75 sm:text-base sm:leading-8">
            With a strong network, market knowledge and professional approach, we provide end-to-end solutions —
            from sourcing to delivery, and from financial advisory to legal support.
          </p>

          <div className="mt-7">
            <Link
              href="/request-quote"
              className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-gold px-7 text-sm font-bold text-white shadow-[0_8px_25px_rgba(216,155,22,0.22)] ring-1 ring-inset ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-[0_12px_30px_rgba(216,155,22,0.32)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 sm:w-auto sm:min-w-[170px]"
            >
              <span>Get in Touch</span>
              <svg aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* STATS */}
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0 lg:divide-x lg:divide-navy/10">
          {STATS.map((stat) => (
            <li key={stat.label} className="flex flex-col items-center text-center lg:px-4">
              <svg aria-hidden className="h-11 w-11 text-gold sm:h-12 sm:w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                {stat.icon}
              </svg>

              <p className="mt-4 font-serif text-3xl font-bold leading-none tracking-[-0.02em] text-navy sm:text-4xl">
                <Counter target={stat.value} />
                {stat.suffix}
              </p>

              <p className="mt-2 text-sm text-navy/75 sm:text-[15px]">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}