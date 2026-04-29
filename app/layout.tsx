import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KDR Tech | Flutter & React Native App Development Agency",
  description:
    "We build custom iOS & Android apps using Flutter and React Native. Fixed-price packages from $500–$10,000. English-speaking team. Milestone payments. 30-day free support. Serving USA, UK, Australia, Canada.",
  keywords: [
    "flutter app development agency",
    "react native development company",
    "mobile app development for startups",
    "hire flutter developer",
    "custom iOS Android app development",
    "affordable app development USA UK Australia",
    "KDR Tech mobile apps",
  ],
  robots: "index, follow",
  openGraph: {
    title: "KDR Tech — Mobile App Development for Founders",
    description:
      "Flutter & React Native apps. Fixed price. Weekly updates. Clients in USA, UK, AU, CA. Book a free strategy call.",
    url: "https://kdrtech.in",
    siteName: "KDR Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KDR Tech — Mobile App Development Agency",
    description:
      "Flutter + React Native. Fixed prices. Milestone payments. Serving founders in USA, UK, Australia, Canada.",
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
    "Mobile app development agency specializing in Flutter and React Native for startups and founders worldwide.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.instagram.com/app_developer_kdr",
  ],
  areaServed: ["US", "GB", "AU", "CA", "DE", "AE"],
  serviceType: ["Flutter App Development", "React Native Development", "Mobile App Development"],
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
