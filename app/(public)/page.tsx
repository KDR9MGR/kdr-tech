import Hero from "@/components/main/Hero";
import TrustBar from "@/components/main/TrustBar";
import AppShowcase from "@/components/main/AppShowcase";
import ServicesSection from "@/components/main/ServicesSection";
import ProcessSection from "@/components/main/ProcessSection";
import CaseStudiesSection from "@/components/main/CaseStudiesSection";
import About from "@/components/main/About";
import TestimonialsShowcase from "@/components/main/TestimonialsShowcase";
import StatsSection from "@/components/main/StatsSection";
import Team from "@/components/main/Team";
import LeadMagnetSection from "@/components/main/LeadMagnetSection";
import FAQSection from "@/components/main/FAQSection";

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Trust bar — flags + platform badges */}
      <TrustBar />

      {/* 3. App showcase — scrolling logos (CMS) */}
      <AppShowcase />

      {/* 4. Services & Pricing */}
      <ServicesSection />

      {/* 5. Development process */}
      <ProcessSection />

      {/* 6. Case studies (CMS) */}
      <CaseStudiesSection />

      {/* 7. About / Why KDR Tech */}
      <About />

      {/* 8. Testimonials (CMS) */}
      <TestimonialsShowcase />

      {/* 9. Stats + trust badges */}
      <StatsSection />

      {/* 10. Team (CMS) */}
      <Team />

      {/* 11. Lead magnet / contact form */}
      <LeadMagnetSection />

      {/* 12. FAQ (CMS) */}
      <FAQSection />
    </main>
  );
}
