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

const WatermarkIcon = () => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    className="w-7 h-7 text-[#967F4F]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 32 12 L 14 90" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="30" cy="20" rx="1.5" ry="4" transform="rotate(-15 30 20)" strokeWidth="1.5" fill="currentColor" />
    <path
      d="M 12 36 Q 22 28 30 20 Q 42 12 55 24 C 62 14 74 14 80 24 C 88 34 82 48 68 60 C 58 48 60 30 70 28 C 76 26 84 34 80 44 C 74 58 58 68 92 74"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const reviews = [
  {
    id: 1,
    quote:
      "I ordered a custom CSK #7 jersey keychain for my bike and the sunflower stem. The plush texture and craftsmanship is amazing. It looks so neat and solid in real life!",
    author: "Vaibhav Modi",
    city: "Dewas",
    tag: "CSK #7 Jersey Keychain",
  },
  {
    id: 2,
    quote:
      "Gifted the Sweetheart Chocolate Bouquet to my bestie and she was completely obsessed! The flowers look so velvety and knowing they'll never wilt makes it ten times better than real roses.",
    author: "Aarav Kulkarni",
    city: "Pune",
    tag: "Sweetheart Chocolate Bouquet",
  },
  {
    id: 3,
    quote:
      "The Lumiflower fairy light lamp is the prettiest thing on my study desk. Warm ambient glow at night, and during the day it looks like an art sculpture. Fast delivery too!",
    author: "Ananya Sharma",
    city: "Bengaluru",
    tag: "The Lumiflower Lamp",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#FEF7ED] border-t border-[#DCD1C1]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-6 bg-[#967F4F]" />
            <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#967F4F] font-medium">
              Kind Words &amp; Reviews
            </span>
            <span className="h-[1px] w-6 bg-[#967F4F]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#283C2A]">
            From The Pookie Family
          </h2>

          <p className="text-xs sm:text-sm text-[#687060] font-sans font-light leading-relaxed">
            Genuine thoughts from patrons who cherish handcrafted forever flowers and fandom drops made with love.
          </p>
        </div>

        {/* Reviews 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-[#FFFDF9] p-7 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-500 ease-out hover:-translate-y-1.5 relative overflow-hidden group border border-[#DCD1C1]/60 shadow-sm hover:shadow-organic"
            >
              {/* Decorative Watermark */}
              <div className="absolute top-5 right-5 text-[#967F4F] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none">
                <WatermarkIcon />
              </div>

              <div className="space-y-4 pr-10">
                <div className="flex items-center gap-1.5 text-[#967F4F]">
                  <StarOrnament />
                  <span className="text-[10px] font-sans tracking-[0.2em] uppercase font-semibold text-[#967F4F]">
                    Verified Patron
                  </span>
                </div>

                <p className="font-serif italic text-sm sm:text-base text-[#283C2A] leading-relaxed">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#DCD1C1]/60 flex items-center justify-between">
                <span className="text-[10px] font-sans tracking-[0.1em] uppercase text-[#967F4F] font-medium">
                  {r.tag}
                </span>
                <div className="text-right">
                  <h4 className="font-serif font-medium text-sm text-[#283C2A]">
                    {r.author}
                  </h4>
                  <p className="text-[11px] font-sans text-[#687060] font-light">
                    {r.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
