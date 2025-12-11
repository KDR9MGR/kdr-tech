'use client'

import FooterLinkForm from '@/components/admin/forms/FooterLinkForm'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function NewFooterLinkPage() {
  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <FooterLinkForm />
      </main>
    </div>
  )
}
