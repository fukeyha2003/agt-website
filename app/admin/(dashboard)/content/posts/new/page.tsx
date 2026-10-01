import PostForm from '../PostForm'
import { createPost } from '../actions'

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Add Post</h1>
      <div className="mt-6">
        <PostForm action={createPost} submitLabel="Create Post" />
      </div>
    </div>
  )
}