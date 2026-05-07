'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Upload, X, Video } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface VideoTestimonialFormProps {
  initialData?: {
    id: string
    client_name: string
    company_name: string | null
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
  const supabase = createClient()
  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [formData, setFormData] = useState({
    client_name: initialData?.client_name || '',
    company_name: initialData?.company_name || '',
    video_url: initialData?.video_url || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    visible: initialData?.visible ?? true,
    order_index: initialData?.order_index || 999,
  })

  const handleChange = (field: string, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const uploadFile = async (
    file: File,
    bucket: string,
    folder: string,
    setUploading: (v: boolean) => void,
    field: string
  ) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
      handleChange(field, publicUrl)
      toast({ title: 'Uploaded', description: 'File uploaded successfully' })
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || 'Could not upload file', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadFile(file, 'videos', 'testimonials', setUploadingVideo, 'video_url')
  }

  const handleThumbFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadFile(file, 'testimonials', 'thumbnails', setUploadingThumb, 'thumbnail_url')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = isEdit ? `/api/testimonials/video/${initialData?.id}` : '/api/testimonials/video'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast({ title: 'Success', description: `Video testimonial ${isEdit ? 'updated' : 'created'} successfully` })
        router.push('/admin/testimonials')
        router.refresh()
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err.error || 'Something went wrong', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save video testimonial', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/testimonials')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? 'Edit Video Testimonial' : 'Add Video Testimonial'}
          </h1>
          <p className="text-gray-400">Upload a video file for native playback</p>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Client Name *</Label>
            <Input required value={formData.client_name} onChange={e => handleChange('client_name', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g. Louie Malpeli" />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Company</Label>
            <Input value={formData.company_name} onChange={e => handleChange('company_name', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g. Malpeli Clothing" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Video File</CardTitle>
          <CardDescription className="text-gray-400">
            Upload an MP4/WebM file for native browser playback (no YouTube embedding)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload button */}
          <div className="space-y-2">
            <Label className="text-white">Upload Video *</Label>
            <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/mov,video/quicktime"
              className="hidden" onChange={handleVideoFile} />
            <div className="flex gap-3">
              <Button type="button" onClick={() => videoInputRef.current?.click()} disabled={uploadingVideo}
                variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
                <Upload className="w-4 h-4 mr-2" />
                {uploadingVideo ? 'Uploading…' : 'Choose Video File'}
              </Button>
              {formData.video_url && (
                <Button type="button" variant="ghost" size="icon"
                  className="text-red-400 hover:text-red-300 hover:bg-transparent"
                  onClick={() => handleChange('video_url', '')}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">Supported: MP4, WebM, MOV — uploads to Supabase Storage</p>
          </div>

          {/* Preview if URL exists */}
          {formData.video_url && (
            <div className="space-y-2">
              <Label className="text-white text-sm">Preview</Label>
              <div className="relative rounded-xl overflow-hidden bg-black border border-[#2A0E61] max-w-sm">
                <video
                  src={formData.video_url}
                  controls
                  muted
                  className="w-full"
                  style={{ maxHeight: '300px' }}
                />
              </div>
              <p className="text-xs text-gray-500 break-all">{formData.video_url}</p>
            </div>
          )}

          {/* Fallback URL input */}
          {!formData.video_url && (
            <div className="space-y-2 pt-2 border-t border-[#2A0E61]">
              <Label className="text-white text-sm">Or paste a direct video URL</Label>
              <Input value={formData.video_url} onChange={e => handleChange('video_url', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white text-sm"
                placeholder="https://your-cdn.com/video.mp4" />
              <p className="text-xs text-gray-500">Must be a direct .mp4 / .webm URL, not a YouTube link</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Thumbnail</CardTitle>
          <CardDescription className="text-gray-400">Optional — shown before video loads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbFile} />
          <div className="flex gap-3">
            <Button type="button" onClick={() => thumbInputRef.current?.click()} disabled={uploadingThumb}
              variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
              <Upload className="w-4 h-4 mr-2" />
              {uploadingThumb ? 'Uploading…' : 'Upload Thumbnail'}
            </Button>
            {formData.thumbnail_url && (
              <Button type="button" variant="ghost" size="icon"
                className="text-red-400 hover:text-red-300 hover:bg-transparent"
                onClick={() => handleChange('thumbnail_url', '')}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {formData.thumbnail_url && (
            <img src={formData.thumbnail_url} alt="Thumbnail"
              className="w-48 h-auto rounded-lg border border-[#2A0E61]" />
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader><CardTitle className="text-white">Visibility</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Visibility</Label>
              <Select value={formData.visible.toString()} onValueChange={v => handleChange('visible', v === 'true')}>
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="true" className="text-white">Visible</SelectItem>
                  <SelectItem value="false" className="text-white">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Order Index</Label>
              <Input type="number" value={formData.order_index}
                onChange={e => handleChange('order_index', parseInt(e.target.value))}
                className="bg-[#030014] border-[#2A0E61] text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/testimonials')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">Cancel</Button>
        <Button type="submit" disabled={loading || !formData.video_url}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving…' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
      </div>
    </form>
  )
}
