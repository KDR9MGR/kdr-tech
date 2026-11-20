import Navbar from "@/components/main/Navbar"
import Footer from "@/components/main/Footer"
import WhatsAppButton from "@/components/main/WhatsAppButton"
import BackgroundMusic from "@/components/main/BackgroundMusic"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // `vice-theme` scopes the GTA VI look (display font, ambient sunset glow,
    // scrollbar, selection colour — see app/globals.css) to the public site so
    // the admin area is unaffected.
    <div className="vice-theme">
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
      <BackgroundMusic />
    </div>
  )
}
