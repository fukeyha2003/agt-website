'use client'
import Link from 'next/link'

const EXT = 'png' // change if your product images use a different file type

const PRODUCTS = [
  { slug: 'lpg', title: 'LPG', subtitle: 'Liquefied Petroleum Gas' },
  { slug: 'ms-petrol', title: 'MS / Petrol', subtitle: 'Motor Spirit' },
  { slug: 'hsd-diesel', title: 'HSD / Diesel', subtitle: 'High Speed Diesel' },
  { slug: 'lubricants', title: 'Lubricants', subtitle: 'Engine & Industrial' },
  { slug: 'other-petroleum', title: 'Other Products', subtitle: 'Based on Market Demand' },
]

export default function Products() {
  return (
    <section id="products" aria-labelledby="products-heading" className="relative isolate overflow-hidden bg-navy py-16 sm:py-20 lg:py-24">
      {/* backdrop layers (inlined here; extract to a shared component if reused elsewhere) */}
      <div aria-hidden className="absolute inset-0 -z-30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/products-bg.${EXT}`} alt="" className="h-full w-full object-cover object-center" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
      </div>
      <div aria-hidden className="absolute inset-0 -z-20 bg-navy/85" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-b from-navy-dark/90 via-navy/60 to-navy-dark/95 sm:bg-gradient-to-r sm:from-navy-dark/95 sm:via-navy/60 sm:to-navy-dark/80" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_40%,black_20%,transparent_80%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-0 -z-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl sm:-right-32 sm:h-[460px] sm:w-[460px]" />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light sm:text-[13px]">Our Products</p>
          <h2 id="products-heading" className="mt-3 font-serif text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl">
            Quality Products for a Stronger Tomorrow
          </h2>
        </div>

        <ul className="mt-9 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5">
          {PRODUCTS.map((product, i) => (
            <li
              key={product.slug}
              id={`product-${product.slug}`}
              className={`${i === PRODUCTS.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''} [&:target>a]:!border-gold [&:target>a]:bg-white/[0.09]`}
            >
              <Link
                href={`/request-quote?product=${product.slug}`}
                aria-label={`Request a quote for ${product.title}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/15 bg-white/[0.04] shadow-[0_12px_30px_rgba(2,15,28,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:bg-white/[0.07] hover:shadow-[0_18px_40px_rgba(2,15,28,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-navy-light to-navy ${i === PRODUCTS.length - 1 ? 'sm:aspect-[16/7] lg:aspect-[4/3]' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/products/${product.slug}.${EXT}`}
                    alt={product.title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/60 to-transparent" />
                </div>

                <div className="flex flex-1 items-center justify-between gap-3 px-4 py-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-bold text-white">{product.title}</h3>
                    <p className="mt-0.5 text-[13px] leading-5 text-white/70">{product.subtitle}</p>
                  </div>

                  <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-300 group-hover:border-gold group-hover:bg-gold">
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}