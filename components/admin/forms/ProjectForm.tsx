'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'

interface ProjectFormProps {
  initialData?: {
    id: string
    title: string
    client_name: string
    project_type: string
    package_name: string
    revenue: number
    paid_amount: number
    status: string
    country: string
    flag_emoji: string
    start_date: string
    end_date: string
    notes: string
  }
  isEdit?: boolean
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: initialData?.title || '',
    client_name: initialData?.client_name || '',
    project_type: initialData?.project_type || 'mobile_app',
    package_name: initialData?.package_name || '',
    revenue: initialData?.revenue ?? 0,
    paid_amount: initialData?.paid_amount ?? 0,
    status: initialData?.status || 'active',
    country: initialData?.country || '',
    flag_emoji: initialData?.flag_emoji || '',
    start_date: initialData?.start_date?.slice(0, 10) || '',
    end_date: initialData?.end_date?.slice(0, 10) || '',
    notes: initialData?.notes || '',
  })

  const set = (field: string, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = isEdit ? `/api/projects/${initialData?.id}` : '/api/projects'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: 'Success', description: `Project ${isEdit ? 'updated' : 'created'} successfully` })
        router.push('/admin/projects')
        router.refresh()
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err.error || 'Something went wrong', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save project', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/projects')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit Project' : 'Add Project'}</h1>
          <p className="text-gray-400">Track a client project and its revenue</p>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader><CardTitle className="text-white">Project Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Project Title *</Label>
              <Input required value={form.title} onChange={e => set('title', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., FitTrack Pro" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Client Name *</Label>
              <Input required value={form.client_name} onChange={e => set('client_name', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., James Whitfield" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Project Type</Label>
              <Select value={form.project_type} onValueChange={v => set('project_type', v)}>
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="mobile_app" className="text-white">📱 Mobile App</SelectItem>
                  <SelectItem value="website" className="text-white">🌐 Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Package Name</Label>
              <Input value={form.package_name} onChange={e => set('package_name', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., Growth MVP" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Country</Label>
              <Input value={form.country} onChange={e => set('country', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., USA" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Flag Emoji</Label>
              <Input value={form.flag_emoji} onChange={e => set('flag_emoji', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., 🇺🇸" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader><CardTitle className="text-white">Revenue & Status</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Total Revenue (USD)</Label>
              <Input type="number" min="0" step="0.01" value={form.revenue}
                onChange={e => set('revenue', parseFloat(e.target.value) || 0)}
                className="bg-[#030014] border-[#2A0E61] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Paid Amount (USD)</Label>
              <Input type="number" min="0" step="0.01" value={form.paid_amount}
                onChange={e => set('paid_amount', parseFloat(e.target.value) || 0)}
                className="bg-[#030014] border-[#2A0E61] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="active" className="text-white">🟡 Active</SelectItem>
                  <SelectItem value="completed" className="text-white">🟢 Completed</SelectItem>
                  <SelectItem value="on_hold" className="text-white">🟠 On Hold</SelectItem>
                  <SelectItem value="cancelled" className="text-white">🔴 Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Start Date</Label>
              <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">End Date</Label>
              <Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Notes</Label>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white min-h-[80px]" placeholder="Any additional notes..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/projects')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">Cancel</Button>
        <Button type="submit" disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
