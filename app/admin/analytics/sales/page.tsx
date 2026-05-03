import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, DollarSign, TrendingUp, Users, CheckCircle2 } from 'lucide-react'

const stageOrder = ['contacted', 'discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
const stageLabel: Record<string, string> = {
  contacted: '📞 Contacted',
  discovery: '🔍 Discovery',
  proposal: '📄 Proposal',
  negotiation: '🤝 Negotiation',
  closed_won: '✅ Closed Won',
  closed_lost: '❌ Closed Lost',
}
const stageColor: Record<string, string> = {
  contacted: 'bg-blue-400',
  discovery: 'bg-purple-400',
  proposal: 'bg-yellow-400',
  negotiation: 'bg-orange-400',
  closed_won: 'bg-emerald-500',
  closed_lost: 'bg-red-500',
}

export default async function SalesDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ data: deals }, { data: leads }] = await Promise.all([
    supabase.from('pipeline_deals').select('*').order('created_at', { ascending: false }),
    supabase.from('leads').select('name, budget_range, project_type, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const dealList = deals || []
  const leadList = leads || []

  const totalPipeline = dealList.reduce((s, d) => s + (d.deal_value || 0), 0)
  const wonValue = dealList.filter(d => d.stage === 'closed_won').reduce((s, d) => s + (d.deal_value || 0), 0)
  const activeDeals = dealList.filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
  const wonDeals = dealList.filter(d => d.stage === 'closed_won')
  const convRate = dealList.length > 0 ? Math.round((wonDeals.length / dealList.length) * 100) : 0
  const avgDeal = dealList.length > 0 ? Math.round(totalPipeline / dealList.length) : 0

  // Group by stage
  const byStage = stageOrder.map(stage => {
    const items = dealList.filter(d => d.stage === stage)
    return {
      stage,
      count: items.length,
      value: items.reduce((s, d) => s + (d.deal_value || 0), 0),
    }
  })
  const maxCount = Math.max(...byStage.map(s => s.count), 1)

  const metrics = [
    { label: 'Total Pipeline', value: `$${totalPipeline.toLocaleString()}`, change: `${dealList.length} deals`, icon: DollarSign },
    { label: 'Revenue Won', value: `$${wonValue.toLocaleString()}`, change: `${wonDeals.length} closed`, icon: CheckCircle2 },
    { label: 'Active Deals', value: activeDeals.length, change: 'In pipeline', icon: TrendingUp },
    { label: 'Conversion Rate', value: `${convRate}%`, change: `Avg $${avgDeal.toLocaleString()} / deal`, icon: Users },
  ]

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin/analytics" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Sales Dashboard</h1>
            <p className="text-sm text-gray-400">Pipeline, deal stages, and performance</p>
          </div>
          <Link href="/admin/deals" className="ml-auto text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full font-medium hover:bg-orange-500/20 transition-colors">
            Manage Deals →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">{m.label}</span>
                  <Icon className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white">{m.value}</div>
                <div className="text-xs text-orange-400 mt-1">{m.change}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deal pipeline by stage */}
          <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Pipeline Stages</h3>
                <p className="text-xs text-gray-400">Deals count and value by stage</p>
              </div>
              <Link href="/admin/deals/new" className="text-xs text-orange-400 hover:underline">+ Add Deal</Link>
            </div>
            <div className="space-y-3">
              {byStage.map(s => (
                <div key={s.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{stageLabel[s.stage]}</span>
                    <span className="text-white font-medium">{s.count} deal{s.count !== 1 ? 's' : ''} · ${s.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-[#030014] rounded-full">
                    <div
                      className={`h-full ${stageColor[s.stage]} rounded-full transition-all`}
                      style={{ width: `${(s.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By project type */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">By Project Type</h3>
            {['mobile_app', 'website'].map(type => {
              const items = dealList.filter(d => d.project_type === type)
              const val = items.reduce((s, d) => s + (d.deal_value || 0), 0)
              const pct = dealList.length > 0 ? Math.round((items.length / dealList.length) * 100) : 0
              return (
                <div key={type} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{type === 'mobile_app' ? '📱 Mobile Apps' : '🌐 Websites'}</span>
                    <span className="text-white font-semibold">${val.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-[#030014] rounded-full">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{items.length} deals · {pct}% of pipeline</div>
                </div>
              )
            })}
            <div className="mt-4 pt-4 border-t border-[#2A0E61] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Won this period</span>
                <span className="text-emerald-400 font-semibold">${wonValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Win rate</span>
                <span className="text-white font-semibold">{convRate}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active deals list */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Active Deals</h3>
            {activeDeals.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                No active deals — <Link href="/admin/deals/new" className="text-orange-400 hover:underline">add one</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {activeDeals.slice(0, 6).map((d: any) => (
                  <div key={d.id} className="flex items-center gap-3 p-3 bg-[#030014] rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{d.client_name}</p>
                      <p className="text-xs text-gray-500">{stageLabel[d.stage]} · {d.project_type === 'mobile_app' ? '📱' : '🌐'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-white">${(d.deal_value || 0).toLocaleString()}</p>
                      <Link href={`/admin/deals/${d.id}/edit`} className="text-xs text-orange-400 hover:underline">Edit</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent leads */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Recent Leads</h3>
            {leadList.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No leads yet — they&apos;ll appear here from the contact form.</p>
            ) : (
              <div className="space-y-3">
                {leadList.map((l: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#030014] rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {l.name?.[0] ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{l.name}</p>
                      <p className="text-xs text-gray-500 truncate">{l.project_type || 'Not specified'} · {l.budget_range || 'No budget'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
