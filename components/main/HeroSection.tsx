"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";

const CALENDLY_URL = "https://calendly.com/kdrtech/strategy-call";

const trustSignals = [
  "7+ Years Experience",
  "50+ Apps Delivered",
  "Clients in USA, UK, AU, CA",
  "30-Day Free Support",
  "Milestone Payments",
];

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 pb-12 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#2563EB]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#10B981]/5 rounded-full blur-[100px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#E8ECF4 1px, transparent 1px), linear-gradient(90deg, #E8ECF4 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            {/* Availability badge */}
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981]/10 border border-[#10B981]/25 rounded-full text-sm font-medium text-[#10B981]">
                <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                Accepting New Projects — 2 Spots Open This Month
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              We Build Mobile Apps That{" "}
              <span className="text-gradient-blue">Launch, Scale,</span>{" "}
              and{" "}
              <span className="text-gradient-green">Sell.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed max-w-xl mx-auto lg:mx-0">
              Flutter & React Native development for founders, startups, and
              product teams. Fixed-price packages. Weekly updates.
              English-speaking team. Projects from{" "}
              <span className="text-white font-semibold">$500 to $10,000.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:-translate-y-0.5 text-base"
              >
                Book a Free Strategy Call
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-transparent border border-[#1E3A5F] hover:border-[#2563EB]/50 hover:bg-[#2563EB]/5 text-white font-semibold rounded-xl transition-all duration-200 text-base"
              >
                View Our Work
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start pt-2">
              {trustSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8]"
                >
                  <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  {signal}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 bg-[#2563EB]/15 rounded-full blur-3xl scale-110" />

              {/* Logo container */}
              <div className="relative w-72 h-72 lg:w-96 lg:h-96 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-[#1E3A5F]/60" />
                <div className="absolute inset-6 rounded-full border border-[#2563EB]/20" />
                <Image
                  src="/images/kdr-tech-logo.png"
                  alt="KDR Tech — Mobile App Development"
                  width={220}
                  height={220}
                  className="relative z-10 drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 lg:-left-12 bg-[#0F2040] border border-[#1E3A5F] rounded-xl px-4 py-3 shadow-xl"
              >
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-[#94A3B8]">Apps Delivered</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -right-4 lg:-right-8 bg-[#0F2040] border border-[#1E3A5F] rounded-xl px-4 py-3 shadow-xl"
              >
                <div className="text-2xl font-bold text-[#10B981]">94%</div>
                <div className="text-xs text-[#94A3B8]">Client Retention</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-6 lg:-right-14 -translate-y-1/2 bg-[#0F2040] border border-[#1E3A5F] rounded-xl px-4 py-3 shadow-xl"
              >
                <div className="text-2xl font-bold text-[#2563EB]">12+</div>
                <div className="text-xs text-[#94A3B8]">Countries</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
