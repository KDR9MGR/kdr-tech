import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Globe, Star } from 'lucide-react'

const insights = [
  { label: 'Track revenue by adding projects in the Projects CMS', trend: 'up' },
  { label: 'Log support tickets to measure CSAT and resolution time', trend: 'up' },
  { label: 'Add pipeline deals to track conversion and win rate', trend: 'up' },
  { label: 'All data below is live — use the CMS to keep it current', trend: 'up' },
]

function DualLineChart({ rev, exp }: { rev: number[]; exp: number[] }) {
  const max = Math.max(...rev, ...exp, 1)
  const w = 400, h = 90
  const revPts = rev.map((v, i) => `${(i / (rev.length - 1)) * w},${h - (v / max) * (h - 8)}`).join(' ')
  const expPts = exp.map((v, i) => `${(i / (exp.length - 1)) * w},${h - (v / max) * (h - 8)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id="exec-rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill="url(#exec-rev)" points={`0,${h} ${revPts} ${w},${h}`} />
      <polyline fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round" points={revPts} />
      <polyline fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" strokeLinejoin="round" points={expPts} />
    </svg>
  )
}

export default async function ExecutiveDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [teamRes, leadsRes, caseRes, testiRes, projectsRes, ticketsRes, dealsRes] = await Promise.all([
    supabase.from('team_members').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('case_studies').select('id', { count: 'exact', head: true }).eq('visible', true),
    supabase.from('testimonials_text').select('id', { count: 'exact', head: true }).eq('visible', true),
    supabase.from('projects').select('revenue, paid_amount, status'),
    supabase.from('support_tickets').select('status, rating'),
    supabase.from('pipeline_deals').select('stage, deal_value'),
  ])

  const projects = projectsRes.data || []
  const tickets = ticketsRes.data || []
  const deals = dealsRes.data || []

  const totalRevenue = projects.reduce((s, p) => s + (p.revenue || 0), 0)
  const totalPaid = projects.reduce((s, p) => s + (p.paid_amount || 0), 0)
  const activeProjects = projects.filter(p => p.status === 'active').length
  const wonDeals = deals.filter(d => d.stage === 'closed_won')
  const pipelineValue = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((s, d) => s + (d.deal_value || 0), 0)
  const ratedTickets = tickets.filter(t => t.rating != null)
  const avgRating = ratedTickets.length > 0
    ? (ratedTickets.reduce((s, t) => s + (t.rating || 0), 0) / ratedTickets.length).toFixed(1)
    : null
  const openTickets = tickets.filter(t => t.status === 'new' || t.status === 'in_progress').length

  // Build revenue data points from projects (ordered by paid_amount for visual)
  const revenuePoints = projects.length > 0
    ? projects.slice(0, 12).map(p => p.revenue || 0)
    : [0, 0, 0, 0, 0, 0]
  const paidPoints = projects.slice(0, 12).map(p => p.paid_amount || 0)
  const months = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12']

  const kpis = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: `$${totalPaid.toLocaleString()} collected`, icon: DollarSign, up: true },
    { label: 'Total Leads', value: String(leadsRes.count || 0), sub: 'From contact form', icon: Users, up: true },
    { label: 'Active Projects', value: String(activeProjects), sub: `${projects.length} total`, icon: Globe, up: true },
    { label: avgRating ? `CSAT ${avgRating}/5` : 'CSAT', value: avgRating ? `${avgRating} / 5` : 'No ratings', sub: `${ratedTickets.length} reviews`, icon: Star, up: true },
  ]

  const expenseBreakdown = [
    { label: 'Team Salaries', pct: 48, amount: 'Est. 48%' },
    { label: 'Tools & Infra', pct: 14, amount: 'Est. 14%' },
    { label: 'Marketing', pct: 22, amount: 'Est. 22%' },
    { label: 'Operations', pct: 16, amount: 'Est. 16%' },
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
            <h1 className="text-2xl font-bold text-white">Executive Dashboard</h1>
            <p className="text-sm text-gray-400">Top-level business performance — CXO view</p>
          </div>
          <span className="ml-auto text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1 rounded-full font-medium">Live Data</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon
            return (
              <div key={k.label} className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">{k.label}</span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-white">{k.value}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {k.sub}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Revenue vs Collected</h3>
                <p className="text-xs text-gray-400">Per project (most recent {revenuePoints.length})</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-slate-300"><span className="w-3 h-0.5 bg-slate-400 inline-block" /> Invoiced</span>
                <span className="flex items-center gap-1 text-slate-500"><span className="w-3 h-0.5 bg-slate-600 inline-block" /> Collected</span>
              </div>
            </div>
            {projects.length > 0 ? (
              <>
                <DualLineChart rev={revenuePoints} exp={paidPoints} />
                <div className="flex justify-between mt-2">
                  {months.slice(0, revenuePoints.length).map(m => <span key={m} className="text-[10px] text-gray-600">{m}</span>)}
                </div>
              </>
            ) : (
              <div className="h-24 flex items-center justify-center text-gray-500 text-sm">
                No projects yet — <Link href="/admin/projects/new" className="text-slate-400 ml-1 hover:underline">add one</Link>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-white">${totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500">Total Invoiced</div>
              </div>
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-white">${totalPaid.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500">Collected</div>
              </div>
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-emerald-400">${pipelineValue.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500">In Pipeline</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Expense Mix (Est.)</h3>
            <div className="space-y-4">
              {expenseBreakdown.map((e) => (
                <div key={e.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{e.label}</span>
                    <span className="text-white font-medium">{e.amount}</span>
                  </div>
                  <div className="w-full h-2 bg-[#030014] rounded-full">
                    <div className="h-full bg-slate-500 rounded-full" style={{ width: `${e.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Business Snapshot</h3>
            <div className="space-y-3">
              {[
                { label: 'Team Members', value: teamRes.count ?? 0, link: '/admin/team' },
                { label: 'Published Case Studies', value: caseRes.count ?? 0, link: '/admin/case-studies' },
                { label: 'Published Testimonials', value: testiRes.count ?? 0, link: '/admin/testimonials' },
                { label: 'Total Leads', value: leadsRes.count ?? 0, link: null },
                { label: 'Open Tickets', value: openTickets, link: '/admin/tickets' },
                { label: 'Deals Won (all time)', value: wonDeals.length, link: '/admin/deals' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 flex-1">{s.label}</span>
                  <span className="text-sm text-white font-semibold">{s.value}</span>
                  {s.link && (
                    <Link href={s.link} className="text-xs text-slate-400 hover:text-white">→</Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Action Items</h3>
            <div className="space-y-3">
              {insights.map((ins) => (
                <div key={ins.label} className={`flex items-start gap-3 p-3 rounded-lg ${ins.trend === 'up' ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-red-500/5 border border-red-500/10'}`}>
                  {ins.trend === 'up'
                    ? <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    : <TrendingDown className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                  <p className="text-sm text-gray-300">{ins.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Link href="/admin/projects" className="text-center p-3 bg-[#030014] rounded-lg hover:bg-purple-500/10 transition-colors">
                <div className="text-lg font-bold text-white">{projects.length}</div>
                <div className="text-[10px] text-gray-500">Projects</div>
              </Link>
              <Link href="/admin/tickets" className="text-center p-3 bg-[#030014] rounded-lg hover:bg-purple-500/10 transition-colors">
                <div className="text-lg font-bold text-white">{tickets.length}</div>
                <div className="text-[10px] text-gray-500">Tickets</div>
              </Link>
              <Link href="/admin/deals" className="text-center p-3 bg-[#030014] rounded-lg hover:bg-purple-500/10 transition-colors">
                <div className="text-lg font-bold text-white">{deals.length}</div>
                <div className="text-[10px] text-gray-500">Deals</div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
