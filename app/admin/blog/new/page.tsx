import BlogPostForm from '@/components/admin/forms/BlogPostForm'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function NewBlogPostPage() {
  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Blog Post</h1>
            <p className="text-gray-400">Write and publish a new blog post</p>
          </div>

          <BlogPostForm />
        </div>
      </main>
    </div>
  )
}
