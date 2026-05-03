import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, DollarSign, TrendingUp, PiggyBank, Banknote } from 'lucide-react'

function BarChart({ data }: { data: { label: string; v: number }[] }) {
  const max = Math.max(...data.map(d => d.v), 1)
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-gradient-to-t from-amber-600 to-amber-400 transition-all"
            style={{ height: `${(d.v / max) * 100}px` }}
          />
          <span className="text-[9px] text-gray-600 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function GaugeChart({ pct, color }: { pct: number; color: string }) {
  const r = 40
  const circ = Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg viewBox="0 0 100 60" className="w-32 h-20">
      <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#2A0E61" strokeWidth="8" strokeLinecap="round" />
      <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} />
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{pct}%</text>
    </svg>
  )
}

export default async function FinancialDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  const list = projects || []
  const totalRevenue = list.reduce((s, p) => s + (p.revenue || 0), 0)
  const totalPaid = list.reduce((s, p) => s + (p.paid_amount || 0), 0)
  const outstanding = totalRevenue - totalPaid
  const avgDeal = list.length > 0 ? Math.round(totalRevenue / list.length) : 0
  const collectionRate = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0

  // Build per-project bar data (up to 12 most recent)
  const barData = list.slice(0, 12).map(p => ({
    label: (p.title || 'Project').slice(0, 6),
    v: p.revenue || 0,
  })).reverse()

  const metrics = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: `${list.length} projects`, icon: DollarSign },
    { label: 'Collected', value: `$${totalPaid.toLocaleString()}`, change: `${collectionRate}% collected`, icon: TrendingUp },
    { label: 'Outstanding', value: `$${outstanding.toLocaleString()}`, change: 'Awaiting payment', icon: Banknote },
    { label: 'Avg. Deal Value', value: `$${avgDeal.toLocaleString()}`, change: 'Per project', icon: PiggyBank },
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
            <h1 className="text-2xl font-bold text-white">Financial Dashboard</h1>
            <p className="text-sm text-gray-400">Revenue, collections, and project financials</p>
          </div>
          <Link href="/admin/projects" className="ml-auto text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-medium hover:bg-amber-500/20 transition-colors">
            Manage Projects →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">{m.label}</span>
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{m.value}</div>
                <div className="text-xs text-amber-400 mt-1">{m.change}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Revenue by Project</h3>
                <p className="text-xs text-gray-400">Most recent {barData.length} projects</p>
              </div>
              <span className="text-sm font-bold text-amber-400">${totalRevenue.toLocaleString()} total</span>
            </div>
            {barData.length > 0 ? (
              <BarChart data={barData} />
            ) : (
              <div className="h-28 flex items-center justify-center text-gray-500 text-sm">
                No projects yet — <Link href="/admin/projects/new" className="text-amber-400 ml-1 hover:underline">add one</Link>
              </div>
            )}
          </div>

          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5 flex flex-col items-center justify-center gap-2">
            <PiggyBank className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">Collection Rate</h3>
            <GaugeChart pct={collectionRate} color="#F59E0B" />
            <p className="text-xs text-gray-400 text-center">{collectionRate}% of invoiced revenue collected</p>
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-white">${totalPaid.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500">Paid</div>
              </div>
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-amber-400">${outstanding.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500">Outstanding</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Projects Overview</h3>
            <Link href="/admin/projects/new" className="text-xs text-amber-400 hover:underline">+ Add Project</Link>
          </div>
          {list.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No projects yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-[#2A0E61]">
                    <th className="pb-3 text-left font-medium">Project</th>
                    <th className="pb-3 text-left font-medium hidden md:table-cell">Client</th>
                    <th className="pb-3 text-right font-medium">Revenue</th>
                    <th className="pb-3 text-right font-medium">Paid</th>
                    <th className="pb-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A0E61]">
                  {list.slice(0, 10).map((p: any) => (
                    <tr key={p.id}>
                      <td className="py-3 text-white font-medium">{p.flag_emoji} {p.title}</td>
                      <td className="py-3 text-gray-400 hidden md:table-cell">{p.client_name}</td>
                      <td className="py-3 text-right text-white font-semibold">${(p.revenue || 0).toLocaleString()}</td>
                      <td className={`py-3 text-right font-medium ${p.paid_amount >= p.revenue ? 'text-emerald-400' : 'text-amber-400'}`}>
                        ${(p.paid_amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-xs capitalize ${p.status === 'completed' ? 'text-emerald-400' : p.status === 'active' ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
