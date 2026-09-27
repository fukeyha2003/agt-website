import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import SiteChrome from '@/app/components/layout/SiteChrome'
import './globals.css'

// Body font — swap Inter for whatever you used before, if different
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

// Serif used across headings (font-serif utility, wired in globals.css @theme)
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['600', '700'] })

export const metadata: Metadata = {
  title: 'Abdul Ghafoor Oil & Gas Traders',
  description:
    'Abdul Ghafoor Oil & Gas Traders — Petroleum Trading, Energy, Logistics and Business Consultancy solutions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} min-h-screen bg-white text-navy antialiased`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}