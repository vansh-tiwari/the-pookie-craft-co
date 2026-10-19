"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

const slides = [
  {
    id: 1,
    tag: "Handcrafted Floral Art",
    title: "Turning Pipe Cleaners\nInto Petals",
    subtitle:
      "Hand-sculpted velvety sunflowers, roses, and lavender blooms made to stay on your desk forever. Thoughtfully crafted loop by loop.",
    ctaText: "Shop the Collection",
    ctaLink: "/shop?category=flowers",
    image: "/images/products/sunflower_bouquet.jpg",
  },
  {
    id: 2,
    tag: "Match-Day Fandom",
    title: "IPL Jersey Keychains\nCSK #7, MI #45 & RCB",
    subtitle:
      "Plush textured jersey keychains for bike keys, backpacks, and match-day hype. Custom names and jersey numbers on request.",
    ctaText: "Explore Keychains",
    ctaLink: "/shop?category=keychains",
    image: "/images/products/jersey_keychains.jpg",
  },
  {
    id: 3,
    tag: "Ambient Night Magic",
    title: "The Lumiflower\nFairy Light Lamp",
    subtitle:
      "Translucent sculpted blossom petals embedded with warm micro-LED fairy lights. Brings a cozy, dreamy amber glow to your nightstand.",
    ctaText: "Discover Lumiflower",
    ctaLink: "/shop?category=lamps",
    image: "/images/products/lumiflower_lamp.jpg",
  },
  {
    id: 4,
    tag: "Sweetheart Gifting",
    title: "Everlasting Bouquets\nWith Cadbury Dairy Milk",
    subtitle:
      "Forever pipe cleaner blooms arranged with delicious chocolate bars in pleated Korean-style paper. The gift that melts hearts without withering away.",
    ctaText: "Custom Bouquet Inquiry",
    ctaLink: "/custom-orders",
    image: "/images/products/chocolate_bouquet.jpg",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background Images with Crossfade & Cinematic Dark Tint */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={slide.image}
              alt={slide.tag}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Clean dark overlay for 100% crystal-clear typography contrast */}
            <div className="absolute inset-0 bg-black/45 md:bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Centered Editorial Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 flex">
        <div className="flex flex-col max-w-2xl space-y-6 items-center text-center mx-auto">
          {/* Tagline / Subtitle Badge */}
          <motion.div
            key={`tag-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="h-[1px] w-6 bg-white/70" />
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-white/90 drop-shadow-md font-medium">
              {slide.tag}
            </p>
            <span className="h-[1px] w-6 bg-white/70" />
          </motion.div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${slide.id}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white leading-[1.1] whitespace-pre-line drop-shadow-md"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${slide.id}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-base sm:text-lg text-white/85 font-sans font-light leading-relaxed max-w-lg drop-shadow-sm"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Dual Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 pt-3 w-full sm:w-auto"
          >
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center justify-center px-10 py-3.5 bg-white text-[#283C2A] text-[13px] font-sans tracking-[0.14em] uppercase hover:bg-[#FEF7ED] transition-colors duration-300 rounded-sm font-medium shadow-md"
            >
              {slide.ctaText}
            </Link>

            <a
              href={`https://wa.me/${siteConfig.whatsappClean || siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello The Pookie Craft Co.! I'm interested in ordering a handcrafted piece from your latest drop."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-3.5 border border-white/60 text-white text-[13px] font-sans tracking-[0.14em] uppercase hover:bg-white/15 transition-colors duration-300 rounded-sm backdrop-blur-xs font-light"
            >
              WhatsApp Studio
            </a>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicator Dots at Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrent(idx)}
            className={`rounded-full transition-all duration-500 cursor-pointer ${
              current === idx ? "bg-white w-6 h-1.5" : "bg-white/40 w-1.5 h-1.5 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
