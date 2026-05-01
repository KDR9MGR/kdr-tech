'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { ArrowLeft, Users, UserPlus, MousePointerClick, TrendingUp, Bell } from 'lucide-react'

const revenueData = [42, 58, 51, 67, 73, 61, 88, 94, 79, 103, 97, 118]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const topPages = [
  { page: '/services', views: 4820, change: +12 },
  { page: '/', views: 3910, change: +8 },
  { page: '/contact', views: 2640, change: +22 },
  { page: '/about', views: 1980, change: -3 },
  { page: '/blog', views: 1450, change: +17 },
]

const activity = [
  { user: 'James W.', action: 'Booked a strategy call', time: '2m ago', color: 'bg-emerald-500' },
  { user: 'Sophie C.', action: 'Submitted lead form', time: '14m ago', color: 'bg-blue-500' },
  { user: 'Liam O.', action: 'Viewed pricing page', time: '31m ago', color: 'bg-purple-500' },
  { user: 'Rachel T.', action: 'Opened welcome email', time: '1h ago', color: 'bg-amber-500' },
  { user: 'Marcus W.', action: 'Booked a strategy call', time: '2h ago', color: 'bg-emerald-500' },
]

const reminders = [
  { text: 'Follow up with 3 pending leads', due: 'Today' },
  { text: 'Publish new blog post', due: 'Tomorrow' },
  { text: 'Review Calendly conversion rate', due: 'This week' },
]

function LineChart({ data, color = '#10B981' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  const w = 300, h = 80
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 8)}`).join(' ')
  const id = `lg-${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${id})`} points={`0,${h} ${pts} ${w},${h}`} />
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

export default function MarketingDashboard() {
  const [leads, setLeads] = useState(0)

  useEffect(() => {
    fetch('/api/leads').then(r => r.json()).then(d => setLeads(Array.isArray(d) ? d.length : 0)).catch(() => {})
  }, [])

  const metrics = [
    { label: 'Total Users', value: '8,420', change: '+12%', icon: Users, color: 'text-emerald-400' },
    { label: 'Signups / Leads', value: leads || '94', change: '+18%', icon: UserPlus, color: 'text-emerald-400' },
    { label: 'CTR', value: '4.7%', change: '+0.3%', icon: MousePointerClick, color: 'text-emerald-400' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.8%', icon: TrendingUp, color: 'text-emerald-400' },
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
            <h1 className="text-2xl font-bold text-white">Marketing Dashboard</h1>
            <p className="text-sm text-gray-400">Growth, acquisition, and engagement metrics</p>
          </div>
          <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">Live</span>
        </div>

        {/* Metric cards */}
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
                <div className="text-xs text-emerald-400 mt-1">{m.change} vs last month</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue line chart */}
          <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Revenue Trend</h3>
                <p className="text-xs text-gray-400">Monthly revenue ($K) — 2025</p>
              </div>
              <span className="text-sm font-bold text-emerald-400">$118K peak</span>
            </div>
            <LineChart data={revenueData} color="#10B981" />
            <div className="flex justify-between mt-2">
              {months.map(m => <span key={m} className="text-[10px] text-gray-600">{m}</span>)}
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white">Reminders</h3>
            </div>
            <div className="space-y-3">
              {reminders.map((r) => (
                <div key={r.text} className="flex items-start gap-3 p-3 bg-[#030014] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white">{r.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Top Pages</h3>
            <div className="space-y-3">
              {topPages.map((p) => (
                <div key={p.page} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 font-mono">{p.page}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-[#030014] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(p.views / 4820) * 100}%` }} />
                    </div>
                    <span className="text-sm text-white w-12 text-right">{p.views.toLocaleString()}</span>
                    <span className={`text-xs w-10 text-right font-medium ${p.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {p.change > 0 ? '+' : ''}{p.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team activity feed */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Activity Feed</h3>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                    {a.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate"><span className="font-medium">{a.user}</span> {a.action}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
