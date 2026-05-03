import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/button'
import { Plus, Edit, FolderKanban } from 'lucide-react'

const statusColor: Record<string, string> = {
  active: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
  completed: 'bg-green-900/30 text-green-400 border-green-500/30',
  on_hold: 'bg-orange-900/30 text-orange-400 border-orange-500/30',
  cancelled: 'bg-red-900/30 text-red-400 border-red-500/30',
}

export default async function ProjectsAdminPage() {
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

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 mt-1">Track client projects, revenue, and delivery status</p>
          </div>
          <Link href="/admin/projects/new">
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />Add Project
            </Button>
          </Link>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Projects', value: list.length },
            { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
            { label: 'Total Collected', value: `$${totalPaid.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-12 text-center">
            <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-gray-400 mb-6">Add your first client project to start tracking revenue.</p>
            <Link href="/admin/projects/new">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
                <Plus className="w-4 h-4 mr-2" />Add First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A0E61]">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Project</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden md:table-cell">Type</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Revenue</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Paid</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p: any) => (
                  <tr key={p.id} className="border-b border-[#2A0E61] last:border-0 hover:bg-[#030014]/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{p.flag_emoji} {p.title}</div>
                      <div className="text-sm text-gray-400">{p.client_name} · {p.country}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-300 text-sm">
                      {p.project_type === 'mobile_app' ? '📱 App' : '🌐 Website'}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-white font-semibold">
                      ${(p.revenue || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`text-sm font-medium ${p.paid_amount >= p.revenue ? 'text-emerald-400' : 'text-amber-400'}`}>
                        ${(p.paid_amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColor[p.status] || statusColor.active}`}>
                        {p.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/projects/${p.id}/edit`}>
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
