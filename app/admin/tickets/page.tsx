import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/button'
import { Plus, Edit, TicketCheck } from 'lucide-react'

const statusColor: Record<string, string> = {
  new: 'bg-red-900/30 text-red-400 border-red-500/30',
  in_progress: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
  resolved: 'bg-green-900/30 text-green-400 border-green-500/30',
  closed: 'bg-gray-800/30 text-gray-400 border-gray-500/30',
}

const priorityColor: Record<string, string> = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
}

export default async function TicketsAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false })

  const list = tickets || []
  const open = list.filter(t => t.status === 'new' || t.status === 'in_progress').length
  const resolved = list.filter(t => t.status === 'resolved' || t.status === 'closed').length
  const avgRating = list.filter(t => t.rating).length > 0
    ? (list.reduce((s, t) => s + (t.rating || 0), 0) / list.filter(t => t.rating).length).toFixed(1)
    : 'N/A'

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
            <p className="text-gray-400 mt-1">Track client support requests and response times</p>
          </div>
          <Link href="/admin/tickets/new">
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />New Ticket
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Tickets', value: list.length },
            { label: 'Open', value: open },
            { label: 'Avg Rating', value: avgRating },
          ].map(s => (
            <div key={s.label} className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-12 text-center">
            <TicketCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tickets yet</h3>
            <p className="text-gray-400 mb-6">Log your first support ticket to start tracking.</p>
            <Link href="/admin/tickets/new">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
                <Plus className="w-4 h-4 mr-2" />New Ticket
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A0E61]">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Subject</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden md:table-cell">Client</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Priority</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">SLA</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((t: any) => (
                  <tr key={t.id} className="border-b border-[#2A0E61] last:border-0 hover:bg-[#030014]/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{t.subject}</div>
                      {t.assigned_to && <div className="text-sm text-gray-400">→ {t.assigned_to}</div>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-300 text-sm">{t.client_name}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`text-sm font-medium capitalize ${priorityColor[t.priority] || 'text-gray-400'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-300 text-sm">{t.sla_hours}h</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColor[t.status] || statusColor.new}`}>
                        {t.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/tickets/${t.id}/edit`}>
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
