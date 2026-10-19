import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const studioMoments = [
  {
    id: 1,
    image: "/images/instagram/ig_csk_keychain.jpg",
    alt: "CSK jersey keychain hand-knit ready with Dhoni helicopter shot hype",
  },
  {
    id: 2,
    image: "/images/instagram/ig_cadbury_bouquet.jpg",
    alt: "Pookie bouquet with Cadbury chocolates and forever pipe cleaner blooms",
  },
  {
    id: 3,
    image: "/images/instagram/ig_lumiflower_lamp.jpg",
    alt: "The Lumiflower fairy light lamp glowing softly on nightstand",
  },
  {
    id: 4,
    image: "/images/instagram/ig_orange_flower.jpg",
    alt: "Velvety hand-sculpted sunflower petal arrangement in studio",
  },
];

export function InstagramFeed() {
  return (
    <section className="py-20 bg-[#F6EFE3] border-t border-[#DCD1C1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-10">
        <span className="text-xs uppercase tracking-[0.2em] text-[#967F4F] font-medium block">
          Studio Journal
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#283C2A] uppercase tracking-wide">
          FOLLOW @THEPOOKIECRAFT
        </h2>
        <p className="text-xs sm:text-sm text-[#687060] font-sans font-light max-w-md mx-auto">
          A peek behind the scenes in our studio. Daily stitches, work in progress, and lifestyle inspiration.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {studioMoments.map((moment) => (
          <a
            key={moment.id}
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-[#FEF7ED] border border-[#DCD1C1] rounded-sm cursor-pointer shadow-xs"
          >
            <Image
              src={moment.image}
              alt={moment.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#283C2A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#FEF7ED]">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
