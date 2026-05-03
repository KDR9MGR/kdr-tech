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

interface DealFormProps {
  initialData?: {
    id: string
    client_name: string
    company: string
    email: string
    project_type: string
    package_name: string
    deal_value: number
    stage: string
    notes: string
  }
  isEdit?: boolean
}

export default function DealForm({ initialData, isEdit = false }: DealFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    client_name: initialData?.client_name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    project_type: initialData?.project_type || 'mobile_app',
    package_name: initialData?.package_name || '',
    deal_value: initialData?.deal_value ?? 0,
    stage: initialData?.stage || 'contacted',
    notes: initialData?.notes || '',
  })

  const set = (field: string, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = isEdit ? `/api/deals/${initialData?.id}` : '/api/deals'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: 'Success', description: `Deal ${isEdit ? 'updated' : 'created'} successfully` })
        router.push('/admin/deals')
        router.refresh()
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err.error || 'Something went wrong', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save deal', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/deals')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit Deal' : 'Add Deal'}</h1>
          <p className="text-gray-400">Track a sales pipeline opportunity</p>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader><CardTitle className="text-white">Contact Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Client Name *</Label>
              <Input required value={form.client_name} onChange={e => set('client_name', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., Alex Johnson" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Company</Label>
              <Input value={form.company} onChange={e => set('company', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., RunnerUp Co." />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="alex@company.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader><CardTitle className="text-white">Deal Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., MVP Lite" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Deal Value (USD)</Label>
              <Input type="number" min="0" step="0.01" value={form.deal_value}
                onChange={e => set('deal_value', parseFloat(e.target.value) || 0)}
                className="bg-[#030014] border-[#2A0E61] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Pipeline Stage</Label>
              <Select value={form.stage} onValueChange={v => set('stage', v)}>
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="contacted" className="text-white">📞 Contacted</SelectItem>
                  <SelectItem value="discovery" className="text-white">🔍 Discovery Call</SelectItem>
                  <SelectItem value="proposal" className="text-white">📄 Proposal Sent</SelectItem>
                  <SelectItem value="negotiation" className="text-white">🤝 Negotiation</SelectItem>
                  <SelectItem value="closed_won" className="text-white">✅ Closed Won</SelectItem>
                  <SelectItem value="closed_lost" className="text-white">❌ Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-white">Notes</Label>
              <Textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white min-h-[80px]"
                placeholder="Deal context, next steps, key requirements..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/deals')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">Cancel</Button>
        <Button type="submit" disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : isEdit ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  )
}
