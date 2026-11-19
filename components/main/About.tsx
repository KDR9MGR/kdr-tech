import React from "react";
import { Globe2, Lock, Video, Smartphone, Headphones, FileCode2, ChevronRight } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/developer-kdrtech-in/30min";

const differentiators = [
  {
    icon: Globe2,
    title: "English-Speaking Team",
    description: "Direct, native-English communication from kickoff to launch — and after. No translation layer, no missed nuance.",
  },
  {
    icon: Lock,
    title: "Milestone Payments",
    description: "You approve each milestone before payment moves — nothing charged upfront, nothing charged without your sign-off.",
  },
  {
    icon: Video,
    title: "Weekly Progress Updates",
    description: "Every Friday you get a Loom video or Zoom call showing exactly what was built that week.",
  },
  {
    icon: Smartphone,
    title: "Flutter, React Native & Next.js",
    description: "iOS and Android from a single codebase; Next.js when the job calls for a website. The stack matches the project, not the other way around.",
  },
  {
    icon: Headphones,
    title: "30–60 Day Free Support",
    description: "We don't vanish after delivery. We stay with you until everything is stable and live.",
  },
  {
    icon: FileCode2,
    title: "You Own Everything",
    description: "Source code, Figma files, documentation — all handed over, all yours. No recurring fees, ever.",
  },
];

const About = () => {
  return (
    <section id="about" className="w-full py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left — Copy */}
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#F0328A]">
              Why KDR Tech
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              We&apos;re Your Tech Partner, Not Just a Vendor.
            </h2>
            <p className="text-[#C0B3DA] leading-relaxed">
              KDR Tech is a full-service digital solutions agency built to serve
              founders, startups, and growing businesses in the US, UK, Australia,
              and Canada. We build mobile apps and websites — whichever your
              business needs to grow.
            </p>
            <p className="text-[#C0B3DA] leading-relaxed">
              For mobile, we specialize in Flutter and React Native — two
              technologies that deliver one codebase for both iOS and Android,
              cutting your cost and timeline in half without compromising quality.
              For the web, we build fast, scalable Next.js applications with or
              without a headless CMS.
            </p>
            <p className="text-[#C0B3DA] leading-relaxed">
              Our team of 6 includes developers with 7+ years of hands-on
              experience, UI/UX designers trained in conversion-focused design, and
              a project manager who sends updates before you have to ask.
            </p>
            <p className="text-[#C0B3DA] leading-relaxed">
              We&apos;ve shipped fitness apps, logistics platforms, SaaS dashboards,
              e-commerce stores, healthcare tools, and agency websites — and every
              single one launched on time. We don&apos;t outsource, we don&apos;t
              disappear mid-project, and we don&apos;t invoice for work you
              haven&apos;t approved.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-vice-btn hover:brightness-110 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Book a Free Call
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#team"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#43226F] hover:border-[#F0328A]/50 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Meet the Team
              </a>
            </div>
          </div>

          {/* Right — Differentiators grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {differentiators.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-[#1A0C3D] border border-[#43226F] rounded-xl p-5 hover:border-[#F0328A]/40 transition-all duration-200 card-glow"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F0328A]/10 border border-[#F0328A]/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#F0328A]" style={{ width: "18px", height: "18px" }} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-[#C0B3DA] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
