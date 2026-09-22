'use client'
const VALUES = [
  {
    title: 'Integrity',
    text: 'We do business with trust and transparency.',
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
    title: 'Reliability',
    text: 'On-time supply and consistent support.',
    icon: (
      <>
        <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </>
    ),
  },
  {
    title: 'Expertise',
    text: 'Industry knowledge and professional advice.',
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
    title: 'Your Growth',
    text: 'Our success is built on your success.',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
  },
]

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-[5fr_5fr_3.6fr] lg:gap-12">
          {/* IMAGE */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-navy to-navy-light shadow-[0_18px_40px_rgba(6,47,79,0.16)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about-petroleum.png"
              alt="Fuel tanker truck parked in front of a petroleum storage terminal"
              className="aspect-[4/3] h-full w-full object-cover object-center md:aspect-auto md:min-h-[380px]"
              onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
            />
          </div>

          {/* TEXT */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold sm:text-[13px]">About Us</p>

            <h2 id="about-heading" className="mt-3 font-serif text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-4xl">
              Building Sustainable Energy Partnerships
            </h2>

            <div className="mt-5 space-y-4 text-[15px] leading-7 text-navy/75 sm:text-base sm:leading-8">
              <p>
                Abdul Ghafoor Oil &amp; Gas Traders is a Karachi based trading and consultancy firm, committed to
                delivering reliable, efficient and cost-effective solutions in the petroleum, energy and business
                sectors.
              </p>
              <p>
                We bridge the gap between suppliers and customers, while also providing strategic consulting
                services in finance, tax and legal matters to support your business growth.
              </p>
            </div>
          </div>

          {/* VALUES */}
          <div className="rounded-2xl bg-[#EEF3F8] p-6 ring-1 ring-navy/5 sm:p-7 md:col-span-2 lg:col-span-1 lg:px-6 lg:py-4">
            <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-0 lg:divide-y lg:divide-navy/10">
              {VALUES.map((value) => (
                <li key={value.title} className="flex items-start gap-4 lg:py-5">
                  <svg aria-hidden className="mt-0.5 h-9 w-9 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {value.icon}
                  </svg>
                  <div>
                    <h3 className="text-sm font-bold text-navy">{value.title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-navy/70">{value.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}