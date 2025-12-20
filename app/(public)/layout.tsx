import StarsCanvas from "@/components/main/StarBackground"
import Navbar from "@/components/main/Navbar"
import Footer from "@/components/main/Footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StarsCanvas />
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
