import TeamMemberForm from '@/components/admin/forms/TeamMemberForm'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function NewTeamMemberPage() {
  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Add Team Member</h1>
            <p className="text-gray-400">Create a new team member profile</p>
          </div>

          <TeamMemberForm />
        </div>
      </main>
    </div>
  )
}
