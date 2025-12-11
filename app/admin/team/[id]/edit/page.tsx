import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TeamMemberForm from '@/components/admin/forms/TeamMemberForm'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: member, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !member) {
    redirect('/admin/team')
  }

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Team Member</h1>
            <p className="text-gray-400">Update {member.full_name}'s profile</p>
          </div>

          <TeamMemberForm initialData={member} isEdit={true} />
        </div>
      </main>
    </div>
  )
}
