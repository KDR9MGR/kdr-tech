"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  visible: boolean;
  order_index: number;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((data) => setFaqs(Array.isArray(data) ? data : []))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || faqs.length === 0) return null;

  return (
    <section id="faq" className="w-full py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2563EB] mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Questions We Hear Every Week
          </h2>
          <p className="text-lg text-[#94A3B8]">
            Everything you need to know before starting a project with us.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-[#0F2040] border rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen ? "border-[#2563EB]/40" : "border-[#1E3A5F]"
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span className="text-base font-semibold text-white group-hover:text-[#2563EB] transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#94A3B8] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-[#94A3B8] leading-relaxed border-t border-[#1E3A5F] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-10 text-center p-6 bg-[#0F2040] border border-[#1E3A5F] rounded-2xl">
          <p className="text-white font-semibold mb-1">Still have questions?</p>
          <p className="text-sm text-[#94A3B8] mb-4">
            Book a free 30-minute call and we&apos;ll answer everything.
          </p>
          <a
            href="https://calendly.com/developer-kdrtech-in/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Book a Free Call →
          </a>
        </div>
      </div>
    </section>
  );
}
