import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Zap, Server, AlertTriangle, Clock } from 'lucide-react'

const automationData = [82, 88, 91, 85, 94, 97, 89, 95, 98, 93, 96, 99]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const failureLogs = [
  { id: '#F-1042', type: 'API Timeout', service: 'Supabase RPC', time: '2h ago', severity: 'warn' },
  { id: '#F-1041', type: 'Build Warning', service: 'Vercel CI', time: '5h ago', severity: 'info' },
  { id: '#F-1040', type: 'Email Bounce', service: 'Lead Capture', time: '1d ago', severity: 'warn' },
  { id: '#F-1039', type: 'Image 404', service: 'Next.js Image', time: '2d ago', severity: 'info' },
]

const services = [
  { name: 'Vercel (Production)', status: 'Operational', uptime: '99.98%', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { name: 'Supabase DB', status: 'Operational', uptime: '99.95%', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { name: 'Supabase Auth', status: 'Operational', uptime: '99.99%', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { name: 'Calendly Webhook', status: 'Degraded', uptime: '97.2%', color: 'text-amber-400', dot: 'bg-amber-400' },
  { name: 'WhatsApp API', status: 'Operational', uptime: '100%', color: 'text-emerald-400', dot: 'bg-emerald-400' },
]

function LineChart({ data, color = '#3B82F6' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  const w = 300, h = 80
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 8)}`).join(' ')
  const id = `lg-ops-${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${id})`} points={`0,${h} ${pts} ${w},${h}`} />
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

export default async function OperationsDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [leadsRes, caseRes] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('case_studies').select('id', { count: 'exact', head: true }).eq('visible', true),
  ])

  const metrics = [
    { label: 'Automation Success', value: '99.2%', change: '+0.4%', icon: CheckCircle, color: 'text-blue-400' },
    { label: 'Failures This Month', value: '4', change: '-8 vs last', icon: XCircle, color: 'text-blue-400' },
    { label: 'Active Automations', value: '12', change: `${caseRes.count || 0} monitored`, icon: Zap, color: 'text-blue-400' },
    { label: 'Avg. Response Time', value: '142ms', change: 'p95: 380ms', icon: Clock, color: 'text-blue-400' },
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
            <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
            <p className="text-sm text-gray-400">Automation health, failures, and system performance</p>
          </div>
          <span className="ml-auto text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-medium">Live</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">{m.label}</span>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="text-2xl font-bold text-white">{m.value}</div>
                <div className="text-xs text-blue-400 mt-1">{m.change}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Automation success chart */}
          <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Automation Success Rate</h3>
                <p className="text-xs text-gray-400">Monthly success % — 2025</p>
              </div>
              <span className="text-sm font-bold text-blue-400">99.2% avg</span>
            </div>
            <LineChart data={automationData} color="#3B82F6" />
            <div className="flex justify-between mt-2">
              {months.map(m => <span key={m} className="text-[10px] text-gray-600">{m}</span>)}
            </div>
          </div>

          {/* System Load */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white">System Load</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'CPU Usage', pct: 24, color: 'bg-blue-500' },
                { label: 'Memory', pct: 41, color: 'bg-cyan-500' },
                { label: 'DB Connections', pct: 18, color: 'bg-blue-400' },
                { label: 'Bandwidth', pct: 62, color: 'bg-indigo-500' },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="text-white font-medium">{r.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#030014] rounded-full">
                    <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 text-center">
              All systems nominal
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Failure Logs */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white">Failure Logs</h3>
              <span className="ml-auto text-xs text-gray-500">Last 7 days</span>
            </div>
            <div className="space-y-2">
              {failureLogs.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 bg-[#030014] rounded-lg">
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${f.severity === 'warn' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {f.severity.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{f.type}</p>
                    <p className="text-xs text-gray-500">{f.service}</p>
                  </div>
                  <span className="text-xs text-gray-600">{f.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Status */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Service Status</h3>
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${s.dot} animate-pulse`} />
                    <span className="text-sm text-gray-300">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{s.uptime}</span>
                    <span className={`text-xs font-medium ${s.color}`}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
