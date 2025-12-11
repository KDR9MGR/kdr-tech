'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  status: string
  published_at: string | null
  created_at: string
  author: {
    full_name: string
    slug: string
  } | null
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/blog' : `/api/blog?status=${filter}`
      const response = await fetch(url)
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Blog post deleted successfully',
        })
        fetchPosts()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#030014]">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading blog posts...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-gray-400">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'border-[#2A0E61] text-white hover:bg-[#030014]'}
        >
          All Posts
        </Button>
        <Button
          variant={filter === 'published' ? 'default' : 'outline'}
          onClick={() => setFilter('published')}
          className={filter === 'published' ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'border-[#2A0E61] text-white hover:bg-[#030014]'}
        >
          Published
        </Button>
        <Button
          variant={filter === 'draft' ? 'default' : 'outline'}
          onClick={() => setFilter('draft')}
          className={filter === 'draft' ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'border-[#2A0E61] text-white hover:bg-[#030014]'}
        >
          Drafts
        </Button>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">All Blog Posts</CardTitle>
          <CardDescription className="text-gray-400">
            {posts.length} post{posts.length !== 1 ? 's' : ''} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                {filter === 'all' ? 'No blog posts yet' : `No ${filter} posts`}
              </p>
              <Link href="/admin/blog/new">
                <Button variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2A0E61] hover:bg-[#030014]">
                    <TableHead className="text-gray-400">Title</TableHead>
                    <TableHead className="text-gray-400">Author</TableHead>
                    <TableHead className="text-gray-400">Category</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id} className="border-[#2A0E61] hover:bg-[#030014]">
                      <TableCell className="text-white font-medium max-w-xs">
                        <div className="truncate">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-400 truncate mt-1">
                            {post.excerpt}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {post.author?.full_name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {post.category || '-'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            post.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {post.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {post.published_at
                          ? format(new Date(post.published_at), 'MMM d, yyyy')
                          : format(new Date(post.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === 'published' && (
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#2A0E61] text-white hover:bg-[#030014]"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/blog/${post.slug}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#2A0E61] text-white hover:bg-[#030014]"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.slug, post.title)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </main>
    </div>
  )
}
