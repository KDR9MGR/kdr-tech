import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string | null
  featured_image: string | null
  published_at: string
  meta_title: string | null
  meta_description: string | null
  author: {
    full_name: string
    slug: string
  } | null
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:author_id (
        full_name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) {
    return null
  }

  return post
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="relative py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category */}
        {post.category && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full mb-4">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-6 text-sm text-gray-400 pb-8 mb-8 border-b border-[#2A0E61]">
          {post.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author.full_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-purple-400 prose-strong:text-white prose-code:text-purple-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  )
}
