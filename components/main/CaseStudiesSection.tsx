"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, Clock, DollarSign } from "lucide-react";

interface ResultItem {
  icon: string;
  text: string;
}

interface CaseStudy {
  id: string;
  title: string;
  client_type: string;
  country: string;
  flag_emoji: string;
  package_name: string | null;
  price_range: string | null;
  timeline: string | null;
  problem: string;
  solution: string;
  results: ResultItem[];
  tech_stack: string[];
  image_url: string | null;
  visible: boolean;
  order_index: number;
}

const CALENDLY_URL = "https://calendly.com/kdrtech/strategy-call";

export default function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/case-studies")
      .then((r) => r.json())
      .then((data) => {
        setCaseStudies(Array.isArray(data) ? data.filter((c: CaseStudy) => c.visible) : []);
      })
      .catch(() => setCaseStudies([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || caseStudies.length === 0) return null;

  return (
    <section id="work" className="w-full py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2563EB] mb-3">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Real Apps. Real Results.
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            We don&apos;t just build apps — we build businesses. Here&apos;s
            what we&apos;ve delivered.
          </p>
        </div>

        {/* Case study cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {caseStudies.map((cs) => {
            const isOpen = expanded === cs.id;
            return (
              <div
                key={cs.id}
                className="bg-[#0F2040] border border-[#1E3A5F] rounded-2xl overflow-hidden hover:border-[#2563EB]/40 transition-all duration-200 card-glow"
              >
                {/* Card Header */}
                <div className="p-6 pb-5 border-b border-[#1E3A5F]">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{cs.title}</h3>
                      <p className="text-sm text-[#94A3B8] mt-0.5">
                        {cs.flag_emoji} {cs.client_type} &mdash; {cs.country}
                      </p>
                    </div>
                    {cs.package_name && (
                      <span className="flex-shrink-0 px-3 py-1 bg-[#2563EB]/10 border border-[#2563EB]/25 rounded-full text-xs font-semibold text-[#2563EB] whitespace-nowrap">
                        {cs.package_name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[#94A3B8]">
                    {cs.price_range && (
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                        {cs.price_range}
                      </span>
                    )}
                    {cs.timeline && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                        {cs.timeline}
                      </span>
                    )}
                  </div>
                </div>

                {/* Results */}
                {Array.isArray(cs.results) && cs.results.length > 0 && (
                  <div className="px-6 py-4 bg-[#0A1628]/50 grid grid-cols-2 gap-3">
                    {cs.results.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-base leading-none mt-0.5">{r.icon}</span>
                        <span className="text-[#E8ECF4] leading-snug">{r.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Expand / Collapse */}
                <div className="px-6 pb-6 pt-4">
                  <button
                    onClick={() => setExpanded(isOpen ? null : cs.id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:text-[#38BDF8] transition-colors mb-4"
                  >
                    {isOpen ? "Show less" : "See full case study"}
                    <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="space-y-4 text-sm text-[#94A3B8] leading-relaxed">
                      <div>
                        <p className="font-semibold text-white mb-1">The Problem</p>
                        <p>{cs.problem}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">The Solution</p>
                        <p>{cs.solution}</p>
                      </div>
                      {cs.tech_stack && cs.tech_stack.length > 0 && (
                        <div>
                          <p className="font-semibold text-white mb-2">Tech Stack</p>
                          <div className="flex flex-wrap gap-2">
                            {cs.tech_stack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-1 bg-[#0A1628] border border-[#1E3A5F] rounded-full text-xs text-[#94A3B8]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#2563EB] transition-colors"
                  >
                    Build something similar →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
