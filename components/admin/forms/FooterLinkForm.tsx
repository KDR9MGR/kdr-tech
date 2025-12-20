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

interface FooterLinkFormProps {
  initialData?: {
    id: string
    title: string
    url: string
    category: string
    icon_name: string | null
    visible: boolean
    order_index: number
  }
  isEdit?: boolean
}

export default function FooterLinkForm({ initialData, isEdit = false }: FooterLinkFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    url: initialData?.url || '',
    category: initialData?.category || 'page',
    icon_name: initialData?.icon_name || '',
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
      const url = isEdit ? `/api/footer-links/${initialData?.id}` : '/api/footer-links'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Footer link ${isEdit ? 'updated' : 'created'} successfully`,
        })
        router.push('/admin/footer-links')
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
        description: 'Failed to save footer link',
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
          onClick={() => router.push('/admin/footer-links')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? 'Edit Footer Link' : 'Add Footer Link'}
          </h1>
          <p className="text-gray-400">
            {isEdit ? 'Update footer link details' : 'Add a new link to the footer'}
          </p>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Link Details</CardTitle>
          <CardDescription className="text-gray-400">
            Basic information about the link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Link Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="e.g., Home, Facebook, About"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-white">
              URL *
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              required
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="https://example.com or /#section"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                <SelectItem value="page" className="text-white">
                  Page Link
                </SelectItem>
                <SelectItem value="social" className="text-white">
                  Social Media
                </SelectItem>
                <SelectItem value="other" className="text-white">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.category === 'social' && (
            <div className="space-y-2">
              <Label htmlFor="icon_name" className="text-white">
                Icon Name
              </Label>
              <Select
                value={formData.icon_name || ''}
                onValueChange={(value) => handleChange('icon_name', value)}
              >
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="facebook" className="text-white">
                    Facebook
                  </SelectItem>
                  <SelectItem value="twitter" className="text-white">
                    Twitter
                  </SelectItem>
                  <SelectItem value="linkedin" className="text-white">
                    LinkedIn
                  </SelectItem>
                  <SelectItem value="instagram" className="text-white">
                    Instagram
                  </SelectItem>
                  <SelectItem value="github" className="text-white">
                    GitHub
                  </SelectItem>
                  <SelectItem value="youtube" className="text-white">
                    YouTube
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                Icon to display for social media links
              </p>
            </div>
          )}
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
          onClick={() => router.push('/admin/footer-links')}
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
          {loading ? 'Saving...' : isEdit ? 'Update Link' : 'Create Link'}
        </Button>
      </div>
    </form>
  )
}
