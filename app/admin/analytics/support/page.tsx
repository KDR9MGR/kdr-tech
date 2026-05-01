import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Ticket, Clock, CheckCircle2, Star } from 'lucide-react'

const volumeData = [8, 12, 7, 15, 11, 9, 14, 10, 18, 13, 16, 12]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const newTickets = [
  { id: '#T-209', subject: 'App not loading on iOS 17', client: 'James W.', sla: '8h left' },
  { id: '#T-208', subject: 'Payment gateway error on checkout', client: 'Rachel T.', sla: '4h left' },
  { id: '#T-207', subject: 'Add team member to admin', client: 'New Lead', sla: '12h left' },
]

const inProgress = [
  { id: '#T-206', subject: 'Push notification delay on Android', client: 'Liam O.', assigned: 'Arbaz K.' },
  { id: '#T-205', subject: 'CMS image upload 500 error', client: 'Sophie C.', assigned: 'Abdul R.' },
]

const resolved = [
  { id: '#T-204', subject: 'App Store review feedback', client: 'Marcus W.', resolved: '2h ago', rating: 5 },
  { id: '#T-203', subject: 'Stripe webhook config', client: 'Priya N.', resolved: '1d ago', rating: 5 },
  { id: '#T-202', subject: 'Figma file access', client: 'James W.', resolved: '2d ago', rating: 4 },
]

const tags = ['App Crash', 'Payment Issue', 'Auth Bug', 'Performance', 'CMS Error', 'Submission Delay', 'UI Bug']

function LineChart({ data, color = '#8B5CF6' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  const w = 300, h = 80
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 8)}`).join(' ')
  const id = `lg-sup-${color.replace('#', '')}`
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

export default async function SupportDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const metrics = [
    { label: 'New Tickets', value: newTickets.length, change: 'Needs attention', icon: Ticket, color: 'text-purple-400' },
    { label: 'In Progress', value: inProgress.length, change: '2 assigned', icon: Clock, color: 'text-purple-400' },
    { label: 'Resolved (30d)', value: 34, change: '+12 vs last', icon: CheckCircle2, color: 'text-purple-400' },
    { label: 'CSAT Score', value: '4.9 / 5', change: 'Based on 28 ratings', icon: Star, color: 'text-purple-400' },
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
          <span className="ml-auto text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full font-medium">Live</span>
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
                <div className="text-xs text-purple-400 mt-1">{m.change}</div>
              </div>
            )
          })}
        </div>

        {/* Ticket columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* New */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="font-bold text-white text-sm">New ({newTickets.length})</h3>
              <span className="ml-auto text-xs text-red-400">Urgent</span>
            </div>
            <div className="space-y-3">
              {newTickets.map((t) => (
                <div key={t.id} className="p-3 bg-[#030014] border border-red-500/10 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-mono">{t.id}</span>
                    <span className="text-xs text-red-400">{t.sla}</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">{t.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.client}</p>
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
              {inProgress.map((t) => (
                <div key={t.id} className="p-3 bg-[#030014] border border-amber-500/10 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-mono">{t.id}</span>
                    <span className="text-xs text-amber-400">→ {t.assigned}</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">{t.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.client}</p>
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
              {resolved.map((t) => (
                <div key={t.id} className="p-3 bg-[#030014] border border-emerald-500/10 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-mono">{t.id}</span>
                    <span className="text-xs text-gray-500">{t.resolved}</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">{t.subject}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Volume trend */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Support Volume</h3>
                <p className="text-xs text-gray-400">Tickets per month — 2025</p>
              </div>
              <span className="text-sm font-bold text-purple-400">135 total</span>
            </div>
            <LineChart data={volumeData} color="#8B5CF6" />
            <div className="flex justify-between mt-2">
              {months.map(m => <span key={m} className="text-[10px] text-gray-600">{m}</span>)}
            </div>
          </div>

          {/* Recurring issue tags */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Recurring Issue Tags</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300 font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. first response time</span>
                <span className="text-white font-semibold">1h 24m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. resolution time</span>
                <span className="text-white font-semibold">6h 12m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">SLA breach rate</span>
                <span className="text-emerald-400 font-semibold">0.8%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
