import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

export function StorySection() {
  return (
    <section className="py-24 md:py-32 bg-[#FEF7ED] overflow-hidden border-t border-[#DCD1C1]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Framed Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square max-w-md mx-auto rounded-sm overflow-hidden shadow-organic border border-[#DCD1C1] bg-[#F6EFE3]">
              <Image
                src="/images/products/pipe_cleaner_roses.jpg"
                alt="The Pookie Craft Co. Philosophy — Turning pipe cleaners into petals"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <StarOrnament />
              <span className="text-xs uppercase tracking-[0.25em] text-[#967F4F] font-medium">
                Our Philosophy
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#283C2A] leading-tight">
              Handcrafted with Heart. <br />
              <span className="italic text-[#967F4F] font-normal">
                Turning pipe cleaners into petals.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#687060] font-sans font-light leading-relaxed">
              The Pookie Craft Co. began in a quiet studio in India with a simple belief: objects made by hand carry a soul and warmth that factory machinery can never imitate. We create small-batch forever flowers, fandom keychains, and ambient lamps that celebrate velvety textures, calm color palettes, and deliberate craftsmanship.
            </p>

            <div className="pt-2">
              <Link href="/story" className="btn-primary gap-2">
                <span>OUR STORY</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
