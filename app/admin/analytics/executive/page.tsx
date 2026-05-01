import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Globe, Star } from 'lucide-react'

const revenueData = [42, 58, 51, 67, 73, 61, 88, 94, 79, 103, 97, 118]
const expenseData = [28, 31, 27, 35, 38, 33, 41, 44, 38, 48, 45, 52]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const insights = [
  { label: 'Dec was the highest revenue month YTD', trend: 'up' },
  { label: 'Gross margin holding above 65% for 6 months', trend: 'up' },
  { label: 'Website projects up 44% vs. Q3', trend: 'up' },
  { label: 'Calendly webhook degraded — check operations', trend: 'down' },
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

  const [teamRes, leadsRes, caseRes, testiRes] = await Promise.all([
    supabase.from('team_members').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('case_studies').select('id', { count: 'exact', head: true }).eq('visible', true),
    supabase.from('testimonials_text').select('id', { count: 'exact', head: true }).eq('visible', true),
  ])

  const kpis = [
    { label: 'Annual Revenue', value: '$831K', sub: '+24% YoY', icon: DollarSign, up: true },
    { label: 'Total Leads', value: String(leadsRes.count || '94'), sub: '+18% this month', icon: Users, up: true },
    { label: 'Projects Live', value: String(caseRes.count || '6'), sub: 'Case studies published', icon: Globe, up: true },
    { label: 'CSAT / NPS', value: '4.9 / 72', sub: `${testiRes.count || 0} reviews`, icon: Star, up: true },
  ]

  const expenseBreakdown = [
    { label: 'Team Salaries', pct: 48, amount: '$131K' },
    { label: 'Tools & Infra', pct: 14, amount: '$38K' },
    { label: 'Marketing', pct: 22, amount: '$60K' },
    { label: 'Operations', pct: 16, amount: '$44K' },
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
          <span className="ml-auto text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1 rounded-full font-medium">2025 YTD</span>
        </div>

        {/* KPI row */}
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

        {/* Revenue vs Expense + breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Revenue vs Expenses</h3>
                <p className="text-xs text-gray-400">Monthly ($K) — 2025</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-slate-300"><span className="w-3 h-0.5 bg-slate-400 inline-block" /> Revenue</span>
                <span className="flex items-center gap-1 text-slate-500"><span className="w-3 h-0.5 bg-slate-600 inline-block border-dashed border-b" /> Expenses</span>
              </div>
            </div>
            <DualLineChart rev={revenueData} exp={expenseData} />
            <div className="flex justify-between mt-2">
              {months.map(m => <span key={m} className="text-[10px] text-gray-600">{m}</span>)}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-white">$831K</div>
                <div className="text-[10px] text-gray-500">Total Revenue</div>
              </div>
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-white">$274K</div>
                <div className="text-[10px] text-gray-500">Total Expenses</div>
              </div>
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-emerald-400">$557K</div>
                <div className="text-[10px] text-gray-500">Net Profit</div>
              </div>
            </div>
          </div>

          {/* Expense breakdown */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Expense Breakdown</h3>
            <div className="space-y-4">
              {expenseBreakdown.map((e) => (
                <div key={e.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{e.label}</span>
                    <span className="text-white font-medium">{e.amount} ({e.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#030014] rounded-full">
                    <div className="h-full bg-slate-500 rounded-full" style={{ width: `${e.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth metrics */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Growth Metrics</h3>
            <div className="space-y-3">
              {[
                { label: 'Revenue Growth YoY', value: '+24%', bar: 70 },
                { label: 'Lead Volume Growth', value: '+18%', bar: 52 },
                { label: 'Client Retention', value: '94%', bar: 94 },
                { label: 'Gross Margin', value: '67%', bar: 67 },
                { label: 'Team Utilisation', value: '82%', bar: 82 },
              ].map((g) => (
                <div key={g.label} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-44 flex-shrink-0">{g.label}</span>
                  <div className="flex-1 h-2 bg-[#030014] rounded-full">
                    <div className="h-full bg-gradient-to-r from-slate-500 to-slate-300 rounded-full" style={{ width: `${g.bar}%` }} />
                  </div>
                  <span className="text-sm text-white font-semibold w-10 text-right">{g.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* High-impact insights */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">High-Impact Insights</h3>
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
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-[#030014] rounded-lg">
                <div className="text-lg font-bold text-white">{teamRes.count || 6}</div>
                <div className="text-[10px] text-gray-500">Team Members</div>
              </div>
              <div className="text-center p-3 bg-[#030014] rounded-lg">
                <div className="text-lg font-bold text-white">15+</div>
                <div className="text-[10px] text-gray-500">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
