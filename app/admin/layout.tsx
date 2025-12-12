import ProtectedRoute from '@/components/admin/ProtectedRoute'

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
