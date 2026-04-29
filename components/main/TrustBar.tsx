import React from "react";

const countries = [
  { flag: "🇺🇸", name: "USA" },
  { flag: "🇬🇧", name: "UK" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇦🇪", name: "UAE" },
];

const badges = [
  { label: "Flutter", icon: "⚡" },
  { label: "React Native", icon: "⚛️" },
  { label: "Google Play", icon: "▶" },
  { label: "App Store", icon: "🍎" },
  { label: "Stripe Payments", icon: "💳" },
  { label: "Firebase", icon: "🔥" },
];

const TrustBar = () => {
  return (
    <section className="w-full border-y border-[#1E3A5F] bg-[#0F2040]/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-[#94A3B8] mb-6">
          Trusted by founders across
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-6">
          {countries.map((c) => (
            <span
              key={c.name}
              className="flex items-center gap-2 text-sm font-medium text-[#E8ECF4]"
            >
              <span className="text-lg">{c.flag}</span>
              {c.name}
            </span>
          ))}
        </div>
        <div className="border-t border-[#1E3A5F] pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {badges.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1628] border border-[#1E3A5F] rounded-full text-xs font-medium text-[#94A3B8]"
            >
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
