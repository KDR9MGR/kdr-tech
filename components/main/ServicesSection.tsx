"use client";
import React, { useState } from "react";
import { Check, X, Zap, Rocket, TrendingUp, ChevronRight } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/kdrtech/strategy-call";

const tiers = [
  {
    icon: Zap,
    badge: "Most Affordable",
    badgeColor: "text-[#94A3B8] border-[#1E3A5F] bg-[#0A1628]",
    name: "Starter App",
    price: "$500 – $1,500",
    timeline: "2 – 4 Weeks",
    idealFor: "Freelancers, creators, local businesses, simple utility apps, single-feature tools",
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
    timeline: "4 – 8 Weeks",
    idealFor: "Early-stage startups, entrepreneurs validating an idea, apps needing user auth and backend logic",
    included: [
      "Flutter or React Native (iOS + Android)",
      "Up to 12 screens",
      "Custom UI/UX design (Figma → Code)",
      "User auth (email, Google, Apple Sign-In)",
      "REST API or Firebase backend",
      "Push notifications",
      "Stripe or Razorpay payment integration",
      "Admin dashboard (basic)",
      "Google Play + App Store submission",
      "4 rounds of revisions",
      "30-day post-launch support",
      "Bi-weekly video calls",
      "Full source code + documentation",
    ],
    excluded: [
      "AI/ML features",
      "Real-time chat/video",
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
    timeline: "8 – 16 Weeks",
    idealFor: "Funded startups, product companies, apps ready for launch and early traction",
    included: [
      "Flutter or React Native (iOS + Android)",
      "Unlimited screens (scoped to project)",
      "Full custom UI/UX design system (Figma)",
      "Complex backend (Node.js / Supabase / PostgreSQL)",
      "Third-party API integrations (maps, payments, etc.)",
      "Real-time features (chat, notifications, live feeds)",
      "Role-based user system + admin panel",
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

const ServicesSection = () => {
  const [expandedTier, setExpandedTier] = useState<number | null>(1);

  return (
    <section id="services" className="w-full py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
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

                {/* Badge + Icon */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#0A1628] border border-[#1E3A5F] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#2563EB]" />
                  </div>
                </div>

                {/* Tier info */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                  <div className="text-3xl font-extrabold text-gradient-blue mb-1">{tier.price}</div>
                  <div className="text-sm text-[#94A3B8]">Timeline: <span className="text-white">{tier.timeline}</span></div>
                </div>

                <p className="text-sm text-[#94A3B8] border-t border-[#1E3A5F] pt-4">
                  <span className="font-medium text-white">Ideal for: </span>
                  {tier.idealFor}
                </p>

                {/* Included features */}
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

                {/* CTA */}
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
