"use client";
import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "7+", label: "Years Experience", sub: "Across our core team" },
  { value: "100+", label: "Projects Delivered", sub: "Apps & websites, live worldwide" },
  { value: "15+", label: "Countries Served", sub: "Across 4 continents" },
  { value: "94%", label: "Client Retention", sub: "Clients who return for v2" },
];

const StatsSection = () => {
  return (
    <section className="w-full py-16 lg:py-20 border-y border-[#1E3A5F] bg-[#0F2040]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold tracking-[0.2em] uppercase text-[#2563EB] mb-10">
          Numbers Don&apos;t Lie
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-4xl lg:text-5xl font-extrabold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-base font-semibold text-[#E8ECF4] mb-1">{stat.label}</div>
              <div className="text-sm text-[#94A3B8]">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {[
            "✅ Contracts via DocuSign",
            "🔒 NDA on Request",
            "💳 Stripe & Wise Payments",
            "📋 Source Code Ownership",
            "🌍 English-Speaking Team",
            "📱 Apps & Websites",
          ].map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-full text-sm text-[#94A3B8]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
