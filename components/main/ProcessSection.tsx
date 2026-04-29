import React from "react";
import { PhoneCall, FileText, Palette, Code2, TestTube, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PhoneCall,
    title: "Discovery Call",
    timeline: "Day 1",
    description:
      "We spend 30–60 minutes understanding your vision, goals, target users, and technical needs. No charge, no commitment. We ask the right questions so nothing gets missed later.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Scope & Proposal",
    timeline: "Days 2–3",
    description:
      "We deliver a written project scope, feature list, timeline, and fixed-price quote within 48 hours. No vague estimates — you know exactly what you're getting and what it costs.",
  },
  {
    number: "03",
    icon: Palette,
    title: "UI/UX Design",
    timeline: "Week 1–2",
    description:
      "Our designers build your full app in Figma before a single line of code is written. You approve every screen. This eliminates expensive rebuilds later.",
  },
  {
    number: "04",
    icon: Code2,
    title: "Development Sprints",
    timeline: "Week 2 onward",
    description:
      "We build in 1-week sprints with a live Loom or video demo every Friday. You see real progress, give feedback, and stay in full control.",
  },
  {
    number: "05",
    icon: TestTube,
    title: "QA & Testing",
    timeline: "Final week",
    description:
      "Every feature is tested on real iOS and Android devices. We fix bugs, optimize performance, and run security checks before anything goes live.",
  },
  {
    number: "06",
    icon: Rocket,
    title: "Launch & Handoff",
    timeline: "Day of launch",
    description:
      "We handle App Store and Google Play submission, configure your backend, hand over all source code, and stay available for 30–60 days post-launch. You own everything.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="w-full py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2563EB] mb-3">
            How We Work
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            From Idea to App Store in 6 Clear Steps
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            No black boxes. No guessing. You know exactly where your project
            stands — every single day.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative bg-[#0F2040] border border-[#1E3A5F] rounded-2xl p-6 hover:border-[#2563EB]/40 transition-all duration-200 card-glow"
              >
                {/* Step number + connector */}
                <div className="flex items-start justify-between mb-5">
                  <span className="text-5xl font-extrabold text-[#1E3A5F] leading-none select-none">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#2563EB]" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase mb-1">
                    {step.timeline}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
