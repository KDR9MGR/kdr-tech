'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface TeamMember {
  id: string
  full_name: string
  slug: string
  job_title: string
  department: string | null
  location: string | null
  photo_url: string | null
  visible: boolean
  is_featured: boolean
  order_index: number
}

export default function TeamListPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/team')
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load team members',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Team member deleted successfully',
        })
        fetchMembers()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete team member',
        variant: 'destructive',
      })
    }
  }

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Team member ${!currentVisible ? 'published' : 'unpublished'}`,
        })
        fetchMembers()
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
            <p className="text-gray-400">Loading team members...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
          <p className="text-gray-400">Manage your team members</p>
        </div>
        <Link href="/admin/team/new">
          <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </Link>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">All Team Members</CardTitle>
          <CardDescription className="text-gray-400">
            {members.length} team member{members.length !== 1 ? 's' : ''} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No team members yet</p>
              <Link href="/admin/team/new">
                <Button variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Team Member
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2A0E61] hover:bg-[#030014]">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Job Title</TableHead>
                    <TableHead className="text-gray-400">Department</TableHead>
                    <TableHead className="text-gray-400">Location</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Featured</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="border-[#2A0E61] hover:bg-[#030014]">
                      <TableCell className="text-white font-medium">
                        <div className="flex items-center gap-3">
                          {member.photo_url && (
                            <img
                              src={member.photo_url}
                              alt={member.full_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          {member.full_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{member.job_title}</TableCell>
                      <TableCell className="text-gray-300">{member.department || '-'}</TableCell>
                      <TableCell className="text-gray-300">{member.location || '-'}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleVisibility(member.id, member.visible)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            member.visible
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {member.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {member.visible ? 'Visible' : 'Hidden'}
                        </button>
                      </TableCell>
                      <TableCell>
                        {member.is_featured && (
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/team/${member.id}/edit`}>
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
                            onClick={() => handleDelete(member.id, member.full_name)}
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
