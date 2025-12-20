'use client'

import VideoTestimonialForm from '@/components/admin/forms/VideoTestimonialForm'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function NewVideoTestimonialPage() {
  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <VideoTestimonialForm />
      </main>
    </div>
  )
}
