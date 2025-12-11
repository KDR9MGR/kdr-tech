export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout wraps all /admin/* routes
  // It simply passes through children without adding StarCanvas, Navbar, Footer
  return <>{children}</>
}
