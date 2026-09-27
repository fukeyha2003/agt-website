'use client'

export default function LogoImage() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/agt-logo.png"
      alt=""
      className="h-12 w-12 shrink-0 rounded-full"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}