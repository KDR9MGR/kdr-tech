import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KDR Tech | Mobile App & Website Development Agency",
  description:
    "Full-service digital agency building custom mobile apps (Flutter, React Native) and websites (Next.js, CMS). Fixed-price packages from $400–$10,000. English-speaking team. Milestone payments. Serving USA, UK, Australia, Canada.",
  keywords: [
    "flutter app development agency",
    "react native development company",
    "mobile app development for startups",
    "next.js website development agency",
    "custom website development USA UK Australia",
    "hire flutter developer",
    "custom iOS Android app development",
    "affordable app development USA UK Australia",
    "KDR Tech mobile apps",
    "web development agency for startups",
    "CMS website development",
    "full service digital agency",
  ],
  robots: "index, follow",
  openGraph: {
    title: "KDR Tech — Mobile Apps & Websites for Founders",
    description:
      "Flutter, React Native & Next.js. Fixed prices. Weekly updates. Clients in USA, UK, AU, CA. Book a free strategy call.",
    url: "https://kdrtech.in",
    siteName: "KDR Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KDR Tech — Mobile App & Website Development Agency",
    description:
      "Flutter + React Native + Next.js. Fixed prices. Milestone payments. Serving founders in USA, UK, Australia, Canada.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://kdrtech.in" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KDR Tech",
  url: "https://kdrtech.in",
  logo: "https://kdrtech.in/images/kdr-tech-logo.png",
  description:
    "Full-service digital agency specializing in mobile apps (Flutter, React Native) and websites (Next.js, CMS) for startups and founders worldwide.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.instagram.com/app_developer_kdr",
  ],
  areaServed: ["US", "GB", "AU", "CA", "DE", "AE"],
  serviceType: ["Flutter App Development", "React Native Development", "Mobile App Development", "Next.js Website Development", "CMS Website Development", "E-commerce Development"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.className} bg-[#0A1628] overflow-y-scroll overflow-x-hidden max-w-[100vw]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
