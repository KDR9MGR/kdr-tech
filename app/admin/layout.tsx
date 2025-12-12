'use client'

import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't protect the login page - it should be publicly accessible
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  // Protect all other admin routes with authentication
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
