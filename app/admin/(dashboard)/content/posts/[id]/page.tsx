import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/lib/supabase/admin'
import PostForm from '../PostForm'
import { updatePost } from '../actions'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()

  const coverUrl = post.cover_image
    ? supabase.storage.from('post-images').getPublicUrl(post.cover_image).data.publicUrl
    : null

  const boundUpdate = updatePost.bind(null, post.id)

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Edit Post — {post.title}</h1>
      <div className="mt-6">
        <PostForm
          action={boundUpdate}
          submitLabel="Save Changes"
          initialData={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            body: post.body,
            coverUrl,
            is_published: post.is_published,
          }}
        />
      </div>
    </div>
  )
}