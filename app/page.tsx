import Hero from '@/app/components/home/Hero'
import BusinessAreas from '@/app/components/home/BusinessAreas'
import About from '@/app/components/home/About'
import Products from '@/app/components/home/Products'
import Industries from '@/app/components/home/Industries'
import WhyUs from '@/app/components/home/WhyUs'
import QuoteCta from '@/app/components/home/QuoteCta'

export default function Home() {
  return (
    <>
      <Hero />
      <BusinessAreas />
      <About />
      <Products />
      <Industries />
      <WhyUs />
      <QuoteCta />
    </>
  )
}