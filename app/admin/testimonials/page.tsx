'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Eye, EyeOff, Video, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface VideoTestimonial {
  id: string
  client_name: string
  client_company: string | null
  video_url: string
  thumbnail_url: string | null
  visible: boolean
  order_index: number
}

interface TextTestimonial {
  id: string
  client_name: string
  client_company: string | null
  client_position: string | null
  testimonial_text: string
  rating: number | null
  visible: boolean
  order_index: number
}

export default function TestimonialsPage() {
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([])
  const [textTestimonials, setTextTestimonials] = useState<TextTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const [videoRes, textRes] = await Promise.all([
        fetch('/api/testimonials/video'),
        fetch('/api/testimonials/text'),
      ])

      const videoData = await videoRes.json()
      const textData = await textRes.json()

      setVideoTestimonials(videoData)
      setTextTestimonials(textData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load testimonials',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s video testimonial?`)) return

    try {
      const response = await fetch(`/api/testimonials/video/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Video testimonial deleted successfully',
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteText = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s testimonial?`)) return

    try {
      const response = await fetch(`/api/testimonials/text/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Testimonial deleted successfully',
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      })
    }
  }

  const toggleVideoVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const response = await fetch(`/api/testimonials/video/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Testimonial ${!currentVisible ? 'published' : 'unpublished'}`,
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update visibility',
        variant: 'destructive',
      })
    }
  }

  const toggleTextVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const response = await fetch(`/api/testimonials/text/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Testimonial ${!currentVisible ? 'published' : 'unpublished'}`,
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update visibility',
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
            <p className="text-gray-400">Loading testimonials...</p>
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
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Testimonials</h1>
            <p className="text-gray-400">Manage client testimonials and reviews</p>
          </div>

          <Tabs defaultValue="video" className="space-y-6">
            <TabsList className="bg-[#1A1A2E] border border-[#2A0E61]">
              <TabsTrigger value="video" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Video className="w-4 h-4 mr-2" />
                Video Testimonials
              </TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <FileText className="w-4 h-4 mr-2" />
                Text Testimonials
              </TabsTrigger>
            </TabsList>

            {/* Video Testimonials Tab */}
            <TabsContent value="video" className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">{videoTestimonials.length} video testimonials</p>
                <Link href="/admin/testimonials/video/new">
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video Testimonial
                  </Button>
                </Link>
              </div>

              <Card className="bg-[#1A1A2E] border-[#2A0E61]">
                <CardHeader>
                  <CardTitle className="text-white">Video Testimonials</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage client video testimonials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {videoTestimonials.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400 mb-4">No video testimonials yet</p>
                      <Link href="/admin/testimonials/video/new">
                        <Button variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Video Testimonial
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#2A0E61] hover:bg-[#030014]">
                          <TableHead className="text-gray-400">Client</TableHead>
                          <TableHead className="text-gray-400">Company</TableHead>
                          <TableHead className="text-gray-400">Video URL</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                          <TableHead className="text-gray-400 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {videoTestimonials.map((testimonial) => (
                          <TableRow key={testimonial.id} className="border-[#2A0E61] hover:bg-[#030014]">
                            <TableCell className="text-white font-medium">
                              {testimonial.client_name}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {testimonial.client_company || '-'}
                            </TableCell>
                            <TableCell className="text-gray-300 max-w-xs truncate">
                              <a
                                href={testimonial.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:underline"
                              >
                                {testimonial.video_url}
                              </a>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => toggleVideoVisibility(testimonial.id, testimonial.visible)}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                  testimonial.visible
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}
                              >
                                {testimonial.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {testimonial.visible ? 'Visible' : 'Hidden'}
                              </button>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/admin/testimonials/video/${testimonial.id}/edit`}>
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
                                  onClick={() => handleDeleteVideo(testimonial.id, testimonial.client_name)}
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Text Testimonials Tab */}
            <TabsContent value="text" className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">{textTestimonials.length} text testimonials</p>
                <Link href="/admin/testimonials/text/new">
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Text Testimonial
                  </Button>
                </Link>
              </div>

              <Card className="bg-[#1A1A2E] border-[#2A0E61]">
                <CardHeader>
                  <CardTitle className="text-white">Text Testimonials</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage client text reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {textTestimonials.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400 mb-4">No text testimonials yet</p>
                      <Link href="/admin/testimonials/text/new">
                        <Button variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Text Testimonial
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#2A0E61] hover:bg-[#030014]">
                          <TableHead className="text-gray-400">Client</TableHead>
                          <TableHead className="text-gray-400">Company</TableHead>
                          <TableHead className="text-gray-400">Position</TableHead>
                          <TableHead className="text-gray-400">Testimonial</TableHead>
                          <TableHead className="text-gray-400">Rating</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                          <TableHead className="text-gray-400 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {textTestimonials.map((testimonial) => (
                          <TableRow key={testimonial.id} className="border-[#2A0E61] hover:bg-[#030014]">
                            <TableCell className="text-white font-medium">
                              {testimonial.client_name}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {testimonial.client_company || '-'}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {testimonial.client_position || '-'}
                            </TableCell>
                            <TableCell className="text-gray-300 max-w-xs">
                              <div className="truncate">{testimonial.testimonial_text}</div>
                            </TableCell>
                            <TableCell className="text-yellow-400">
                              {testimonial.rating ? '⭐'.repeat(testimonial.rating) : '-'}
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => toggleTextVisibility(testimonial.id, testimonial.visible)}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                  testimonial.visible
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}
                              >
                                {testimonial.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {testimonial.visible ? 'Visible' : 'Hidden'}
                              </button>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/admin/testimonials/text/${testimonial.id}/edit`}>
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
                                  onClick={() => handleDeleteText(testimonial.id, testimonial.client_name)}
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
