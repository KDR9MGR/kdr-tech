"use client";
import React, { useState } from "react";
import { Check, X, Zap, Rocket, TrendingUp, Globe, Layout, Database, ChevronRight } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/developer-kdrtech-in/30min";

const mobileAppTiers = [
  {
    icon: Zap,
    badge: "Most Affordable",
    badgeColor: "text-[#94A3B8] border-[#1E3A5F] bg-[#0A1628]",
    name: "Basic App",
    price: "$500 – $1,500",
    timeline: "1 – 3 Weeks",
    idealFor: "Local businesses, creators, and entrepreneurs who need a simple utility app or prototype fast.",
    included: [
      "Flutter (iOS + Android) or React Native",
      "Up to 5 core screens",
      "Firebase backend (auth + database)",
      "Basic UI from your Figma or our template",
      "Google Play + App Store submission",
      "2 rounds of revisions",
      "14-day post-launch bug support",
      "Weekly progress updates (email)",
      "Full source code ownership",
    ],
    excluded: [
      "Custom UI/UX design from scratch",
      "Payment gateway integration",
      "Admin dashboard",
    ],
    cta: "Get a Free Quote",
    highlighted: false,
    cardClass: "bg-[#0F2040] border-[#1E3A5F]",
    ctaClass: "border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white",
  },
  {
    icon: Rocket,
    badge: "⭐ Most Popular",
    badgeColor: "text-[#2563EB] border-[#2563EB]/40 bg-[#2563EB]/10",
    name: "MVP Lite",
    price: "$2,000 – $4,999",
    timeline: "4 – 7 Weeks",
    idealFor: "Early-stage startups and entrepreneurs validating an idea with a polished, shippable product.",
    included: [
      "Flutter or React Native (iOS + Android)",
      "Up to 12 screens",
      "Custom UI/UX design (Figma → Code)",
      "User auth (email, Google, Apple Sign-In)",
      "REST API or Firebase backend",
      "Push notifications",
      "Stripe or PayPal payment integration",
      "Basic admin dashboard",
      "Google Play + App Store submission",
      "4 rounds of revisions",
      "30-day post-launch support",
      "Bi-weekly video calls (Zoom/Loom)",
      "Full source code + documentation",
    ],
    excluded: [
      "AI/ML features",
      "Real-time chat/video calling",
    ],
    cta: "Start Your MVP",
    highlighted: true,
    cardClass: "bg-[#0F2040] border-[#2563EB]/50 shadow-xl shadow-blue-900/20",
    ctaClass: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
  },
  {
    icon: TrendingUp,
    badge: "Full-Scale Build",
    badgeColor: "text-[#10B981] border-[#10B981]/40 bg-[#10B981]/10",
    name: "Growth MVP",
    price: "$5,000 – $10,000",
    timeline: "8 – 12 Weeks",
    idealFor: "Funded startups and product companies ready to launch, scale, and acquire early users.",
    included: [
      "Flutter or React Native (iOS + Android)",
      "Unlimited screens (scoped)",
      "Full custom UI/UX design system (Figma)",
      "Complex backend (Node.js / Supabase / PostgreSQL)",
      "Third-party API integrations (maps, payments, etc.)",
      "Real-time features (chat, notifications, live feeds)",
      "Role-based user system + full admin panel",
      "Analytics integration (Mixpanel / Firebase Analytics)",
      "Performance optimization (60fps, offline support)",
      "CI/CD pipeline setup",
      "Unlimited revisions (within scope)",
      "60-day post-launch support",
      "Weekly video calls + Slack/WhatsApp access",
      "Full source code + technical documentation",
    ],
    excluded: [],
    cta: "Discuss Your Project",
    highlighted: false,
    cardClass: "bg-[#0F2040] border-[#1E3A5F]",
    ctaClass: "border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-[#0A1628]",
  },
];

