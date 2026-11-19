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
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#F0328A] mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Questions We Hear Every Week
          </h2>
          <p className="text-lg text-[#C0B3DA]">
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
                className={`bg-[#1A0C3D] border rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen ? "border-[#F0328A]/40" : "border-[#43226F]"
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span className="text-base font-semibold text-white group-hover:text-[#F0328A] transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C0B3DA] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-[#C0B3DA] leading-relaxed border-t border-[#43226F] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-10 text-center p-6 bg-[#1A0C3D] border border-[#43226F] rounded-2xl">
          <p className="text-white font-semibold mb-1">Still have questions?</p>
          <p className="text-sm text-[#C0B3DA] mb-4">
            Book a free 30-minute call and we&apos;ll answer everything.
          </p>
          <a
            href="https://calendly.com/developer-kdrtech-in/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-vice-btn hover:brightness-110 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Book a Free Call →
          </a>
        </div>
      </div>
    </section>
  );
}
