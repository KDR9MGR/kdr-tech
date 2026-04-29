import Navbar from "@/components/main/Navbar"
import Footer from "@/components/main/Footer"
import WhatsAppButton from "@/components/main/WhatsAppButton"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  )
}
