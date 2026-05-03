import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Ticket, Clock, CheckCircle2, Star } from 'lucide-react'

export default async function SupportDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false })

  const list = tickets || []
  const newTickets = list.filter(t => t.status === 'new')
  const inProgress = list.filter(t => t.status === 'in_progress')
  const resolved = list.filter(t => t.status === 'resolved' || t.status === 'closed')
  const rated = list.filter(t => t.rating != null)
  const avgRating = rated.length > 0
    ? (rated.reduce((s, t) => s + (t.rating || 0), 0) / rated.length).toFixed(1)
    : 'N/A'

  const priorityColor: Record<string, string> = {
    low: 'text-gray-400',
    medium: 'text-blue-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  }

  const metrics = [
    { label: 'New Tickets', value: newTickets.length, change: 'Needs attention', icon: Ticket },
    { label: 'In Progress', value: inProgress.length, change: 'Being worked on', icon: Clock },
    { label: 'Resolved', value: resolved.length, change: 'Closed tickets', icon: CheckCircle2 },
    { label: 'CSAT Score', value: avgRating === 'N/A' ? 'N/A' : `${avgRating} / 5`, change: `${rated.length} ratings`, icon: Star },
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
            <h1 className="text-2xl font-bold text-white">Support Dashboard</h1>
            <p className="text-sm text-gray-400">Tickets, SLAs, satisfaction, and retention signals</p>
          </div>
          <Link href="/admin/tickets" className="ml-auto text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full font-medium hover:bg-purple-500/20 transition-colors">
            Manage Tickets →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">{m.label}</span>
                  <Icon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{m.value}</div>
                <div className="text-xs text-purple-400 mt-1">{m.change}</div>
              </div>
            )
          })}
        </div>

        {/* Ticket kanban */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* New */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="font-bold text-white text-sm">New ({newTickets.length})</h3>
              <Link href="/admin/tickets/new" className="ml-auto text-xs text-red-400 hover:underline">+ Add</Link>
            </div>
            <div className="space-y-3">
              {newTickets.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">No new tickets</p>
              ) : newTickets.map((t: any) => (
                <div key={t.id} className="p-3 bg-[#030014] border border-red-500/10 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium capitalize ${priorityColor[t.priority] || 'text-gray-400'}`}>{t.priority}</span>
                    <span className="text-xs text-gray-500">{t.sla_hours}h SLA</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">{t.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.client_name}</p>
                  <Link href={`/admin/tickets/${t.id}/edit`} className="text-xs text-purple-400 hover:underline mt-1 inline-block">Edit →</Link>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <h3 className="font-bold text-white text-sm">In Progress ({inProgress.length})</h3>
            </div>
            <div className="space-y-3">
              {inProgress.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">Nothing in progress</p>
              ) : inProgress.map((t: any) => (
                <div key={t.id} className="p-3 bg-[#030014] border border-amber-500/10 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium capitalize ${priorityColor[t.priority] || 'text-gray-400'}`}>{t.priority}</span>
                    {t.assigned_to && <span className="text-xs text-amber-400">→ {t.assigned_to}</span>}
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">{t.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.client_name}</p>
                  <Link href={`/admin/tickets/${t.id}/edit`} className="text-xs text-purple-400 hover:underline mt-1 inline-block">Edit →</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-white text-sm">Resolved ({resolved.length})</h3>
            </div>
            <div className="space-y-3">
              {resolved.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">No resolved tickets</p>
              ) : resolved.slice(0, 5).map((t: any) => (
                <div key={t.id} className="p-3 bg-[#030014] border border-emerald-500/10 rounded-lg">
                  <p className="text-sm text-white font-medium leading-snug">{t.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.client_name}</p>
                  {t.rating && (
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: t.rating }).map((_: any, i: number) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Ticket Breakdown by Priority</h3>
            {['urgent', 'high', 'medium', 'low'].map(pri => {
              const count = list.filter(t => t.priority === pri).length
              const pct = list.length > 0 ? Math.round((count / list.length) * 100) : 0
              return (
                <div key={pri} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`capitalize font-medium ${priorityColor[pri] || 'text-gray-400'}`}>{pri}</span>
                    <span className="text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#030014] rounded-full">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Tickets', value: list.length },
                { label: 'Open (New + In Progress)', value: newTickets.length + inProgress.length },
                { label: 'Resolution Rate', value: list.length > 0 ? `${Math.round((resolved.length / list.length) * 100)}%` : 'N/A' },
                { label: 'Avg. Client Rating', value: avgRating === 'N/A' ? 'N/A' : `${avgRating} / 5` },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{s.label}</span>
                  <span className="text-white font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#2A0E61]">
              <Link href="/admin/tickets/new" className="block text-center text-sm text-purple-400 hover:underline">
                + Log a new support ticket
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
