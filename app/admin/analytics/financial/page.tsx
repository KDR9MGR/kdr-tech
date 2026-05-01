'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { ArrowLeft, DollarSign, ShoppingCart, TrendingUp, PiggyBank, Banknote } from 'lucide-react'

const barData = [
  { m: 'Jan', v: 42 }, { m: 'Feb', v: 58 }, { m: 'Mar', v: 51 },
  { m: 'Apr', v: 67 }, { m: 'May', v: 73 }, { m: 'Jun', v: 61 },
  { m: 'Jul', v: 88 }, { m: 'Aug', v: 94 }, { m: 'Sep', v: 79 },
  { m: 'Oct', v: 103 }, { m: 'Nov', v: 97 }, { m: 'Dec', v: 118 },
]

const recentOrders = [
  { client: 'James Whitfield', project: 'FitTrack Pro', amount: '$7,200', status: 'Paid', statusColor: 'text-emerald-400' },
  { client: 'Rachel Thompson', project: 'Gourmet Box Store', amount: '$6,100', status: 'Paid', statusColor: 'text-emerald-400' },
  { client: 'Marcus Webb', project: 'FieldOps SaaS', amount: '$7,800', status: 'Invoiced', statusColor: 'text-amber-400' },
  { client: 'Sophie Clarke', project: 'Sterling Law Site', amount: '$2,900', status: 'Paid', statusColor: 'text-emerald-400' },
  { client: 'New Lead', project: 'Mobile App MVP', amount: '$4,500', status: 'Pending', statusColor: 'text-gray-400' },
]

function BarChart({ data }: { data: { m: string; v: number }[] }) {
  const max = Math.max(...data.map(d => d.v), 1)
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((d) => (
        <div key={d.m} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-gradient-to-t from-amber-600 to-amber-400 transition-all"
            style={{ height: `${(d.v / max) * 100}px` }}
          />
          <span className="text-[9px] text-gray-600">{d.m}</span>
        </div>
      ))}
    </div>
  )
}

function GaugeChart({ pct, color }: { pct: number; color: string }) {
  const r = 40, cx = 50, cy = 50
  const circ = Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg viewBox="0 0 100 60" className="w-32 h-20">
      <path d={`M 10,50 A 40,40 0 0,1 90,50`} fill="none" stroke="#2A0E61" strokeWidth="8" strokeLinecap="round" />
      <path d={`M 10,50 A 40,40 0 0,1 90,50`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} />
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{pct}%</text>
    </svg>
  )
}

export default function FinancialDashboard() {
  const [leadCount, setLeadCount] = useState(0)
  useEffect(() => {
    fetch('/api/leads').then(r => r.json()).then(d => setLeadCount(Array.isArray(d) ? d.length : 0)).catch(() => {})
  }, [])

  const metrics = [
    { label: 'Total Revenue', value: '$831K', change: '+24%', icon: DollarSign },
    { label: 'Total Orders', value: leadCount || 47, change: '+11%', icon: ShoppingCart },
    { label: 'Avg. Project Value', value: '$4,800', change: '+8%', icon: TrendingUp },
    { label: 'Cash Flow', value: '+$124K', change: 'Positive', icon: Banknote },
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
            <p className="text-sm text-gray-400">Revenue, profit, cash flow, and forecasting</p>
          </div>
          <span className="ml-auto text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-medium">2025 YTD</span>
        </div>

        {/* Metrics */}
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
          {/* Bar chart */}
          <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Monthly Revenue</h3>
                <p className="text-xs text-gray-400">Revenue ($K) by month — 2025</p>
              </div>
              <span className="text-sm font-bold text-amber-400">$831K total</span>
            </div>
            <BarChart data={barData} />
          </div>

          {/* Profit margin gauge */}
          <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5 flex flex-col items-center justify-center gap-2">
            <PiggyBank className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">Profit Margin</h3>
            <GaugeChart pct={67} color="#F59E0B" />
            <p className="text-xs text-gray-400 text-center">67% gross margin — above industry avg.</p>
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-white">$557K</div>
                <div className="text-[10px] text-gray-500">Gross Profit</div>
              </div>
              <div className="text-center p-2 bg-[#030014] rounded-lg">
                <div className="text-sm font-bold text-white">$274K</div>
                <div className="text-[10px] text-gray-500">Expenses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-5">
          <h3 className="font-bold text-white mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-[#2A0E61]">
                  <th className="pb-3 text-left font-medium">Client</th>
                  <th className="pb-3 text-left font-medium">Project</th>
                  <th className="pb-3 text-right font-medium">Amount</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A0E61]">
                {recentOrders.map((o) => (
                  <tr key={o.client}>
                    <td className="py-3 text-white font-medium">{o.client}</td>
                    <td className="py-3 text-gray-400">{o.project}</td>
                    <td className="py-3 text-right text-white font-semibold">{o.amount}</td>
                    <td className={`py-3 text-right font-medium ${o.statusColor}`}>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
