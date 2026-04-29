"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#team", label: "Team" },
  { href: "#faq", label: "FAQ" },
];

const CALENDLY_URL = "https://calendly.com/developer-kdrtech-in/30min";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1628]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-[#1E3A5F]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/kdr-tech-logo.png"
              alt="KDR Tech"
              width={36}
              height={36}
              className="rounded-md"
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-base tracking-wide">KDR Tech</span>
              <span className="text-[10px] text-[#94A3B8] font-medium tracking-wider uppercase">
                Mobile Apps
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white rounded-md hover:bg-white/5 transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/919136667294?text=Hi, I'd like to discuss a mobile app project."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/30"
            >
              Book a Free Call
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2 rounded-md hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[200] transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-[#0F2040] border-l border-[#1E3A5F] shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]">
            <span className="font-bold text-white text-lg">KDR Tech</span>
            <button onClick={() => setIsOpen(false)} className="text-[#94A3B8] hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg text-base font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="p-4 border-t border-[#1E3A5F] mt-auto absolute bottom-0 left-0 right-0 flex flex-col gap-3">
            <a
              href="https://wa.me/919136667294?text=Hi, I'd like to discuss a mobile app project."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-[#1E3A5F] rounded-lg text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              💬 Chat on WhatsApp
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg text-white text-sm font-semibold transition-colors"
            >
              📅 Book a Free Call
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
