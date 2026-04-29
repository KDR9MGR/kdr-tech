import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Eye, EyeOff, Briefcase } from 'lucide-react'

async function getCaseStudies() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export default async function CaseStudiesAdminPage() {
  const caseStudies = await getCaseStudies()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Case Studies</h1>
          <p className="text-gray-400 mt-1">Manage portfolio case studies shown on the public site</p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />Add Case Study
          </Button>
        </Link>
      </div>

      {caseStudies.length === 0 ? (
        <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No case studies yet</h3>
          <p className="text-gray-400 mb-6">Add your first portfolio case study to display on the public site.</p>
          <Link href="/admin/case-studies/new">
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
              <Plus className="w-4 h-4 mr-2" />Add First Case Study
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A0E61]">
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Project</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium hidden md:table-cell">Client Type</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Country</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Price</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {caseStudies.map((cs: any) => (
                <tr key={cs.id} className="border-b border-[#2A0E61] last:border-0 hover:bg-[#030014]/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{cs.title}</div>
                    <div className="text-sm text-gray-400">{cs.timeline}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-300">{cs.client_type}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-300">
                    {cs.flag_emoji} {cs.country}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-300">{cs.price_range}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      cs.visible
                        ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-600'
                    }`}>
                      {cs.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {cs.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/case-studies/${cs.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#030014]">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
