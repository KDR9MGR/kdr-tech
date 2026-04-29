"use client";
import React, { useState } from "react";
import { ArrowRight, CalendarDays, MessageCircle, CheckCircle, Loader2 } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/developer-kdrtech-in/30min";

const budgetOptions = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $6,000",
  "$6,000 – $10,000",
  "$10,000+",
  "Not sure yet",
];

const projectTypes = [
  "Mobile App (iOS + Android)",
  "Static Website",
  "Dynamic Website",
  "Website + CMS",
  "E-commerce Store",
  "Other / Not sure",
];

export default function LeadMagnetSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    app_idea: "",
    budget_range: "",
    project_type: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "lead-magnet" }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", app_idea: "", budget_range: "", project_type: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="w-full py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Copy */}
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2563EB]">
              Start Your Project
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Not Sure What Your Project Will Cost?
            </h2>
            <p className="text-lg text-[#94A3B8] leading-relaxed">
              Tell us about your idea in 60 seconds. We&apos;ll send you a free,
              honest Project Roadmap — a clear breakdown of features, timeline,
              and cost. No sales pitch, no obligation.
            </p>

            <ul className="space-y-3">
              {[
                "Free response within 24 hours",
                "Covers mobile apps and websites",
                "Includes feature breakdown + cost estimate",
                "No email spam, ever — no commitment required",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#94A3B8]">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-sm transition-colors"
              >
                <CalendarDays className="w-4 h-4" />
                Book a Free 30-Min Call
              </a>
              <a
                href="https://wa.me/919136667294?text=Hi, I'd like to discuss a project with KDR Tech."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 font-semibold rounded-xl text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us Now
              </a>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-[#0F2040] border border-[#1E3A5F] rounded-2xl p-6 lg:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                <div className="w-16 h-16 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-white">We&apos;re on it!</h3>
                <p className="text-[#94A3B8] text-sm max-w-xs">
                  You&apos;ll receive your free Project Roadmap within 24 hours.
                  Check your inbox (and spam, just in case).
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Also book a call →
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Get Your Free Project Roadmap
                  </h3>
                  <p className="text-sm text-[#94A3B8]">Delivered within 24 hours. Apps and websites.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E8ECF4] mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your first name"
                      className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E8ECF4] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E8ECF4] mb-1.5">
                      Project Type
                    </label>
                    <select
                      value={formData.project_type}
                      onChange={(e) => handleChange("project_type", e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-xl text-white text-sm focus:outline-none focus:border-[#2563EB] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0A1628]">Select project type...</option>
                      {projectTypes.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0A1628]">{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E8ECF4] mb-1.5">
                      Describe Your Project
                    </label>
                    <textarea
                      value={formData.app_idea}
                      onChange={(e) => handleChange("app_idea", e.target.value)}
                      placeholder="e.g., A booking platform for personal trainers where clients can schedule sessions and pay online..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E8ECF4] mb-1.5">
                      Budget Range
                    </label>
                    <select
                      value={formData.budget_range}
                      onChange={(e) => handleChange("budget_range", e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-xl text-white text-sm focus:outline-none focus:border-[#2563EB] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0A1628]">Select a range...</option>
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0A1628]">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400">
                    Something went wrong. Please try WhatsApp or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send My Free Roadmap
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-[#64748B] text-center">
                  No spam. No sales pitch. Just a clear, honest breakdown of what your project needs and what it&apos;ll cost.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
