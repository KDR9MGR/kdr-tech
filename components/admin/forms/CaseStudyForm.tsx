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
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

interface CaseStudyFormProps {
  initialData?: {
    id: string
    title: string
    client_type: string
    country: string
    flag_emoji: string
    package_name: string | null
    price_range: string | null
    timeline: string | null
    problem: string
    solution: string
    results: Array<{ icon: string; text: string }>
    tech_stack: string[]
    image_url: string | null
    placeholder_description: string | null
    visible: boolean
    order_index: number
  }
  isEdit?: boolean
}

export default function CaseStudyForm({ initialData, isEdit = false }: CaseStudyFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    client_type: initialData?.client_type || '',
    country: initialData?.country || '',
    flag_emoji: initialData?.flag_emoji || '',
    package_name: initialData?.package_name || '',
    price_range: initialData?.price_range || '',
    timeline: initialData?.timeline || '',
    problem: initialData?.problem || '',
    solution: initialData?.solution || '',
    image_url: initialData?.image_url || '',
    placeholder_description: initialData?.placeholder_description || '',
    visible: initialData?.visible ?? true,
    order_index: initialData?.order_index || 999,
  })

  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || [])
  const [newTech, setNewTech] = useState('')
  const [results, setResults] = useState<Array<{ icon: string; text: string }>>(
    initialData?.results || []
  )

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTech = () => {
    if (newTech.trim()) {
      setTechStack((prev) => [...prev, newTech.trim()])
      setNewTech('')
    }
  }

  const removeTech = (index: number) => {
    setTechStack((prev) => prev.filter((_, i) => i !== index))
  }

  const addResult = () => {
    setResults((prev) => [...prev, { icon: '✅', text: '' }])
  }

  const updateResult = (index: number, field: 'icon' | 'text', value: string) => {
    setResults((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)))
  }

  const removeResult = (index: number) => {
    setResults((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit ? `/api/case-studies/${initialData?.id}` : '/api/case-studies'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tech_stack: techStack, results }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Case study ${isEdit ? 'updated' : 'created'} successfully`,
        })
        router.push('/admin/case-studies')
        router.refresh()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.error || 'Something went wrong', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save case study', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/case-studies')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit Case Study' : 'Add Case Study'}</h1>
          <p className="text-gray-400">{isEdit ? 'Update case study details' : 'Add a new portfolio case study'}</p>
        </div>
      </div>

      {/* Project Info */}
      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Project Information</CardTitle>
          <CardDescription className="text-gray-400">Basic details about the project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Project Title *</Label>
              <Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)}
                required className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., FitTrack Pro" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Client Type *</Label>
              <Input value={formData.client_type} onChange={(e) => handleChange('client_type', e.target.value)}
                required className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., Fitness Startup" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Country *</Label>
              <Input value={formData.country} onChange={(e) => handleChange('country', e.target.value)}
                required className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., USA" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Flag Emoji</Label>
              <Input value={formData.flag_emoji} onChange={(e) => handleChange('flag_emoji', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., 🇺🇸" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Package Name</Label>
              <Input value={formData.package_name} onChange={(e) => handleChange('package_name', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., Growth MVP" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Price Range</Label>
              <Input value={formData.price_range} onChange={(e) => handleChange('price_range', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., $7,200" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Timeline</Label>
              <Input value={formData.timeline} onChange={(e) => handleChange('timeline', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., 11 Weeks" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem & Solution */}
      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Problem & Solution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">The Problem *</Label>
            <Textarea value={formData.problem} onChange={(e) => handleChange('problem', e.target.value)}
              required className="bg-[#030014] border-[#2A0E61] text-white min-h-[120px]"
              placeholder="Describe the client's challenge..." />
          </div>
          <div className="space-y-2">
            <Label className="text-white">The Solution *</Label>
            <Textarea value={formData.solution} onChange={(e) => handleChange('solution', e.target.value)}
              required className="bg-[#030014] border-[#2A0E61] text-white min-h-[120px]"
              placeholder="Describe what you built..." />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Results</CardTitle>
          <CardDescription className="text-gray-400">Add measurable outcomes (icon + text pairs)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input value={result.icon} onChange={(e) => updateResult(index, 'icon', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white w-16 text-center" placeholder="📱" />
              <Input value={result.text} onChange={(e) => updateResult(index, 'text', e.target.value)}
                className="bg-[#030014] border-[#2A0E61] text-white flex-1" placeholder="e.g., 2,100+ downloads in first 60 days" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeResult(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addResult}
            className="border-[#2A0E61] text-white hover:bg-[#030014]">
            <Plus className="w-4 h-4 mr-2" />Add Result
          </Button>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Tech Stack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {techStack.map((tech, index) => (
              <span key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/30 border border-blue-500/30 text-blue-300 rounded-full text-sm">
                {tech}
                <button type="button" onClick={() => removeTech(index)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newTech} onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
              className="bg-[#030014] border-[#2A0E61] text-white" placeholder="e.g., Flutter" />
            <Button type="button" variant="outline" onClick={addTech}
              className="border-[#2A0E61] text-white hover:bg-[#030014]">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Media & Visibility */}
      <Card className="bg-[#1A1A2E] border-[#2A0E61]">
        <CardHeader>
          <CardTitle className="text-white">Media & Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Image URL</Label>
            <Input value={formData.image_url} onChange={(e) => handleChange('image_url', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Image Description (placeholder)</Label>
            <Textarea value={formData.placeholder_description}
              onChange={(e) => handleChange('placeholder_description', e.target.value)}
              className="bg-[#030014] border-[#2A0E61] text-white"
              placeholder="Describe what screenshot/mockup to use here..." />
          </div>
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
        <Button type="button" variant="outline" onClick={() => router.push('/admin/case-studies')}
          className="border-[#2A0E61] text-white hover:bg-[#030014]">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : isEdit ? 'Update Case Study' : 'Create Case Study'}
        </Button>
      </div>
    </form>
  )
}
