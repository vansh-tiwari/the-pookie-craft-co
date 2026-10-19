import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, Sun, ShieldCheck, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Our Story | The Pookie Craft Co.",
  description:
    "Learn about The Pookie Craft Co., an artisanal craft studio turning pipe cleaners into petals and creating forever flowers that never wilt.",
};

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

export default function StoryPage() {
  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 bg-[#FEF7ED] min-h-screen space-y-12 md:space-y-16 text-[#283C2A]">
      {/* 00 / Breadcrumb & Brand Narrative Hero Card */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10">
        <nav aria-label="Breadcrumb" className="border-b border-[#DCD1C1]/60 pb-3 mb-6">
          <ol className="flex items-center flex-wrap gap-2 text-[12px] font-sans font-light tracking-[0.06em] text-[#687060]">
            <li>
              <Link href="/" className="hover:text-[#283C2A] transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#967F4F]/50 text-[11px] font-serif">/</span>
              <span className="text-[#283C2A] font-normal" aria-current="page">
                Our Story
              </span>
            </li>
          </ol>
        </nav>

        <div className="bg-[#F6EFE3] border border-[#DCD1C1] rounded-sm p-8 sm:p-12 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative">
          <div className="lg:col-span-7 space-y-5">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-[#283C2A] leading-[1.15]">
              Craft is more than technique. <br />
              <span className="italic text-[#967F4F] font-normal">
                It&apos;s a return to tactile human connection.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#3F4E3E] font-sans font-light leading-relaxed max-w-xl">
              {siteConfig.name} was born in a quiet Indian studio out of a desire to create slow, everlasting keepsakes. In a world saturated with mass plastic novelty, we hand-sculpt velvety floral sculptures and fandom keychains designed to bring warmth, texture, and quiet joy to everyday living.
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/5] rounded-sm overflow-hidden border border-[#DCD1C1] bg-[#FEF7ED] shadow-sm">
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF7ED]/95 backdrop-blur-xs border border-[#DCD1C1] rounded-full text-xs text-[#967F4F] font-medium tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#967F4F]" />
              <span>Our Brand Narrative</span>
            </div>
            <Image
              src="/images/products/pipe_cleaner_roses.jpg"
              alt="The Pookie Craft Co. Brand Narrative"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
            />
          </div>
        </div>
      </section>

      {/* 01 / Intention */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 space-y-5">
            <div className="flex items-center gap-2">
              <StarOrnament />
              <span className="text-xs uppercase tracking-[0.2em] text-[#967F4F] font-medium">
                01 / Intention
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#283C2A] leading-snug">
              Every petal holds intention.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#3F4E3E] font-sans font-light leading-relaxed">
              <p>
                Our process begins long before craft wire is twisted. We select high-density chenille wire with ultra-plush velvet fibers that mimic the softness and color saturation of living garden blooms.
              </p>
              <p>
                Each sunflower petal, rose layer, and IPL jersey keychain is individually curved and shaped by hand. Nothing is rushed. A single complex bouquet requires multiple hours of patient hand shaping, ensuring structural integrity that lasts indefinitely.
              </p>
              <p>
                When you hold a piece from {siteConfig.name}, you hold hours of dedicated human artistry and an everlasting reminder that someone cares.
              </p>
            </div>
          </div>

          <div className="md:col-span-6 relative aspect-[4/3] rounded-sm overflow-hidden border border-[#DCD1C1] bg-[#F6EFE3] shadow-sm">
            <Image
              src="/images/products/sunflower_bouquet.jpg"
              alt="Crafted with pure intention — The Pookie Craft Co."
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* 02 / Philosophy (Dark Forest Band) */}
      <section className="bg-[#1F3022] text-[#FEF7ED] py-20 border-y border-[#283C2A]">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center space-y-5">
          <span className="text-xs uppercase tracking-[0.25em] text-[#967F4F] font-medium block">
            02 / PHILOSOPHY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#FEF7ED] leading-tight">
            Crafting Calm in a Fast World
          </h2>
          <p className="text-sm sm:text-base text-[#FEF7ED]/85 font-sans font-light leading-relaxed max-w-2xl mx-auto">
            We intentionally refuse mass assembly lines. By working petal by petal and loop by loop, our studio celebrates quiet, thoughtful moments—creating forever gifts meant to be kept, loved, and smiled at every single day.
          </p>
        </div>
      </section>

      {/* 03 / Standards */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-10">
        <div className="border-b border-[#DCD1C1] pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#967F4F] font-medium block mb-1">
              03 / STANDARDS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#283C2A]">
              Our Artisan Principles
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="p-8 bg-[#F6EFE3] border border-[#DCD1C1] rounded-sm space-y-4 hover:border-[#967F4F] hover:-translate-y-1 transition-all duration-300 shadow-organic">
            <div className="w-12 h-12 rounded-full bg-[#FEF7ED] border border-[#DCD1C1] flex items-center justify-center text-[#967F4F]">
              <Heart className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#283C2A]">
              100% Artisan Handcrafted
            </h3>
            <p className="text-xs sm:text-sm text-[#3F4E3E] font-sans font-light leading-relaxed">
              Zero automated stamping or machines. Every petal, stem, and keychain is hand-shaped and assembled with genuine love in India.
            </p>
          </div>

          <div className="p-8 bg-[#F6EFE3] border border-[#DCD1C1] rounded-sm space-y-4 hover:border-[#967F4F] hover:-translate-y-1 transition-all duration-300 shadow-organic">
            <div className="w-12 h-12 rounded-full bg-[#FEF7ED] border border-[#DCD1C1] flex items-center justify-center text-[#967F4F]">
              <Sun className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#283C2A]">
              Velvety Chenille Fibers
            </h3>
            <p className="text-xs sm:text-sm text-[#3F4E3E] font-sans font-light leading-relaxed">
              We curate soft plush chenille craft wire with rich, saturated dye colors that maintain vibrant hues over years of display.
            </p>
          </div>

          <div className="p-8 bg-[#F6EFE3] border border-[#DCD1C1] rounded-sm space-y-4 hover:border-[#967F4F] hover:-translate-y-1 transition-all duration-300 shadow-organic">
            <div className="w-12 h-12 rounded-full bg-[#FEF7ED] border border-[#DCD1C1] flex items-center justify-center text-[#967F4F]">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#283C2A]">
              Forever Keepsake
            </h3>
            <p className="text-xs sm:text-sm text-[#3F4E3E] font-sans font-light leading-relaxed">
              Unlike fresh blooms that die in three days, our flowers never wilt, never require water, and stay radiant on desks and bedside tables.
            </p>
          </div>
        </div>
      </section>

      {/* 04 / CTA Button */}
      <section className="text-center pt-8 pb-8">
        <Link href="/shop" className="btn-primary gap-2">
          <span>EXPLORE THE COLLECTION</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
