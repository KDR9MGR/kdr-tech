import ProtectedRoute from '@/components/admin/ProtectedRoute'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout wraps all /admin/* routes
  // It protects all admin routes with authentication
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
