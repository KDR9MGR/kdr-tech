'use client'

import TextTestimonialForm from '@/components/admin/forms/TextTestimonialForm'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function NewTextTestimonialPage() {
  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <TextTestimonialForm />
      </main>
    </div>
  )
}
