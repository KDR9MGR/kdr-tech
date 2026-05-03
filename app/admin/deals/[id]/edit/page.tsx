import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DealForm from '@/components/admin/forms/DealForm'

export default async function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: deal, error } = await supabase
    .from('pipeline_deals')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !deal) redirect('/admin/deals')

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <DealForm initialData={deal} isEdit />
      </main>
    </div>
  )
}
