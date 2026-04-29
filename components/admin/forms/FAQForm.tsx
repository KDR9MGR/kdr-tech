'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'

interface FAQFormProps {
  initialData?: {
    id: string
    question: string
    answer: string
    category: string
    visible: boolean
    order_index: number
  }
  isEdit?: boolean
}

export default function FAQForm({ initialData, isEdit = false }: FAQFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    category: initialData?.category || 'general',
    visible: initialData?.visible ?? true,
    order_index: initialData?.order_index || 999,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit ? `/api/faqs/${initialData?.id}` : '/api/faqs'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({ title: 'Success', description: `FAQ ${isEdit ? 'updated' : 'created'} successfully` })
        router.push('/admin/faqs')
        router.refresh()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.error || 'Something went wrong', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save FAQ', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/faqs')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit FAQ' : 'Add FAQ'}</h1>
          <p className="text-gray-400">{isEdit ? 'Update FAQ details' : 'Add a new frequently asked question'}</p>
        </div>
      </div>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">FAQ Content</CardTitle>
          <CardDescription className="text-gray-400">The question and its answer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Question *</Label>
            <Input value={formData.question} onChange={(e) => handleChange('question', e.target.value)}
              required className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="e.g., Do you build for both iOS and Android?" />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Answer *</Label>
            <Textarea value={formData.answer} onChange={(e) => handleChange('answer', e.target.value)}
              required className="bg-[#030014] border-[#2A0E61] text-white min-h-[150px]"
              placeholder="Write the full answer here..." />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Category</Label>
            <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                <SelectItem value="general" className="text-white">General</SelectItem>
                <SelectItem value="payment" className="text-white">Payment</SelectItem>
                <SelectItem value="communication" className="text-white">Communication</SelectItem>
                <SelectItem value="support" className="text-white">Support</SelectItem>
                <SelectItem value="legal" className="text-white">Legal</SelectItem>
                <SelectItem value="technical" className="text-white">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Visibility Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Visibility</Label>
              <Select value={formData.visible.toString()}
                onValueChange={(v) => handleChange('visible', v === 'true')}>
                <SelectTrigger className="bg-[#030014] border-[#2A0E61] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-[#2A0E61]">
                  <SelectItem value="true" className="text-white">Visible</SelectItem>
                  <SelectItem value="false" className="text-white">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Order Index</Label>
              <Input type="number" value={formData.order_index}
                onChange={(e) => handleChange('order_index', parseInt(e.target.value))}
                className="bg-[#030014] border-[#2A0E61] text-white" />
              <p className="text-xs text-gray-400">Lower = appears first</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/faqs')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">Cancel</Button>
        <Button type="submit" disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
        </Button>
      </div>
    </form>
  )
}
