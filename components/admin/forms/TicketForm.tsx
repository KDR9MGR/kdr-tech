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

interface TicketFormProps {
  initialData?: {
    id: string
    subject: string
    client_name: string
    status: string
    priority: string
    assigned_to: string
    description: string
    sla_hours: number
    rating: number | null
  }
  isEdit?: boolean
}

export default function TicketForm({ initialData, isEdit = false }: TicketFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    subject: initialData?.subject || '',
    client_name: initialData?.client_name || '',
    status: initialData?.status || 'new',
    priority: initialData?.priority || 'medium',
    assigned_to: initialData?.assigned_to || '',
    description: initialData?.description || '',
    sla_hours: initialData?.sla_hours ?? 24,
    rating: initialData?.rating?.toString() || '',
  })

  const set = (field: string, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, rating: form.rating ? parseInt(form.rating as string) : null }
      const url = isEdit ? `/api/tickets/${initialData?.id}` : '/api/tickets'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast({ title: 'Success', description: `Ticket ${isEdit ? 'updated' : 'created'} successfully` })
        router.push('/admin/tickets')
        router.refresh()
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err.error || 'Something went wrong', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save ticket', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/tickets')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit Ticket' : 'New Ticket'}</h1>
          <p className="text-gray-400">{isEdit ? 'Update support ticket details' : 'Log a new support request'}</p>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader><CardTitle className="text-white">Ticket Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-white">Subject *</Label>
              <Input required value={form.subject} onChange={e => set('subject', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., App not loading on iOS 17" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Client Name *</Label>
              <Input required value={form.client_name} onChange={e => set('client_name', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., James Whitfield" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Assigned To</Label>
              <Input value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., Arbaz K." />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="new" className="text-white">🔴 New</SelectItem>
                  <SelectItem value="in_progress" className="text-white">🟡 In Progress</SelectItem>
                  <SelectItem value="resolved" className="text-white">🟢 Resolved</SelectItem>
                  <SelectItem value="closed" className="text-white">⚫ Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Priority</Label>
              <Select value={form.priority} onValueChange={v => set('priority', v)}>
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="low" className="text-white">Low</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium</SelectItem>
                  <SelectItem value="high" className="text-white">High</SelectItem>
                  <SelectItem value="urgent" className="text-white">🚨 Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">SLA (hours)</Label>
              <Input type="number" min="1" value={form.sla_hours}
                onChange={e => set('sla_hours', parseInt(e.target.value) || 24)}
                className="bg-[#030014] border-[#2A0E61] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Client Rating (1–5)</Label>
              <Select value={form.rating} onValueChange={v => set('rating', v)}>
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white"><SelectValue placeholder="No rating yet" /></SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="" className="text-white">No rating</SelectItem>
                  <SelectItem value="5" className="text-white">⭐⭐⭐⭐⭐ (5)</SelectItem>
                  <SelectItem value="4" className="text-white">⭐⭐⭐⭐ (4)</SelectItem>
                  <SelectItem value="3" className="text-white">⭐⭐⭐ (3)</SelectItem>
                  <SelectItem value="2" className="text-white">⭐⭐ (2)</SelectItem>
                  <SelectItem value="1" className="text-white">⭐ (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-white">Description</Label>
              <Textarea value={form.description} onChange={e => set('description', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white min-h-[100px]"
                placeholder="Describe the issue in detail..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/tickets')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">Cancel</Button>
        <Button type="submit" disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : isEdit ? 'Update Ticket' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  )
}
