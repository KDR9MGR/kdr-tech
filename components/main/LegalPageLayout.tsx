import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface LegalPageLayoutProps {
  title: string
  effectiveDate?: string
  lastUpdated?: string
  children: React.ReactNode
}

export default function LegalPageLayout({
  title,
  effectiveDate,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="relative py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-magenta transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient-blue">
          {title}
        </h1>

        {effectiveDate && (
          <p className="text-sm text-[#64748B] mb-10">
            Effective Date: {effectiveDate}
          </p>
        )}

        <div
          className="space-y-4 text-[#94A3B8] leading-relaxed border-t border-[#1E3A5F] pt-10
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:first:mt-0
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
          [&_p]:mb-4
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4
          [&_a]:text-brand-magenta [&_a]:hover:underline
          [&_strong]:text-white [&_strong]:font-semibold"
        >
          {children}
        </div>

        {lastUpdated && (
          <p className="text-sm text-[#64748B] mt-12 pt-6 border-t border-[#1E3A5F]">
            Last Updated: {lastUpdated}
          </p>
        )}
      </div>
    </div>
  )
}
