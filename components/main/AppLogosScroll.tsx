"use client";
import React from "react";
import Image from "next/image";

const AppLogosScroll = () => {
  const logos = [
    { src: "/images/apps/aplay_logo.png", alt: "Aplay" },
    { src: "/images/apps/app_icon.png", alt: "App Icon" },
    { src: "/images/apps/dp_logo.png", alt: "DP Logo" },
    { src: "/images/apps/malpeli_logo.png", alt: "Malpeli" },
  ];

  // Triple the logos array for truly seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full py-12 overflow-hidden max-w-full">
      <div className="mb-8 text-center">
        <h2 className="text-[40px] font-medium text-gray-200">
          Visions That Are Reality Now
        </h2>
      </div>

      <div className="relative flex flex-col gap-8">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030014] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030014] to-transparent z-10 pointer-events-none" />

        {/* First row - scrolling left */}
        <div className="flex animate-scroll-left-continuous">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`left-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Second row - scrolling right */}
        <div className="flex animate-scroll-right-continuous">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`right-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppLogosScroll;