const websiteTiers = [
  {
    icon: Globe,
    badge: "Fast & Affordable",
    badgeColor: "text-[#94A3B8] border-[#1E3A5F] bg-[#0A1628]",
    name: "Static Website",
    price: "$400 – $1,200",
    timeline: "1 – 2 Weeks",
    idealFor: "Freelancers, consultants, startups, and local businesses needing a fast, professional online presence.",
    included: [
      "Next.js or HTML/CSS (fully responsive)",
      "Up to 6 pages (Home, About, Services, Portfolio, Blog, Contact)",
      "Custom design from your Figma or our template",
      "Contact form with email notifications",
      "SEO meta tags + sitemap",
      "Google Analytics integration",
      "Vercel or Netlify deployment",
      "2 rounds of revisions",
      "14-day post-launch support",
      "Full source code ownership",
    ],
    excluded: [
      "Backend / database",
      "User authentication",
      "CMS or admin panel",
    ],
    cta: "Get a Free Quote",
    highlighted: false,
    cardClass: "bg-[#0F2040] border-[#1E3A5F]",
    ctaClass: "border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white",
  },
  {
    icon: Layout,
    badge: "⭐ Most Popular",
    badgeColor: "text-[#2563EB] border-[#2563EB]/40 bg-[#2563EB]/10",
    name: "Dynamic Website",
    price: "$1,500 – $4,000",
    timeline: "3 – 6 Weeks",
    idealFor: "Growing businesses, SaaS products, and service agencies needing a fully functional web application.",
    included: [
      "Next.js (App Router) — fully responsive",
      "Unlimited pages",
      "Custom UI/UX design (Figma → Code)",
      "User authentication (email, Google OAuth)",
      "Supabase or PostgreSQL backend",
      "API integrations (Stripe, Mailchimp, Calendly, etc.)",
      "Dashboard or member portal",
      "SEO optimization + Open Graph tags",
      "Vercel deployment with CI/CD",
      "4 rounds of revisions",
      "30-day post-launch support",
      "Bi-weekly progress calls (Zoom/Loom)",
      "Full source code + documentation",
    ],
    excluded: [
      "AI/ML features",
      "E-commerce store (available in CMS tier)",
    ],
    cta: "Start Your Website",
    highlighted: true,
    cardClass: "bg-[#0F2040] border-[#2563EB]/50 shadow-xl shadow-blue-900/20",
    ctaClass: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
  },
  {
    icon: Database,
    badge: "Full-Featured",
    badgeColor: "text-[#10B981] border-[#10B981]/40 bg-[#10B981]/10",
    name: "Dynamic + CMS",
    price: "$3,000 – $8,000",
    timeline: "5 – 9 Weeks",
    idealFor: "Businesses, agencies, and e-commerce brands who need to manage content, products, or teams without a developer.",
    included: [
      "Next.js or WordPress/Headless CMS",
      "Full custom UI/UX design system (Figma)",
      "Fully custom admin/CMS panel",
      "E-commerce (Stripe, product catalog, orders)",
      "Multi-role user management",
      "Blog, news, or portfolio module",
      "Email marketing integration (Mailchimp / ConvertKit)",
      "Performance optimization (Core Web Vitals)",
      "SEO-ready structure + schema markup",
      "Advanced analytics dashboard",
      "Unlimited revisions (within scope)",
      "60-day post-launch support",
      "Weekly video calls + Slack/WhatsApp access",
      "Full source code + handover documentation",
    ],
    excluded: [],
    cta: "Discuss Your Project",
    highlighted: false,
    cardClass: "bg-[#0F2040] border-[#1E3A5F]",
    ctaClass: "border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-[#0A1628]",
  },
];

type ServiceTab = "mobile" | "website";

const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState<ServiceTab>("mobile");
  const [expandedTier, setExpandedTier] = useState<number | null>(1);

  const tiers = activeTab === "mobile" ? mobileAppTiers : websiteTiers;

  const handleTabChange = (tab: ServiceTab) => {
    setActiveTab(tab);
    setExpandedTier(1);
  };

  return (
    <section id="services" className="w-full py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2563EB] mb-3">
            Pricing & Packages
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Transparent Pricing. No Surprises.
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            Every project starts with a free strategy call. We scope it
            together, then you choose the package that fits your stage and budget.
          </p>
        </div>

        {/* Service tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 p-1 bg-[#0F2040] border border-[#1E3A5F] rounded-xl">
            <button
              onClick={() => handleTabChange("mobile")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "mobile"
                  ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/30"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              📱 Mobile App Development
            </button>
            <button
              onClick={() => handleTabChange("website")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "website"
                  ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/30"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              🌐 Website Development
            </button>
          </div>
        </div>

        {/* Tech stack pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {(activeTab === "mobile"
            ? ["Flutter", "React Native", "Android", "iOS", "Firebase", "Supabase", "Stripe"]
            : ["Next.js", "React", "WordPress", "Supabase", "PostgreSQL", "Vercel", "Stripe"]
          ).map((tech) => (
            <span key={tech} className="px-3 py-1 bg-[#0A1628] border border-[#1E3A5F] rounded-full text-xs text-[#94A3B8]">
              {tech}
            </span>
          ))}
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {tiers.map((tier, i) => {
            const Icon = tier.icon;
            const isExpanded = expandedTier === i;
            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-6 lg:p-8 flex flex-col gap-5 transition-all duration-200 ${tier.cardClass} ${
                  tier.highlighted ? "lg:-mt-4 lg:mb-4" : ""
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#2563EB] rounded-full text-xs font-bold text-white tracking-wide whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#0A1628] border border-[#1E3A5F] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#2563EB]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                  <div className="text-3xl font-extrabold text-gradient-blue mb-1">{tier.price}</div>
                  <div className="text-sm text-[#94A3B8]">Timeline: <span className="text-white">{tier.timeline}</span></div>
                </div>

                <p className="text-sm text-[#94A3B8] border-t border-[#1E3A5F] pt-4">
                  <span className="font-medium text-white">Ideal for: </span>
                  {tier.idealFor}
                </p>

                <div>
                  <button
                    className="flex items-center gap-1.5 text-sm font-semibold text-white mb-3 hover:text-[#2563EB] transition-colors"
                    onClick={() => setExpandedTier(isExpanded ? null : i)}
                  >
                    What&apos;s included
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>
                  {isExpanded && (
                    <ul className="space-y-2">
                      {tier.included.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
                          <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                      {tier.excluded.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#64748B]">
                          <X className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${tier.ctaClass}`}
                >
                  {tier.cta}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Payment note */}
        <div className="mt-10 text-center p-5 bg-[#0F2040] border border-[#1E3A5F] rounded-xl max-w-2xl mx-auto">
          <p className="text-[#94A3B8] text-sm">
            <span className="text-white font-semibold">💳 Payments via Stripe, Wise, PayPal, or bank transfer.</span>
            {" "}Milestone-based — you only pay as work is delivered and approved.{" "}
            <span className="text-[#10B981] font-medium">Zero risk.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
