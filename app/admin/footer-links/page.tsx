'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'

interface FooterLink {
  id: string
  title: string
  url: string
  category: string
  icon_name: string | null
  visible: boolean
  order_index: number
}

export default function FooterLinksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [links, setLinks] = useState<FooterLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/footer-links')
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load footer links',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/footer-links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisibility }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Link ${!currentVisibility ? 'shown' : 'hidden'} successfully`,
        })
        fetchLinks()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update visibility',
        variant: 'destructive',
      })
    }
  }

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const response = await fetch(`/api/footer-links/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Link deleted successfully',
        })
        fetchLinks()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive',
      })
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'page':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'social':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Footer Links</h1>
              <p className="text-gray-400 mt-1">
                Manage page links and social media links for the footer
              </p>
            </div>
            <Button
              onClick={() => router.push('/admin/footer-links/new')}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Footer Link
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">Loading footer links...</p>
            </div>
          ) : (
            <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2A0E61] hover:bg-[#1A1A2E]">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">URL</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Icon</TableHead>
                    <TableHead className="text-gray-300">Order</TableHead>
                    <TableHead className="text-gray-300">Visible</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                        No footer links found. Create your first link!
                      </TableCell>
                    </TableRow>
                  ) : (
                    links.map((link) => (
                      <TableRow
                        key={link.id}
                        className="border-[#2A0E61] hover:bg-[#030014]"
                      >
                        <TableCell className="text-white font-medium">
                          {link.title}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-purple-400"
                          >
                            {link.url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs border ${getCategoryBadgeColor(
                              link.category
                            )}`}
                          >
                            {link.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {link.icon_name || '-'}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {link.order_index}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(link.id, link.visible)}
                            className="text-gray-400 hover:text-white"
                          >
                            {link.visible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/footer-links/${link.id}/edit`)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteLink(link.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
