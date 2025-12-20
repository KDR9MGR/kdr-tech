'use client'

import AppShowcaseForm from '@/components/admin/forms/AppShowcaseForm'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function NewAppPage() {
  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <AppShowcaseForm />
      </main>
    </div>
  )
}
