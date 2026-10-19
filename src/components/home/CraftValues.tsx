import React from "react";

const StarOrnament = () => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-[#967F4F]"
    aria-hidden="true"
  >
    <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.8" />
    <path
      d="M20 12C21.5 16 24 18.5 28 20C24 21.5 21.5 24 20 28C18.5 24 16 21.5 12 20C16 18.5 18.5 16 20 12Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" />
    <circle cx="32" cy="20" r="1.5" stroke="currentColor" strokeWidth="1" />
    <circle cx="20" cy="32" r="1.5" stroke="currentColor" strokeWidth="1" />
    <circle cx="8" cy="20" r="1.5" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const values = [
  {
    num: "01",
    title: "Plush Chenille Craft",
    description:
      "High-density velvety pipe cleaners, individually bent and layered by hand to mimic the gentle, natural curves of botanical petals.",
  },
  {
    num: "02",
    title: "Forever Longevity",
    description:
      "Fresh flowers wither in 3 days. Our Pookie blooms never droop, never shed, and keep cherished memories vibrant on your desk forever.",
  },
  {
    num: "03",
    title: "Match-Day Fandom",
    description:
      "Custom IPL jersey keychains with plush knit texture. Carry Dhoni #7, Rohit #45, or your personal number wherever you go.",
  },
  {
    num: "04",
    title: "Eco Handcrafted Unboxing",
    description:
      "Wrapped thoughtfully in pleated craft paper with personalized gift notes, safely packed from our studio to your doorstep.",
  },
];

export function CraftValues() {
  return (
    <section className="bg-[#283C2A] text-[#FEF7ED] py-24 md:py-32 border-t border-[#FEF7ED]/15 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-16 md:space-y-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <StarOrnament />
            <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#967F4F]">
              OUR CRAFT &amp; VALUES
            </span>
            <StarOrnament />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#FEF7ED] leading-[1.15]">
            Handcrafted with Love, Petal by Petal
          </h2>

          <p className="text-sm md:text-base font-light text-[#FEF7ED]/80 leading-relaxed max-w-lg mx-auto">
            Every piece follows an unhurried, mindful process. Slow craft shaped by hand in small artisan drops in India.
          </p>
        </div>

        {/* 4-Item Grid with Oversized Serif Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 text-center">
          {values.map((v) => (
            <div key={v.num} className="space-y-3 px-3 group">
              <span className="block font-serif text-4xl sm:text-5xl font-light text-[#967F4F] tracking-widest group-hover:text-[#FEF7ED] transition-colors duration-300">
                {v.num}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FEF7ED] pt-1">
                {v.title}
              </h3>
              <p className="text-xs sm:text-sm font-sans font-light text-[#FEF7ED]/75 leading-relaxed max-w-xs mx-auto">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
