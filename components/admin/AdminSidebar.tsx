'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, FileText, MessageSquare, LogOut, AppWindow } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/team', icon: Users, label: 'Team' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { href: '/admin/showcase', icon: AppWindow, label: 'Showcase' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="w-64 bg-[#1A1A2E] border-r border-[#2A0E61] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2A0E61]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
          KDR Tech
        </h1>
        <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#030014]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#2A0E61]">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3 border-[#2A0E61] text-gray-400 hover:text-white hover:bg-[#030014]"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
