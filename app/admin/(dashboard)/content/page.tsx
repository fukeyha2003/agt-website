import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'

export default async function ContentHubPage() {
  const supabase = createAdminClient()

  const [{ count: serviceCount }, { count: postCount }] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
  ])

  const cards = [
    {
      href: '/admin/content/services',
      title: 'Services',
      description: 'Business areas shown on the site, with their bullet lists.',
      meta: `${serviceCount ?? 0} total`,
    },
    {
      href: '/admin/content/posts',
      title: 'News Posts',
      description: 'News and articles, with a cover image and publish date.',
      meta: `${postCount ?? 0} total`,
    },
    {
      href: '/admin/content/settings',
      title: 'Site Settings',
      description: 'Hero text, About text and contact details.',
      meta: 'Edit',
    },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Content</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[#D89B16]">{card.meta}</p>
            <h2 className="mt-2 font-serif text-lg font-bold text-[#062F4F]">{card.title}</h2>
            <p className="mt-1.5 text-sm leading-5 text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}