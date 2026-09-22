'use client'
const INDUSTRIES = [
  {
    title: 'Industrial & Manufacturing',
    text: 'Fuel and lubricants for plants, machinery and production lines.',
    icon: (
      <>
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M17 18h1M12 18h1M7 18h1" />
      </>
    ),
  },
  {
    title: 'Transport & Logistics',
    text: 'Diesel and lubricant supply for fleets and distribution operations.',
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
    title: 'Power & Energy',
    text: 'Dependable fuel supply for generation and energy-related operations.',
    icon: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  },
  {
    title: 'Construction',
    text: 'Fuel and lubricants for construction equipment and project sites.',
    icon: (
      <>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
      </>
    ),
  },
  {
    title: 'Agriculture',
    text: 'Diesel and lubricants for farm machinery and irrigation.',
    icon: (
      <>
        <path d="M7 20h10" />
        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
        <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
      </>
    ),
  },
  {
    title: 'Commercial & Retail',
    text: 'Fuel, LPG and lubricant supply for commercial businesses.',
    icon: (
      <>
        <path d="M3 9l1.5-5h15L21 9" />
        <path d="M4 9v11h16V9" />
        <path d="M3 9h18" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
  },
]

export default function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-heading" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold sm:text-[13px]">Industries &amp; Clients</p>
          <h2 id="industries-heading" className="mt-3 font-serif text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-4xl">
            Serving the businesses that keep Pakistan moving
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-navy/75 sm:text-base sm:leading-8">
            Our supply and advisory services support customers across industrial, commercial and energy sectors.
          </p>
        </div>

        <ul className="mt-9 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <li
              key={industry.title}
              className="group relative isolate overflow-hidden rounded-2xl bg-navy p-6 shadow-[0_16px_36px_rgba(6,47,79,0.22)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(6,47,79,0.32)] hover:ring-gold/60 sm:p-7"
            >
              <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 -z-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl transition-colors duration-300 group-hover:bg-gold/20" />
              <span aria-hidden className="absolute left-0 top-0 h-[3px] w-12 bg-gold transition-all duration-300 group-hover:w-full" />

              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-navy-dark text-gold-light">
                <svg aria-hidden className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {industry.icon}
                </svg>
              </span>

              <h3 className="mt-5 font-serif text-xl font-bold tracking-[-0.01em] text-white">{industry.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{industry.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}