'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AppShowcaseForm from '@/components/admin/forms/AppShowcaseForm'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useToast } from '@/hooks/use-toast'

interface App {
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

export default function EditAppPage() {
  const params = useParams()
  const { toast } = useToast()
  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApp()
  }, [params.id])

  const fetchApp = async () => {
    try {
      const response = await fetch(`/api/showcase/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setApp(data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load app',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load app',
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
            <p className="text-gray-400">Loading app...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex min-h-screen bg-[#030014]">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">App not found</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <AppShowcaseForm initialData={app} isEdit />
      </main>
    </div>
  )
}
