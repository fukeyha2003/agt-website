'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const SLIDES = [
  { src: '/images/hero/slide-1.png', alt: 'Fuel tanker at a petroleum terminal' },
  { src: '/images/hero/slide-2.png', alt: 'Petroleum storage tanks and pipelines' },
  { src: '/images/hero/slide-3.png', alt: 'Diesel tanker truck on the road' },
]

const SLIDE_MS = 3000

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [hovering, setHovering] = useState(false)
  const touchX = useRef<number | null>(null)
  const reduceMotion = useRef(false)

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (SLIDES.length < 2 || hovering || reduceMotion.current) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), SLIDE_MS)
    return () => clearInterval(timer)
  }, [hovering])

  const next = () => setCurrent((c) => (c + 1) % SLIDES.length)
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.changedTouches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) < 40) return
    dx < 0 ? next() : prev()
  }

  return (
    <section id="home" className="relative isolate min-h-[calc(100svh-110px)] overflow-hidden bg-navy">
      {/* BACKGROUND PHOTO */}
      <div className="absolute inset-0 -z-30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-petroleum.jpg"
          alt=""
          className="h-full w-full object-cover object-[65%_center] sm:object-center"
        />
      </div>

      <div className="absolute inset-0 -z-20 bg-navy/70 sm:bg-navy/75" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-navy-dark/90 via-navy/70 to-navy-dark/95 sm:bg-gradient-to-r sm:from-navy-dark/95 sm:via-navy/75 sm:to-navy/35" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_30%_50%,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl sm:-right-32 sm:h-[500px] sm:w-[500px] lg:right-[6%] lg:h-[560px] lg:w-[560px] lg:bg-gold/[0.14]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-navy-dark/70 to-transparent" />
      <div aria-hidden className="absolute inset-y-0 left-0 -z-10 hidden w-1 bg-gradient-to-b from-transparent via-gold/70 to-transparent lg:block" />

      <div className="mx-auto grid min-h-[calc(100svh-110px)] max-w-[1440px] items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-12 lg:pb-28 lg:pt-24 xl:gap-16">
        {/* TEXT */}
        <div className="w-full max-w-3xl">
          <div className="mb-5 flex items-center gap-3 sm:mb-6">
            <span className="h-px w-8 shrink-0 bg-gold sm:w-14" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light sm:text-sm sm:tracking-[0.28em]">
              Abdul Ghafoor Oil &amp; Gas Traders
            </p>
          </div>

          <h1 className="max-w-4xl font-serif text-[2.5rem] font-bold leading-[1.08] tracking-[-0.025em] text-white [text-shadow:0_2px_24px_rgba(4,31,53,0.45)] min-[400px]:text-5xl md:text-6xl lg:text-[3.4rem] xl:text-7xl">
            Powering <span className="text-gold">Trade.</span>
            <br />
            Delivering <span className="text-gold">Reliability.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/80 sm:mt-7 sm:max-w-2xl sm:text-base sm:leading-8 lg:text-lg">
            Reliable petroleum trading, energy products, logistics and professional business solutions built
            around long-term partnerships and dependable service.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/request-quote"
              className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-gold px-7 text-sm font-bold text-white shadow-[0_8px_25px_rgba(216,155,22,0.22)] ring-1 ring-inset ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-[0_12px_30px_rgba(216,155,22,0.32)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy sm:h-14 sm:w-auto sm:min-w-[200px]"
            >
              <span>Request a Quote</span>
              <svg aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>

            <a
              href="#services"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-white/35 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-white/10 hover:text-gold-light active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy sm:h-14 sm:w-auto sm:min-w-[200px]"
            >
              Explore Our Services
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-white/15 pt-6 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60 sm:mt-10 sm:gap-x-7 sm:text-xs sm:tracking-[0.16em]">
            {['Petroleum Trading', 'Lubricants', 'Logistics', 'Business Solutions'].map((label) => (
              <li key={label} className="flex items-center gap-2.5">
                <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* CAROUSEL */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Our operations"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
          }}
          className="relative isolate mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end xl:max-w-[600px]"
        >
          <div aria-hidden className="absolute inset-0 -z-10 hidden translate-x-4 translate-y-4 rounded-[26px] border border-gold/35 lg:block" />

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-navy-light to-navy shadow-[0_30px_60px_rgba(2,15,28,0.5)] ring-1 ring-white/20">
            {SLIDES.map((slide, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                aria-hidden={current !== i}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${
                  current === i ? 'opacity-100' : 'opacity-0'
                }`}
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              />
            ))}

            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-dark/70 to-transparent" />

            {SLIDES.length > 1 && (
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center sm:bottom-4">
                <div className="flex items-center gap-1 rounded-full bg-navy-dark/55 px-2.5 py-1 backdrop-blur-sm">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrent(i)}
                      aria-label={`Show slide ${i + 1}`}
                      aria-current={current === i}
                      className="group flex h-6 items-center px-0.5 focus-visible:outline-none"
                    >
                      <span
                        className={`block h-2 rounded-full transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-gold-light group-focus-visible:ring-offset-1 group-focus-visible:ring-offset-navy-dark ${
                          current === i ? 'w-6 bg-gold' : 'w-2 bg-white/60 group-hover:bg-white'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 lg:flex">
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em]">Discover AGT</span>
        <span className="flex h-8 w-5 items-start justify-center rounded-full border border-white/25 p-1">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-gold" />
        </span>
      </div>
    </section>
  )
}