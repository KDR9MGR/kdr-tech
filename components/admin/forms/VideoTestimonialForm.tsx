'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'

interface VideoTestimonialFormProps {
  initialData?: {
    id: string
    client_name: string
    client_company: string | null
    video_url: string
    thumbnail_url: string | null
    visible: boolean
    order_index: number
  }
  isEdit?: boolean
}

export default function VideoTestimonialForm({ initialData, isEdit = false }: VideoTestimonialFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    client_name: initialData?.client_name || '',
    client_company: initialData?.client_company || '',
    video_url: initialData?.video_url || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    visible: initialData?.visible ?? true,
    order_index: initialData?.order_index || 999,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit ? `/api/testimonials/video/${initialData?.id}` : '/api/testimonials/video'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Video testimonial ${isEdit ? 'updated' : 'created'} successfully`,
        })
        router.push('/admin/testimonials')
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Something went wrong',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save video testimonial',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/testimonials')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? 'Edit Video Testimonial' : 'Add Video Testimonial'}
          </h1>
          <p className="text-gray-400">
            {isEdit ? 'Update video testimonial details' : 'Add a new video testimonial'}
          </p>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Client Information</CardTitle>
          <CardDescription className="text-gray-400">
            Details about the client
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client_name" className="text-white">
              Client Name *
            </Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => handleChange('client_name', e.target.value)}
              required
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_company" className="text-white">
              Company
            </Label>
            <Input
              id="client_company"
              value={formData.client_company}
              onChange={(e) => handleChange('client_company', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="Enter company name"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Video Details</CardTitle>
          <CardDescription className="text-gray-400">
            Video URL and thumbnail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video_url" className="text-white">
              Video URL *
            </Label>
            <Input
              id="video_url"
              type="url"
              value={formData.video_url}
              onChange={(e) => handleChange('video_url', e.target.value)}
              required
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            />
            <p className="text-xs text-gray-400">
              Supports YouTube, Vimeo, or direct video URLs
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url" className="text-white">
              Thumbnail URL
            </Label>
            <Input
              id="thumbnail_url"
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => handleChange('thumbnail_url', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="https://example.com/thumbnail.jpg"
            />
            <p className="text-xs text-gray-400">
              Optional custom thumbnail (will auto-generate if empty)
            </p>
            {formData.thumbnail_url && (
              <div className="mt-2">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail preview"
                  className="w-48 h-auto rounded border border-[#2A0E61]"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="112"%3E%3Crect fill="%23333" width="200" height="112"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Thumbnail%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Visibility Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Control visibility and order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visible" className="text-white">
              Visibility
            </Label>
            <Select
              value={formData.visible.toString()}
              onValueChange={(value) => handleChange('visible', value === 'true')}
            >
              <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                <SelectItem value="true" className="text-white">
                  Visible
                </SelectItem>
                <SelectItem value="false" className="text-white">
                  Hidden
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index" className="text-white">
              Order Index
            </Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) => handleChange('order_index', parseInt(e.target.value))}
              className="bg-[#030014] border-[#2A0E61] text-white"
            />
            <p className="text-xs text-gray-400">
              Lower numbers appear first
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/testimonials')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
      </div>
    </form>
  )
}
