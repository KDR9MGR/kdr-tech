'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import TiptapEditor from '@/components/admin/TiptapEditor'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface BlogPostFormProps {
  initialData?: any
  isEdit?: boolean
}

export default function BlogPostForm({ initialData, isEdit = false }: BlogPostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    featured_image: initialData?.featured_image || '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    status: initialData?.status || 'draft',
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from title
    if (field === 'title' && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent, status?: string) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        status: status || formData.status,
        published_at: status === 'published' ? new Date().toISOString() : null,
      }

      const url = isEdit ? `/api/blog/${initialData.slug}` : '/api/blog'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Blog post ${isEdit ? 'updated' : 'created'} successfully`,
        })
        router.push('/admin/blog')
        router.refresh()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save blog post',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button type="button" variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1" />
        <Button
          type="button"
          variant="outline"
          onClick={(e) => handleSubmit(e, 'draft')}
          disabled={loading}
          className="border-[#2A0E61] text-white hover:bg-[#030014]"
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, 'published')}
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update & Publish' : 'Publish'}
        </Button>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardContent className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              placeholder="Enter blog post title"
              className="bg-[#030014] border-[#2A0E61] text-white"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-white">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              required
              placeholder="blog-post-slug"
              className="bg-[#030014] border-[#2A0E61] text-white"
            />
            <p className="text-xs text-gray-500">
              URL: /blog/{formData.slug || 'your-slug'}
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Short description of the blog post"
              rows={3}
              className="flex w-full rounded-md border border-[#2A0E61] bg-[#030014] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="Technology, Design, Development..."
              className="bg-[#030014] border-[#2A0E61] text-white"
            />
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label htmlFor="featured_image" className="text-white">Featured Image URL</Label>
            <Input
              id="featured_image"
              type="url"
              value={formData.featured_image}
              onChange={(e) => handleChange('featured_image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-[#030014] border-[#2A0E61] text-white"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label className="text-white">Content *</Label>
            <TiptapEditor
              content={formData.content}
              onChange={(content) => handleChange('content', content)}
              placeholder="Write your blog post content here..."
            />
          </div>

          {/* SEO Meta */}
          <div className="space-y-4 pt-4 border-t border-[#2A0E61]">
            <h3 className="text-lg font-semibold text-white">SEO Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="meta_title" className="text-white">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                placeholder="SEO title (defaults to post title)"
                className="bg-[#030014] border-[#2A0E61] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description" className="text-white">Meta Description</Label>
              <textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                placeholder="SEO description (defaults to excerpt)"
                rows={2}
                className="flex w-full rounded-md border border-[#2A0E61] bg-[#030014] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
