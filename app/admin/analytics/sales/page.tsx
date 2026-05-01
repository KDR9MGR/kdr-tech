'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { ArrowLeft, DollarSign, RefreshCw, TrendingUp, Users } from 'lucide-react'

const salesTimeline = [
  { m: 'Jan', apps: 28, web: 14 }, { m: 'Feb', apps: 35, web: 21 },
  { m: 'Mar', apps: 31, web: 18 }, { m: 'Apr', apps: 42, web: 27 },
  { m: 'May', apps: 48, web: 31 }, { m: 'Jun', apps: 39, web: 24 },
  { m: 'Jul', apps: 56, web: 38 }, { m: 'Aug', apps: 61, web: 43 },
  { m: 'Sep', apps: 52, web: 36 }, { m: 'Oct', apps: 68, web: 47 },
  { m: 'Nov', apps: 63, web: 44 }, { m: 'Dec', apps: 74, web: 52 },
]

const pipeline = [
  { stage: 'Lead Contacted', count: 18, value: '$72K', color: 'bg-orange-400' },
  { stage: 'Discovery Call', count: 11, value: '$54K', color: 'bg-amber-400' },
  { stage: 'Proposal Sent', count: 7, value: '$41K', color: 'bg-yellow-400' },
  { stage: 'Negotiation', count: 4, value: '$28K', color: 'bg-emerald-400' },
  { stage: 'Closed Won', count: 2, value: '$14K', color: 'bg-green-500' },
]

const products = [
  { name: 'Growth MVP (App)', deals: 8, revenue: '$64K', share: 42 },
  { name: 'MVP Lite (App)', deals: 12, revenue: '$47K', share: 31 },
  { name: 'Dynamic + CMS (Web)', deals: 5, revenue: '$31K', share: 20 },
  { name: 'Static Website', deals: 6, revenue: '$7K', share: 7 },
]

function StackedBar({ apps, web, max }: { apps: number; web: number; max: number }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="w-full flex flex-col-reverse gap-0 rounded-t-sm overflow-hidden" style={{ height: `${((apps + web) / max) * 80}px` }}>
        <div className="w-full bg-orange-400" style={{ flex: apps }} />
        <div className="w-full bg-orange-200/30" style={{ flex: web }} />
      </div>
    </div>
  )
}

export default function SalesDashboard() {
  const [leads, setLeads] = useState<{ name: string; budget_range: string; project_type: string; created_at: string }[]>([])

  useEffect(() => {
    fetch('/api/leads').then(r => r.json()).then(d => setLeads(Array.isArray(d) ? d.slice(0, 5) : [])).catch(() => {})
  }, [])

  const maxBar = Math.max(...salesTimeline.map(d => d.apps + d.web))

  const metrics = [
    { label: 'Monthly Revenue', value: '$74K', change: '+18% vs last', icon: DollarSign },
    { label: 'New Deals', value: '14', change: '2 closing this week', icon: RefreshCw },
    { label: 'Conversion Rate', value: '11.1%', change: 'Leads → Closed', icon: TrendingUp },
    { label: 'Avg. Deal Value', value: '$5,300', change: '+$400 vs last', icon: Users },
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
            <p className="text-sm text-gray-400">Pipeline, deal stages, and product performance</p>
          </div>
          <span className="ml-auto text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full font-medium">Live</span>
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
          {/* Sales timeline chart */}
          <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Sales Timeline</h3>
                <p className="text-xs text-gray-400">Revenue ($K) by service — 2025</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-400 inline-block" /> Apps</span>
                <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-sm bg-orange-200/30 inline-block" /> Websites</span>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {salesTimeline.map((d) => (
                <StackedBar key={d.m} apps={d.apps} web={d.web} max={maxBar} />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {salesTimeline.map(d => <span key={d.m} className="text-[9px] text-gray-600 flex-1 text-center">{d.m}</span>)}
            </div>
          </div>

          {/* Deal pipeline */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Deal Pipeline</h3>
            <div className="space-y-3">
              {pipeline.map((p) => (
                <div key={p.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{p.stage}</span>
                    <span className="text-white font-medium">{p.count} · {p.value}</span>
                  </div>
                  <div className="w-full h-2 bg-[#030014] rounded-full">
                    <div className={`h-full ${p.color} rounded-full`} style={{ width: `${(p.count / 18) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product performance */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Product Performance</h3>
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{p.name}</span>
                    <span className="text-white font-semibold">{p.revenue}</span>
                  </div>
                  <div className="w-full h-2 bg-[#030014] rounded-full">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: `${p.share}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.deals} deals · {p.share}% of revenue</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent leads (real data) */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Recent Leads</h3>
            {leads.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No leads yet — they&apos;ll appear here.</p>
            ) : (
              <div className="space-y-3">
                {leads.map((l, i) => (
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
