"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ViceHeroBackdrop, ViceSun } from "./ViceScene";

const CALENDLY_URL = "https://calendly.com/developer-kdrtech-in/30min";

const trustSignals = [
  "7+ Years Experience",
  "100+ Projects Delivered",
  "Clients in USA, UK, AU, CA",
  "30-Day Free Support",
  "Milestone Payments",
];

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 pb-40 sm:pb-48 lg:pb-52 overflow-hidden"
    >
      {/* Background: Vice City dusk — sky, stars, skyline, palms */}
      <ViceHeroBackdrop />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#F0328A]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-[#22D3C5]/8 rounded-full blur-[110px]" />
      </div>

      {/* z-10 keeps the copy above the absolutely-positioned backdrop (palms) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#22D3C5]/10 border border-[#22D3C5]/25 rounded-full text-sm font-medium text-[#22D3C5]">
                <span className="w-2 h-2 bg-[#22D3C5] rounded-full animate-pulse" />
                Accepting New Projects — 2 Spots Open This Month
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Mobile Apps & Websites That{" "}
              <span className="text-gradient-blue">Launch Fast,</span>{" "}
              Look Premium, and{" "}
              <span className="text-gradient-green">Grow.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#C0B3DA] leading-relaxed max-w-xl mx-auto lg:mx-0">
              Flutter, React Native, and Next.js development for founders,
              startups, and businesses. Fixed-price packages. Weekly updates.
              English-speaking team. Projects from{" "}
              <span className="text-white font-semibold">$400 to $10,000.</span>
            </p>

            {/* Service pills */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {["📱 Mobile Apps", "🌐 Websites", "⚡ CMS Platforms", "🛒 E-commerce"].map((s) => (
                <span key={s} className="px-3 py-1.5 bg-[#1A0C3D] border border-[#43226F] rounded-full text-xs text-[#C0B3DA] font-medium">
                  {s}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-vice-btn hover:brightness-110 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:-translate-y-0.5 text-base"
              >
                Book a Free Strategy Call
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-transparent border border-[#43226F] hover:border-[#F0328A]/50 hover:bg-[#F0328A]/5 text-white font-semibold rounded-xl transition-all duration-200 text-base"
              >
                See Packages & Pricing
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start pt-2">
              {trustSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center gap-1.5 text-sm text-[#C0B3DA]"
                >
                  <CheckCircle className="w-4 h-4 text-[#22D3C5] flex-shrink-0" />
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
              {/* sunset bloom behind the sun */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF8A3D]/30 to-[#F0328A]/30 rounded-full blur-3xl scale-110" />

              <div className="relative w-72 h-72 lg:w-96 lg:h-96 flex items-center justify-center">
                {/* striped retro sun */}
                <ViceSun className="absolute inset-0 w-full h-full vice-sun-pulse" />
                {/* logo "eclipse" badge in front of the sun */}
                <div className="relative z-10 flex items-center justify-center w-40 h-40 lg:w-52 lg:h-52 rounded-full bg-[#0D0620]/90 border border-[#F0328A]/60 neon-pink backdrop-blur-sm">
                  <Image
                    src="/images/kdr-tech-logo.png"
                    alt="KDR Tech — Mobile App & Website Development Agency"
                    width={220}
                    height={220}
                    className="w-36 h-36 lg:w-48 lg:h-48 object-contain"
                    priority
                  />
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 lg:-left-12 bg-[#1A0C3D] border border-[#43226F] rounded-xl px-4 py-3 shadow-xl"
              >
                <div className="text-2xl font-bold text-white">100+</div>
                <div className="text-xs text-[#C0B3DA]">Projects Delivered</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -right-4 lg:-right-8 bg-[#1A0C3D] border border-[#43226F] rounded-xl px-4 py-3 shadow-xl"
              >
                <div className="text-2xl font-bold text-[#22D3C5]">94%</div>
                <div className="text-xs text-[#C0B3DA]">Client Retention</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-6 lg:-right-14 -translate-y-1/2 bg-[#1A0C3D] border border-[#43226F] rounded-xl px-4 py-3 shadow-xl"
              >
                <div className="text-2xl font-bold text-[#F0328A]">15+</div>
                <div className="text-xs text-[#C0B3DA]">Countries</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
