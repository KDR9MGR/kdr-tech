import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/button'
import { Plus, Edit, TrendingUp } from 'lucide-react'

const stageColor: Record<string, string> = {
  contacted: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
  discovery: 'bg-purple-900/30 text-purple-400 border-purple-500/30',
  proposal: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
  negotiation: 'bg-orange-900/30 text-orange-400 border-orange-500/30',
  closed_won: 'bg-green-900/30 text-green-400 border-green-500/30',
  closed_lost: 'bg-red-900/30 text-red-400 border-red-500/30',
}

const stageLabel: Record<string, string> = {
  contacted: '📞 Contacted',
  discovery: '🔍 Discovery',
  proposal: '📄 Proposal',
  negotiation: '🤝 Negotiation',
  closed_won: '✅ Won',
  closed_lost: '❌ Lost',
}

export default async function DealsAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: deals } = await supabase
    .from('pipeline_deals')
    .select('*')
    .order('created_at', { ascending: false })

  const list = deals || []
  const totalValue = list.reduce((s, d) => s + (d.deal_value || 0), 0)
  const wonValue = list.filter(d => d.stage === 'closed_won').reduce((s, d) => s + (d.deal_value || 0), 0)
  const activeDeals = list.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Sales Pipeline</h1>
            <p className="text-gray-400 mt-1">Track deals from first contact to close</p>
          </div>
          <Link href="/admin/deals/new">
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />Add Deal
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Pipeline', value: `$${totalValue.toLocaleString()}` },
            { label: 'Revenue Won', value: `$${wonValue.toLocaleString()}` },
            { label: 'Active Deals', value: activeDeals },
          ].map(s => (
            <div key={s.label} className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No deals yet</h3>
            <p className="text-gray-400 mb-6">Add your first deal to start tracking your pipeline.</p>
            <Link href="/admin/deals/new">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
                <Plus className="w-4 h-4 mr-2" />Add Deal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A0E61]">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Client</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden md:table-cell">Type</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Value</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Package</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Stage</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d: any) => (
                  <tr key={d.id} className="border-b border-[#2A0E61] last:border-0 hover:bg-[#030014]/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{d.client_name}</div>
                      {d.company && <div className="text-sm text-gray-400">{d.company}</div>}
                      {d.email && <div className="text-xs text-gray-500">{d.email}</div>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-300 text-sm">
                      {d.project_type === 'mobile_app' ? '📱 App' : '🌐 Website'}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-white font-semibold">
                      ${(d.deal_value || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-300 text-sm">{d.package_name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${stageColor[d.stage] || stageColor.contacted}`}>
                        {stageLabel[d.stage] || d.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/deals/${d.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#030014]">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
