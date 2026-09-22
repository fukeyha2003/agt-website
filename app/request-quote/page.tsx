import QuoteForm from '@/app/components/forms/QuoteForm'

export const metadata = {
  title: 'Request a Quote | Abdul Ghafoor Oil & Gas Traders',
  description:
    'Request a quote from Abdul Ghafoor Oil & Gas Traders for LPG, petrol, diesel, lubricants, logistics and business consultancy.',
}

const STEPS: [string, string][] = [
  ['Submit your requirement', 'Fill in the form with your product, quantity and delivery details.'],
  ['We review it', 'Our team checks availability and delivery options for your location.'],
  ['You receive a quote', 'We contact you by phone or email with pricing and terms.'],
]

export default function RequestQuotePage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#062F4F] pb-28 pt-14 sm:pb-32 sm:pt-16 lg:pb-36 lg:pt-20">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-[#D89B16] sm:w-14" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E5B33A] sm:text-sm sm:tracking-[0.28em]">
              Request a Quote
            </p>
          </div>

          <h1 className="mt-4 max-w-3xl font-serif text-[2.25rem] font-bold leading-[1.1] tracking-[-0.025em] text-white min-[400px]:text-4xl sm:text-5xl lg:text-6xl">
            Tell us what you need. We&rsquo;ll send you a quote.
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/80 sm:text-base sm:leading-8 lg:text-lg">
            Share your product, quantity and delivery details. Our team will review your requirement and reply with a
            quotation.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-16 pb-16 sm:-mt-20 sm:pb-20 lg:-mt-24 lg:pb-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 lg:px-12">
          <QuoteForm />

          <aside className="relative isolate overflow-hidden rounded-2xl bg-[#062F4F] p-6 text-white shadow-[0_20px_50px_rgba(6,47,79,0.22)] sm:p-8 lg:sticky lg:top-6">
            <h2 className="font-serif text-xl font-bold sm:text-2xl">What happens next</h2>

            <ol className="mt-6 space-y-5">
              {STEPS.map(([title, body], i) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D89B16] text-sm font-bold text-[#E5B33A]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-white/70">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 border-t border-white/15 pt-6">
              <h3 className="text-sm font-bold">Prefer to talk?</h3>

              <ul className="mt-4 space-y-3 text-[13px] text-white/85">
                <li className="flex items-start gap-3">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#E5B33A]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                  <address className="not-italic leading-5">
                    Office# A-9-B, Sector R-4,
                    <br />
                    Gulshan-e-Maymar, Karachi
                  </address>
                </li>

                <li className="flex items-center gap-3">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-[#E5B33A]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="flex flex-col">
                    <a
                      href="tel:+923311363614"
                      className="w-fit rounded transition-colors hover:text-[#E5B33A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B33A]"
                    >
                      +92 331 1363614
                    </a>
                    <a
                      href="tel:+923323361352"
                      className="w-fit rounded transition-colors hover:text-[#E5B33A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B33A]"
                    >
                      +92 332 3361352
                    </a>
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-[#E5B33A]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2.5" y="5" width="19" height="14" rx="2" />
                    <path d="m3 7 9 6.5L21 7" />
                  </svg>
                  <a
                    href="mailto:agogt77@gmail.com"
                    className="break-all rounded transition-colors hover:text-[#E5B33A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B33A]"
                  >
                    agogt77@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}