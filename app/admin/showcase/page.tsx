'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowRight, ArrowLeft, Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AdminSidebar from '@/components/admin/AdminSidebar'

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

export default function ShowcasePage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    setLoading(true)
    try {
      // Add cache-busting query parameter to force fresh data
      const response = await fetch(`/api/showcase?admin=true&t=${Date.now()}`)
      const data = await response.json()
      setApps(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load apps',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const response = await fetch(`/api/showcase/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'App deleted successfully',
        })
        fetchApps()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete app',
        variant: 'destructive',
      })
    }
  }

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const response = await fetch(`/api/showcase/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `App ${!currentVisible ? 'published' : 'unpublished'}`,
        })
        fetchApps()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update visibility',
        variant: 'destructive',
      })
    }
  }

  const handleDuplicate = async (app: App) => {
    try {
      const duplicateData = {
        app_name: `${app.app_name} (Copy)`,
        logo_url: app.logo_url,
        app_url: app.app_url,
        description: app.description,
        category: app.category,
        scroll_direction: app.scroll_direction,
        scroll_speed: app.scroll_speed,
        visible: false, // Set to hidden by default
        order_index: app.order_index + 1,
      }

      const response = await fetch('/api/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'App duplicated successfully',
        })
        fetchApps()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate app',
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
            <p className="text-gray-400">Loading apps...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">App Showcase</h1>
              <p className="text-gray-400">Manage completed apps with scrolling logos</p>
            </div>
            <Link href="/admin/showcase/new">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Add App
              </Button>
            </Link>
          </div>

          <Card className="bg-[#1A1A2E] border-[#2A0E61]">
            <CardHeader>
              <CardTitle className="text-white">All Apps</CardTitle>
              <CardDescription className="text-gray-400">
                {apps.length} app{apps.length !== 1 ? 's' : ''} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apps.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No apps yet</p>
                  <Link href="/admin/showcase/new">
                    <Button variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First App
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#2A0E61] hover:bg-[#030014]">
                        <TableHead className="text-gray-400">Logo</TableHead>
                        <TableHead className="text-gray-400">App Name</TableHead>
                        <TableHead className="text-gray-400">Category</TableHead>
                        <TableHead className="text-gray-400">Scroll</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apps.map((app) => (
                        <TableRow key={app.id} className="border-[#2A0E61] hover:bg-[#030014]">
                          <TableCell>
                            <img
                              src={app.logo_url}
                              alt={app.app_name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            <div>{app.app_name}</div>
                            {app.app_url && (
                              <a
                                href={app.app_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-400 hover:underline"
                              >
                                View App
                              </a>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {app.category || '-'}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="flex items-center gap-1">
                              {app.scroll_direction === 'left' ? (
                                <ArrowLeft className="w-4 h-4" />
                              ) : (
                                <ArrowRight className="w-4 h-4" />
                              )}
                              <span className="capitalize">{app.scroll_direction}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => toggleVisibility(app.id, app.visible)}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                app.visible
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {app.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              {app.visible ? 'Visible' : 'Hidden'}
                            </button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDuplicate(app)}
                                className="border-[#2A0E61] text-cyan-400 hover:bg-[#030014]"
                                title="Duplicate app"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Link href={`/admin/showcase/${app.id}/edit`}>
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
                                onClick={() => handleDelete(app.id, app.app_name)}
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
