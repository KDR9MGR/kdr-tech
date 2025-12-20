'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import TextTestimonialForm from '@/components/admin/forms/TextTestimonialForm'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useToast } from '@/hooks/use-toast'

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

export default function EditTextTestimonialPage() {
  const params = useParams()
  const { toast } = useToast()
  const [testimonial, setTestimonial] = useState<TextTestimonial | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonial()
  }, [params.id])

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/testimonials/text/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTestimonial(data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load testimonial',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load testimonial',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#030014]">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading testimonial...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!testimonial) {
    return (
      <div className="flex min-h-screen bg-[#030014]">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Testimonial not found</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <TextTestimonialForm initialData={testimonial} isEdit />
      </main>
    </div>
  )
}
