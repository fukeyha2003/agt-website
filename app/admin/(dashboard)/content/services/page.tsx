import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import TogglePublished from '../TogglePublished'
import DeleteButton from '../DeleteButton'
import { deleteService, toggleServicePublished } from './actions'

export default async function ServicesPage() {
  const supabase = createAdminClient()

  const { data: services, error } = await supabase
    .from('services')
    .select('id, title, slug, items, is_published, sort_order')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true })

  return (
    <div>
      <Link href="/admin/content" className="text-sm font-medium text-gray-500 hover:text-gray-700">
        ← Content
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Services</h1>
        <Link
          href="/admin/content/services/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D89B16] px-4 text-sm font-bold text-white transition hover:bg-[#C58D12]"
        >
          + Add Service
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Bullet items</th>
              <th className="px-5 py-3">Published</th>
              <th className="px-5 py-3">Sort</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services?.map((s) => (
              <tr key={s.id} className="transition hover:bg-gray-50">
                <td className="px-5 py-3">
                  <Link href={`/admin/content/services/${s.id}`} className="font-medium text-[#062F4F] hover:underline">
                    {s.title}
                  </Link>
                  <span className="block text-xs text-gray-400">{s.slug}</span>
                </td>
                <td className="px-5 py-3 text-gray-600">{Array.isArray(s.items) ? s.items.length : 0}</td>
                <td className="px-5 py-3">
                  <TogglePublished id={s.id} isPublished={s.is_published} action={toggleServicePublished} />
                </td>
                <td className="px-5 py-3 text-gray-500">{s.sort_order}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/content/services/${s.id}`} className="font-medium text-[#062F4F] hover:underline">
                      Edit
                    </Link>
                    <DeleteButton id={s.id} label={s.title} action={deleteService} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services?.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-400">No services yet.</p>}
        {error && <p className="px-5 py-10 text-center text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}