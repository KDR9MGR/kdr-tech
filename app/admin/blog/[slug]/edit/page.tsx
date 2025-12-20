import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BlogPostForm from '@/components/admin/forms/BlogPostForm'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !post) {
    redirect('/admin/blog')
  }

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Blog Post</h1>
            <p className="text-gray-400">Update {post.title}</p>
          </div>

          <BlogPostForm initialData={post} isEdit={true} />
        </div>
      </main>
    </div>
  )
}
