'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import FooterLinkForm from '@/components/admin/forms/FooterLinkForm'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useToast } from '@/hooks/use-toast'

interface FooterLink {
  id: string
  title: string
  url: string
  category: string
  icon_name: string | null
  visible: boolean
  order_index: number
}

export default function EditFooterLinkPage() {
  const params = useParams()
  const { toast } = useToast()
  const [link, setLink] = useState<FooterLink | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLink = useCallback(async () => {
    try {
      const response = await fetch(`/api/footer-links/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setLink(data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load footer link',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load footer link',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [params.id, toast])

  useEffect(() => {
    fetchLink()
  }, [fetchLink])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#030014]">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading footer link...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!link) {
    return (
      <div className="flex min-h-screen bg-[#030014]">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Footer link not found</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <FooterLinkForm initialData={link} isEdit />
      </main>
    </div>
  )
}
