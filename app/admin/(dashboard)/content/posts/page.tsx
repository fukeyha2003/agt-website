import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import TogglePublished from '../TogglePublished'
import DeleteButton from '../DeleteButton'
import { deletePost, togglePostPublished } from './actions'

export default async function PostsPage() {
  const supabase = createAdminClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, cover_image, is_published, published_at, created_at')
    .order('created_at', { ascending: false })

  const withUrls = posts?.map((p) => ({
    ...p,
    coverUrl: p.cover_image ? supabase.storage.from('post-images').getPublicUrl(p.cover_image).data.publicUrl : null,
  }))

  return (
    <div>
      <Link href="/admin/content" className="text-sm font-medium text-gray-500 hover:text-gray-700">
        ← Content
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-[#062F4F]">News Posts</h1>
        <Link
          href="/admin/content/posts/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D89B16] px-4 text-sm font-bold text-white transition hover:bg-[#C58D12]"
        >
          + Add Post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Post</th>
              <th className="px-5 py-3">Published</th>
              <th className="px-5 py-3">Publish date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {withUrls?.map((p) => (
              <tr key={p.id} className="transition hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {p.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverUrl} alt="" className="h-10 w-14 rounded-lg border border-gray-200 object-cover" />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                        —
                      </div>
                    )}
                    <div>
                      <Link href={`/admin/content/posts/${p.id}`} className="font-medium text-[#062F4F] hover:underline">
                        {p.title}
                      </Link>
                      <span className="block text-xs text-gray-400">{p.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <TogglePublished id={p.id} isPublished={p.is_published} action={togglePostPublished} />
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/content/posts/${p.id}`} className="font-medium text-[#062F4F] hover:underline">
                      Edit
                    </Link>
                    <DeleteButton id={p.id} label={p.title} action={deletePost} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {withUrls?.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-400">No posts yet.</p>}
        {error && <p className="px-5 py-10 text-center text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}