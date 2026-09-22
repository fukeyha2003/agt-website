import Link from 'next/link'
import Image from 'next/image'

const PHONES = [
  { label: '+92 331 1363614', href: 'tel:+923311363614' },
  { label: '+92 332 3361352', href: 'tel:+923323361352' },
]

const EMAIL = 'agogt77@gmail.com'

// Replace these with your real profiles.
const SOCIALS = [
  { name: 'Facebook', href: '#', icon: <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.6V21h2.9z" /> },
  { name: 'LinkedIn', href: '#', icon: <path d="M6.5 9H3.7v11h2.8V9zM5.1 4.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM20.3 13.4c0-3-1.6-4.6-3.9-4.6-1.5 0-2.4.8-2.8 1.5V9h-2.8v11h2.8v-6.1c0-1.6.7-2.5 1.9-2.5 1.2 0 1.7.9 1.7 2.5V20h2.8v-6.6z" /> },
  { name: 'X (Twitter)', href: '#', icon: <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.9L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" /> },
]

const FOOTER_LINKS = [
  { label: 'Petroleum', href: '/#service-petroleum' },
  { label: 'Lubricants', href: '/#product-lubricants' },
  { label: 'Energy', href: '/#product-lpg' },
  { label: 'Logistics Solutions', href: '/#service-logistics' },
]

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden className="absolute inset-0 -z-20 bg-navy" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-b from-navy-dark/90 via-navy/60 to-navy-dark/95 sm:bg-gradient-to-r sm:from-navy-dark/95 sm:via-navy/60 sm:to-navy-dark/80" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_40%,black_20%,transparent_80%)]" />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* TOP ROW */}
        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 sm:gap-x-10 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:py-9">
          {/* BRAND */}
          <Link
            href="/#home"
            aria-label="Abdul Ghafoor Oil & Gas Traders — home"
            className="flex items-center gap-3.5 rounded-md sm:col-span-2 lg:col-span-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Image src="/images/agt-logo.png" alt="" width={64} height={64} className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16" />
            <span className="block">
              <span className="block font-serif text-[15px] font-bold uppercase leading-tight tracking-[0.02em] sm:text-base">
                Abdul Ghafoor <span className="text-gold-light">Oil &amp; Gas</span> Traders
              </span>
              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
                Petroleum · Lubricants · Energy · Logistics Solutions
              </span>
            </span>
          </Link>

          {/* ADDRESS */}
          <div className="flex items-start gap-3">
            <svg aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            <address className="text-[13px] not-italic leading-5 text-white/85">
              Office# A-9-B, Sector R-4,
              <br />
              Gulshan-e-Maymar, Karachi
            </address>
          </div>

          {/* PHONES */}
          <div className="flex items-start gap-3">
            <svg aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div className="flex flex-col text-[13px] leading-5 text-white/85">
              {PHONES.map((phone) => (
                <a key={phone.href} href={phone.href} className="w-fit rounded transition-colors duration-200 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light">
                  {phone.label}
                </a>
              ))}
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-start gap-3">
            <svg aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="5" width="19" height="14" rx="2" />
              <path d="m3 7 9 6.5L21 7" />
            </svg>
            <a href={`mailto:${EMAIL}`} className="break-all rounded text-[13px] leading-5 text-white/85 transition-colors duration-200 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light">
              {EMAIL}
            </a>
          </div>

          {/* SOCIAL */}
          <ul className="flex items-center gap-2.5 sm:col-span-2 lg:col-span-1">
            {SOCIALS.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  <svg aria-hidden className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    {social.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-4 border-t border-white/15 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/70">&copy; {new Date().getFullYear()} Abdul Ghafoor Oil &amp; Gas Traders. All Rights Reserved.</p>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-y-2 text-xs text-white/80 sm:divide-x sm:divide-white/25">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href} className="pr-4 sm:px-4 sm:first:pl-0 sm:last:pr-0">
                  <Link href={link.href} className="rounded transition-colors duration-200 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}