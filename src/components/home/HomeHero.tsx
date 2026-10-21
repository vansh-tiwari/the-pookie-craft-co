"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChenilleWireMotif } from "@/components/common/ChenilleWireMotif";
import { CardPetalBloom } from "@/components/motion/CardPetalBloom";

interface HomeHeroProps {
  heroImage: string;
}

export function HomeHero({ heroImage }: HomeHeroProps) {
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  return (
    <section className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Typography & CTAs with Staggered Entrance */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#FFFFFF] border border-[#F0E5EC] text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#9B1B54] shadow-xs"
          >
            <span>Contemporary Indian Craft Studio</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#200E19] font-normal leading-[1.06] tracking-tight">
              Made to be kept.
            </h1>
            <p className="text-base sm:text-lg font-sans text-[#4A303F] max-w-lg leading-relaxed font-light">
              Everlasting botanicals, bespoke sports keepsakes, and ambient floral lamps sculpted from
              plush chenille wire. Handcrafted in our India atelier.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-[#9B1B54] hover:bg-[#7D1342] text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-[2px] shadow-sm transition-all duration-300"
            >
              Shop Gifts
            </Link>
            <Link
              href="/custom-orders"
              className="px-8 py-3.5 border border-[#9B1B54] text-[#9B1B54] hover:bg-[#9B1B54] hover:text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-[2px] transition-all duration-300"
            >
              Commission a Custom Gift ↗
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="pt-3"
          >
            <ChenilleWireMotif variant="horizontal" strokeColor="#200E19" petalColor="#C8256E" />
          </motion.div>
        </div>

        {/* Right: Asymmetric Product Composition with Inset */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative"
        >
          <div
            className="relative overflow-visible"
            onMouseEnter={() => setIsHeroHovered(true)}
            onMouseLeave={() => setIsHeroHovered(false)}
          >
            <CardPetalBloom
              isHovered={isHeroHovered}
              product={{
                id: "hero-spotlight",
                slug: "sunflower-bouquet",
                name: "Forever Sunflower Bouquet",
                description: "",
                price: 249,
                category: "Flowers & Bouquets",
                images: [],
                image_url: heroImage,
                created_at: "",
              }}
            />
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-[6px] overflow-hidden shadow-atelier-lg border border-[#F0E5EC] bg-[#FFFFFF] transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src={heroImage || "/images/products/sunflower_bouquet.jpg"}
                alt="Handcrafted forever sunflower bouquet by The Pookie Craft Co."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />

              {/* 1. Artisan Spotlight Luxury Glass Pill Badge at Top-Left */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#180812]/85 backdrop-blur-md border border-[#D8A657]/40 shadow-sm pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8A657] animate-pulse" />
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#D8A657] font-semibold">
                  Artisan Spotlight
                </span>
              </div>

              {/* 2. Deep Nocturne Contrast Gradient at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#180812]/92 via-[#180812]/45 to-transparent pointer-events-none" />

              {/* 3. Title & Craft Info at Bottom-Left with Constrained Width (Zero Collision) */}
              <div className="absolute bottom-5 left-5 right-5 z-10 max-w-sm sm:max-w-[62%] text-white pointer-events-none">
                <p className="font-serif text-xl sm:text-2xl font-light text-white leading-tight">
                  Velvety Sunflower &amp; Lavender Forever Bouquet
                </p>
                <span className="text-[11px] font-sans text-[#E5D2DE] font-light mt-1 block">
                  Hand-sculpted in plush chenille wire · Never wilts
                </span>
              </div>
            </div>
          </div>

          {/* Tactile Material Detail Inset Re-anchored to Bottom-Right */}
          <div className="hidden sm:flex absolute -bottom-6 -right-4 sm:-right-6 z-20 bg-[#FFFFFF] p-3 rounded-[4px] shadow-atelier border border-[#F0E5EC] max-w-[270px] items-center gap-3">
            <div className="relative w-14 h-14 rounded-[2px] overflow-hidden flex-shrink-0 bg-[#FCF8FA] border border-[#F0E5EC]">
              <Image
                src="/images/products/pipe_cleaner_roses.jpg"
                alt="Velveteen chenille wire petal macro detail"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-xs font-sans">
              <strong className="block text-[#200E19] font-semibold text-[11px] uppercase tracking-[0.1em]">
                Chenille-to-Petal
              </strong>
              <span className="text-[#7E6875] text-[10.5px] leading-tight block">
                Tactile wire hand-sculpted into velvety petals that never wilt.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
