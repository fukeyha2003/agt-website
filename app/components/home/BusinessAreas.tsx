'use client'
const AREAS = [
  {
    id: 'service-petroleum',
    title: 'Petroleum Trading',
    icon: (
      <path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3z" />
    ),
    items: ['LPG', 'MS / Petrol', 'HSD / Diesel', 'Lubricants', 'Other Petroleum Products'],
  },
  {
    id: 'service-logistics',
    title: 'Logistics Solutions',
    icon: (
      <>
        <path d="M3 7h10v9H3z" />
        <path d="M13 10h4l3 3v3h-7z" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </>
    ),
    items: ['Import & Local Procurement', 'Transport & Distribution', 'Supply Chain Management', 'Terminal & Storage'],
  },
  {
    id: 'service-finance',
    title: 'Finance & Tax Consultancy',
    icon: (
      <>
        <path d="M3 20h18" />
        <path d="M3 16l6-6 4 4 8-8" />
        <path d="M15 6h6v6" />
      </>
    ),
    items: ['Financial Management', 'Tax Advisory', 'Business & Commercial Advisory', 'Working Capital Solutions'],
  },
  {
    id: 'service-legal',
    title: 'Legal Consultancy',
    icon: (
      <>
        <path d="M12 4v16M8 20h8M5 7h14" />
        <path d="M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7zM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7z" />
      </>
    ),
    items: ['Corporate & Commercial Matters', 'Contracts & Agreements', 'Business Documentation', 'Regulatory & Compliance Support'],
  },
]

export default function BusinessAreas() {
  return (
    <section id="services" aria-labelledby="business-areas-heading" className="relative z-10 -mt-12 pb-16 sm:-mt-14 sm:pb-20 lg:-mt-16 lg:pb-24">
      <h2 id="business-areas-heading" className="sr-only">Our services</h2>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="rounded-2xl bg-gradient-to-b from-white to-[#F4F7FA] px-6 py-9 shadow-[0_20px_50px_rgba(6,47,79,0.14)] ring-1 ring-navy/5 sm:px-10 sm:py-10 lg:px-4 lg:py-11">
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0 lg:divide-x lg:divide-navy/10">
            {AREAS.map((area) => (
              <article
                key={area.id}
                id={area.id}
                className="group rounded-xl transition-colors duration-500 target:bg-gold/10 lg:-my-4 lg:px-8 lg:py-4 xl:px-10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-gold-light shadow-[0_8px_20px_rgba(6,47,79,0.22)] ring-2 ring-transparent ring-offset-2 ring-offset-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-gold/60 sm:h-16 sm:w-16">
                  <svg aria-hidden className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {area.icon}
                  </svg>
                </div>

                <h3 className="mt-5 font-serif text-xl font-bold leading-snug tracking-[-0.01em] text-navy sm:text-[22px] lg:min-h-[3.75rem]">
                  {area.title}
                </h3>

                <ul className="mt-4 space-y-2.5">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-navy/75">
                      <span aria-hidden className="mt-[9px] h-2 w-1.5 shrink-0 bg-gold [clip-path:polygon(0_0,100%_50%,0_100%)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}