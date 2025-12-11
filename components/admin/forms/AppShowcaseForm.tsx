'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'

interface AppShowcaseFormProps {
  initialData?: {
    id: string
    app_name: string
    logo_url: string
    app_url: string | null
    description: string | null
    category: string | null
    scroll_direction: string
    scroll_speed: number
    visible: boolean
    order_index: number
  }
  isEdit?: boolean
}

export default function AppShowcaseForm({ initialData, isEdit = false }: AppShowcaseFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    app_name: initialData?.app_name || '',
    logo_url: initialData?.logo_url || '',
    app_url: initialData?.app_url || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    scroll_direction: initialData?.scroll_direction || 'left',
    scroll_speed: initialData?.scroll_speed || 20,
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
      const url = isEdit ? `/api/showcase/${initialData?.id}` : '/api/showcase'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `App ${isEdit ? 'updated' : 'created'} successfully`,
        })
        router.push('/admin/showcase')
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
        description: 'Failed to save app',
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
          onClick={() => router.push('/admin/showcase')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? 'Edit App' : 'Add New App'}
          </h1>
          <p className="text-gray-400">
            {isEdit ? 'Update app details' : 'Add a new app to the showcase'}
          </p>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">App Details</CardTitle>
          <CardDescription className="text-gray-400">
            Basic information about the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app_name" className="text-white">
              App Name *
            </Label>
            <Input
              id="app_name"
              value={formData.app_name}
              onChange={(e) => handleChange('app_name', e.target.value)}
              required
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="Enter app name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url" className="text-white">
              Logo URL *
            </Label>
            <Input
              id="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={(e) => handleChange('logo_url', e.target.value)}
              required
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="https://example.com/logo.png"
            />
            {formData.logo_url && (
              <div className="mt-2">
                <img
                  src={formData.logo_url}
                  alt="Logo preview"
                  className="w-24 h-24 rounded object-cover border border-[#2A0E61]"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_url" className="text-white">
              App URL
            </Label>
            <Input
              id="app_url"
              type="url"
              value={formData.app_url}
              onChange={(e) => handleChange('app_url', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="https://app.example.com"
            />
            <p className="text-xs text-gray-400">
              URL to open when users click on the logo
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">
              Category
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="e.g., E-commerce, Finance, Education"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white min-h-[100px]"
              placeholder="Brief description of the app"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Scroll Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Configure how the app logo scrolls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scroll_direction" className="text-white">
              Scroll Direction
            </Label>
            <Select
              value={formData.scroll_direction}
              onValueChange={(value) => handleChange('scroll_direction', value)}
            >
              <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                <SelectItem value="left" className="text-white">
                  Left to Right
                </SelectItem>
                <SelectItem value="right" className="text-white">
                  Right to Left
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scroll_speed" className="text-white">
              Scroll Speed (seconds)
            </Label>
            <Input
              id="scroll_speed"
              type="number"
              min="5"
              max="60"
              value={formData.scroll_speed}
              onChange={(e) => handleChange('scroll_speed', parseInt(e.target.value))}
              className="bg-[#030014] border-[#2A0E61] text-white"
            />
            <p className="text-xs text-gray-400">
              Time in seconds for one complete scroll cycle (5-60 seconds)
            </p>
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
              Lower numbers appear first in the showcase
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/showcase')}
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
          {loading ? 'Saving...' : isEdit ? 'Update App' : 'Create App'}
        </Button>
      </div>
    </form>
  )
}
