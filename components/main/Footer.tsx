import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";
import { FaYoutube, FaFacebook } from "react-icons/fa";

interface FooterLink {
  id: string;
  title: string;
  url: string;
  category: string;
  icon_name: string | null;
  visible: boolean;
  order_index: number;
}

async function getFooterLinks(): Promise<FooterLink[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("footer_links")
      .select("*")
      .eq("visible", true)
      .order("order_index", { ascending: true });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

const getIcon = (iconName: string | null) => {
  switch (iconName?.toLowerCase()) {
    case "youtube": return <FaYoutube className="w-4 h-4" />;
    case "github": return <RxGithubLogo className="w-4 h-4" />;
    case "discord": return <RxDiscordLogo className="w-4 h-4" />;
    case "instagram": return <RxInstagramLogo className="w-4 h-4" />;
    case "twitter": return <RxTwitterLogo className="w-4 h-4" />;
    case "linkedin": return <RxLinkedinLogo className="w-4 h-4" />;
    case "facebook": return <FaFacebook className="w-4 h-4" />;
    default: return null;
  }
};

const serviceLinks = [
  "Flutter App Development",
  "React Native Development",
  "UI/UX Design for Mobile",
  "Backend Development",
  "App Store Submission",
  "Post-Launch Support",
];

const companyLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Process", href: "#process" },
  { label: "Portfolio", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Footer = async () => {
  const allLinks = await getFooterLinks();
  const socialLinks = allLinks.filter((l) => l.category === "social");
  const pageLinks = allLinks.filter((l) => l.category === "page");

  return (
    <footer className="w-full border-t border-[#1E3A5F] bg-[#060F1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/kdr-tech-logo.png"
                alt="KDR Tech"
                width={36}
                height={36}
                className="rounded-md"
              />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-base">KDR Tech</span>
                <span className="text-[10px] text-[#94A3B8] tracking-wider uppercase">
                  Mobile Apps
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xs">
              Building apps that launch, scale, and sell — for founders across
              the globe.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => {
                  const Icon = getIcon(link.icon_name);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.title}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0F2040] border border-[#1E3A5F] text-[#94A3B8] hover:text-white hover:border-[#2563EB]/50 transition-all"
                    >
                      {Icon}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Col 2 — Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <span className="text-sm text-[#94A3B8] hover:text-white transition-colors cursor-default">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {(pageLinks.length > 0 ? pageLinks.map(l => ({ label: l.title, href: l.url })) : companyLinks).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="mailto:hello@kdrtech.in" className="text-sm text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2">
                  📧 hello@kdrtech.in
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919136667294"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2"
                >
                  💬 WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/kdrtech/strategy-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2"
                >
                  📅 Book a Call
                </a>
              </li>
            </ul>
            <div>
              <p className="text-xs text-[#94A3B8] mb-2 font-medium">Working hours (IST)</p>
              <p className="text-xs text-[#64748B]">Mon – Fri · 9 AM – 7 PM</p>
              <p className="text-xs text-[#64748B]">Overlaps US EST mornings & UK afternoons</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1E3A5F] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#64748B]">
            © {new Date().getFullYear()} KDR Tech. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-[#64748B]">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
