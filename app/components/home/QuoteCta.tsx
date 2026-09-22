'use client'
import Link from 'next/link'

export default function QuoteCta() {
  return (
    <section aria-labelledby="quote-cta-heading" className="relative isolate overflow-hidden bg-navy">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_right,black,transparent_70%)]"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr]">
        {/* LEFT */}
        <div className="flex flex-col gap-6 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-10 lg:gap-10 lg:py-12 lg:pl-[max(3rem,calc((100vw_-_1440px)/2_+_3rem))] lg:pr-16">
          <div className="flex items-start gap-4 sm:items-center sm:gap-5">
            <svg aria-hidden className="h-9 w-9 shrink-0 text-gold-light sm:h-11 sm:w-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="5" width="19" height="14" rx="2" />
              <path d="m3 7 9 6.5L21 7" />
            </svg>

            <div>
              <h2 id="quote-cta-heading" className="font-serif text-xl font-bold leading-tight text-white sm:text-2xl">
                Have a Requirement?
              </h2>
              <p className="mt-1.5 max-w-md text-[13px] leading-6 text-white/75 sm:text-sm">
                Get in touch with us for a quote or any business inquiry.
              </p>
            </div>
          </div>

          <Link
            href="/request-quote"
            className="group inline-flex h-11 w-full shrink-0 items-center justify-center gap-2.5 rounded-full border border-white/70 px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy sm:w-auto"
          >
            <span>Request a Quote</span>
            <svg aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* RIGHT: IMAGE + TAGLINE */}
        <div className="relative min-h-[170px] overflow-hidden bg-gradient-to-br from-navy-light to-navy sm:min-h-[190px] lg:min-h-full lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/quote-cta.png"
            alt="Oil tanker at a marine terminal at sunset"
            className="absolute inset-0 h-full w-full object-cover object-center"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />

          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-navy-dark/65 lg:via-transparent" />

          <div className="absolute inset-0 flex items-center justify-start px-5 sm:px-8 lg:pl-[17%] lg:pr-6">
            <div className="flex items-stretch gap-3">
              <span aria-hidden className="w-1 shrink-0 rounded-full bg-gold" />
              <p className="font-serif text-lg font-semibold italic leading-snug text-white [text-shadow:0_2px_14px_rgba(4,31,53,0.6)] sm:text-xl lg:text-[22px]">
                Let&rsquo;s Build
                <br />
                a Greener,
                <br />
                Stronger Future
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}