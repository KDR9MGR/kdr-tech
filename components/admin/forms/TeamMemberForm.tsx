'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface TeamMemberFormProps {
  initialData?: any
  isEdit?: boolean
}

export default function TeamMemberForm({ initialData, isEdit = false }: TeamMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    slug: initialData?.slug || '',
    job_title: initialData?.job_title || '',
    department: initialData?.department || '',
    short_bio: initialData?.short_bio || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    photo_url: initialData?.photo_url || '',
    visible: initialData?.visible ?? true,
    is_featured: initialData?.is_featured ?? false,
    order_index: initialData?.order_index || 999,
    social_links: initialData?.social_links || {
      linkedin: '',
      twitter: '',
      portfolio: '',
      github: '',
    },
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from full_name
    if (field === 'full_name' && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit ? `/api/team/${initialData.id}` : '/api/team'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }

      toast({
        title: 'Success',
        description: `Team member ${isEdit ? 'updated' : 'created'} successfully`,
      })

      router.push('/admin/team')
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save team member',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Basic Information</CardTitle>
          <CardDescription className="text-gray-400">
            Core details about the team member
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-white">
                Full Name *
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-white">
                Slug (URL-friendly name)
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="john-doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_title" className="text-white">
                Job Title *
              </Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => handleChange('job_title', e.target.value)}
                required
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="Senior Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-white">
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleChange('department', value)}
              >
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="Bengaluru, India"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Biography</CardTitle>
          <CardDescription className="text-gray-400">
            Tell us about this team member
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="short_bio" className="text-white">
              Short Bio (160 characters max)
            </Label>
            <Textarea
              id="short_bio"
              value={formData.short_bio}
              onChange={(e) => handleChange('short_bio', e.target.value.slice(0, 160))}
              maxLength={160}
              rows={2}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="A brief one-liner about their role..."
            />
            <p className="text-xs text-gray-500">{formData.short_bio.length}/160 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              Full Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={6}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="Detailed biography..."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Contact & Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-white">
                LinkedIn URL
              </Label>
              <Input
                id="linkedin"
                value={formData.social_links.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-white">
                Twitter/X URL
              </Label>
              <Input
                id="twitter"
                value={formData.social_links.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-white">
                Portfolio URL
              </Label>
              <Input
                id="portfolio"
                value={formData.social_links.portfolio}
                onChange={(e) => handleSocialChange('portfolio', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="https://portfolio.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="text-white">
                GitHub URL
              </Label>
              <Input
                id="github"
                value={formData.social_links.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Photo & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo_url" className="text-white">
              Photo URL (temporary - upload feature coming next)
            </Label>
            <Input
              id="photo_url"
              value={formData.photo_url}
              onChange={(e) => handleChange('photo_url', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order_index" className="text-white">
                Display Order
              </Label>
              <Input
                id="order_index"
                type="number"
                value={formData.order_index}
                onChange={(e) => handleChange('order_index', parseInt(e.target.value))}
                className="bg-[#030014] border-[#2A0E61] text-white"
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible}
                onChange={(e) => handleChange('visible', e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="visible" className="text-white cursor-pointer">
                Visible on website
              </Label>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => handleChange('is_featured', e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="is_featured" className="text-white cursor-pointer">
                Featured member
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? 'Update Team Member' : 'Create Team Member'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-[#2A0E61] text-white hover:bg-[#030014]"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
