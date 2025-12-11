'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Star } from 'lucide-react'

interface TextTestimonialFormProps {
  initialData?: {
    id: string
    client_name: string
    client_company: string | null
    client_position: string | null
    testimonial_text: string
    rating: number | null
    visible: boolean
    order_index: number
  }
  isEdit?: boolean
}

export default function TextTestimonialForm({ initialData, isEdit = false }: TextTestimonialFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    client_name: initialData?.client_name || '',
    client_company: initialData?.client_company || '',
    client_position: initialData?.client_position || '',
    testimonial_text: initialData?.testimonial_text || '',
    rating: initialData?.rating || 5,
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
      const url = isEdit ? `/api/testimonials/text/${initialData?.id}` : '/api/testimonials/text'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Text testimonial ${isEdit ? 'updated' : 'created'} successfully`,
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
        description: 'Failed to save text testimonial',
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
            {isEdit ? 'Edit Text Testimonial' : 'Add Text Testimonial'}
          </h1>
          <p className="text-gray-400">
            {isEdit ? 'Update text testimonial details' : 'Add a new text testimonial'}
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

          <div className="space-y-2">
            <Label htmlFor="client_position" className="text-white">
              Position
            </Label>
            <Input
              id="client_position"
              value={formData.client_position}
              onChange={(e) => handleChange('client_position', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="e.g., CEO, CTO, Marketing Director"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Testimonial Content</CardTitle>
          <CardDescription className="text-gray-400">
            The testimonial text and rating
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testimonial_text" className="text-white">
              Testimonial Text *
            </Label>
            <Textarea
              id="testimonial_text"
              value={formData.testimonial_text}
              onChange={(e) => handleChange('testimonial_text', e.target.value)}
              required
              className="bg-[#030014] border-[#2A0E61] text-white min-h-[150px]"
              placeholder="Enter the client's testimonial..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating" className="text-white">
              Rating
            </Label>
            <Select
              value={formData.rating?.toString() || '5'}
              onValueChange={(value) => handleChange('rating', parseInt(value))}
            >
              <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                <SelectItem value="5" className="text-white">
                  <div className="flex items-center gap-2">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span>5 Stars</span>
                  </div>
                </SelectItem>
                <SelectItem value="4" className="text-white">
                  <div className="flex items-center gap-2">
                    <span>⭐⭐⭐⭐</span>
                    <span>4 Stars</span>
                  </div>
                </SelectItem>
                <SelectItem value="3" className="text-white">
                  <div className="flex items-center gap-2">
                    <span>⭐⭐⭐</span>
                    <span>3 Stars</span>
                  </div>
                </SelectItem>
                <SelectItem value="2" className="text-white">
                  <div className="flex items-center gap-2">
                    <span>⭐⭐</span>
                    <span>2 Stars</span>
                  </div>
                </SelectItem>
                <SelectItem value="1" className="text-white">
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>1 Star</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              {formData.rating && '⭐'.repeat(formData.rating)}
            </div>
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
