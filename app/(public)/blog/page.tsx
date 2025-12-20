import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  featured_image: string | null
  published_at: string
  author: {
    full_name: string
    slug: string
  } | null
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        category,
        featured_image,
        published_at,
        profiles!author_id (
          full_name,
          slug
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return []
    }

    if (!data) return []

    // Transform the data to match our interface
    return data.map(post => ({
      ...post,
      author: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
    })) as BlogPost[]
  } catch (error) {
    console.error('Error in getBlogPosts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
            Our Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and stories from our team
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-[#1A1A2E] border border-[#2A0E61] rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300"
              >
                {/* Featured Image */}
                {post.featured_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Category */}
                  {post.category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">
                      {post.category}
                    </span>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm line-clamp-3">{post.excerpt}</p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-[#2A0E61]">
                    {post.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{post.author.full_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-purple-400 text-sm font-medium pt-2">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
