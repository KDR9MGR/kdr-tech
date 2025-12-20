import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Get counts for dashboard stats
  const [teamCount, blogCount, videoTestimonialsCount, textTestimonialsCount] = await Promise.all([
    supabase.from('team_members').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('testimonials_video').select('id', { count: 'exact', head: true }).eq('visible', true),
    supabase.from('testimonials_text').select('id', { count: 'exact', head: true }).eq('visible', true),
  ])

  const stats = [
    {
      title: 'Team Members',
      value: teamCount.count || 0,
      icon: Users,
      description: 'Total team members',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Blog Posts',
      value: blogCount.count || 0,
      icon: FileText,
      description: 'Published posts',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      title: 'Video Testimonials',
      value: videoTestimonialsCount.count || 0,
      icon: MessageSquare,
      description: 'Active testimonials',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Text Testimonials',
      value: textTestimonialsCount.count || 0,
      icon: TrendingUp,
      description: 'Client reviews',
      color: 'from-indigo-500 to-indigo-600',
    },
  ]

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome to your KDR Tech admin dashboard</p>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-[#1A1A2E] border-[#2A0E61]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1A1A2E] border-[#2A0E61]">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Common tasks to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/team/new"
              className="block p-3 rounded-lg bg-[#030014] hover:bg-[#2A0E61] text-white transition-colors"
            >
              + Add New Team Member
            </a>
            <a
              href="/admin/blog/new"
              className="block p-3 rounded-lg bg-[#030014] hover:bg-[#2A0E61] text-white transition-colors"
            >
              + Create Blog Post
            </a>
            <a
              href="/admin/testimonials/video"
              className="block p-3 rounded-lg bg-[#030014] hover:bg-[#2A0E61] text-white transition-colors"
            >
              + Add Testimonial
            </a>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A2E] border-[#2A0E61]">
          <CardHeader>
            <CardTitle className="text-white">Getting Started</CardTitle>
            <CardDescription className="text-gray-400">
              Setup instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <div>
                <p className="font-medium">Database configured</p>
                <p className="text-xs text-gray-500">Your Supabase database is ready</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">→</span>
              <div>
                <p className="font-medium">Add your first team member</p>
                <p className="text-xs text-gray-500">Go to Team section to get started</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">→</span>
              <div>
                <p className="font-medium">Write your first blog post</p>
                <p className="text-xs text-gray-500">Share insights with your audience</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
      </main>
    </div>
  )
}
