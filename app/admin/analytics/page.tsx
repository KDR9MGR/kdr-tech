import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import {
  TrendingUp, DollarSign, Settings, Headphones, ShoppingBag, BarChart2, ArrowRight
} from 'lucide-react'

const dashboards = [
  {
    href: '/admin/analytics/marketing',
    icon: TrendingUp,
    label: 'Marketing Dashboard',
    description: 'Signups, CTR, conversion rate, top pages, and team activity.',
    accent: 'from-emerald-500 to-green-600',
    border: 'hover:border-emerald-500/40',
    tag: 'Growth & Acquisition',
  },
  {
    href: '/admin/analytics/financial',
    icon: DollarSign,
    label: 'Financial Dashboard',
    description: 'Revenue, orders, profit margin, cash flow, and recent transactions.',
    accent: 'from-amber-500 to-yellow-600',
    border: 'hover:border-amber-500/40',
    tag: 'Revenue & Forecasting',
  },
  {
    href: '/admin/analytics/operations',
    icon: Settings,
    label: 'Operations Dashboard',
    description: 'Automation success rate, failures, system load, and health monitors.',
    accent: 'from-blue-500 to-cyan-600',
    border: 'hover:border-blue-500/40',
    tag: 'System Health',
  },
  {
    href: '/admin/analytics/support',
    icon: Headphones,
    label: 'Support Dashboard',
    description: 'Ticket queues, SLAs, response times, and recurring issue tags.',
    accent: 'from-purple-500 to-violet-600',
    border: 'hover:border-purple-500/40',
    tag: 'Tickets & Retention',
  },
  {
    href: '/admin/analytics/sales',
    icon: ShoppingBag,
    label: 'Sales Dashboard',
    description: 'Deal pipeline, daily revenue, product performance, and deal stages.',
    accent: 'from-orange-500 to-red-500',
    border: 'hover:border-orange-500/40',
    tag: 'Pipeline & Deals',
  },
  {
    href: '/admin/analytics/executive',
    icon: BarChart2,
    label: 'Executive Dashboard',
    description: 'Top-level KPIs, growth metrics, expense vs revenue, strategic insights.',
    accent: 'from-slate-400 to-slate-600',
    border: 'hover:border-slate-500/40',
    tag: 'CXO Overview',
  },
]

export default async function AnalyticsOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Select a dashboard to explore your business metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dashboards.map((d) => {
            const Icon = d.icon
            return (
              <Link
                key={d.href}
                href={d.href}
                className={`group relative flex flex-col gap-4 p-6 bg-[#1A1A2E] border border-[#2A0E61] rounded-2xl transition-all duration-200 ${d.border}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${d.accent} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="inline-block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{d.tag}</span>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{d.label}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{d.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 group-hover:text-white transition-colors mt-auto">
                  Open Dashboard <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
