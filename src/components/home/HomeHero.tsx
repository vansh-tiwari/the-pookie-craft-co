"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChenilleWireMotif } from "@/components/common/ChenilleWireMotif";

interface HomeHeroProps {
  heroImage: string;
}

export function HomeHero({ heroImage }: HomeHeroProps) {
  return (
    <section className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Typography & CTAs with Staggered Entrance */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#FFFFFF] border border-[#E8E2D8] text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#967F4F] shadow-xs"
          >
            <span>Contemporary Indian Craft Studio</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C281F] font-normal leading-[1.06] tracking-tight">
              Made to be kept.
            </h1>
            <p className="text-base sm:text-lg font-sans text-[#5D685B] max-w-lg leading-relaxed font-light">
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
              className="px-8 py-3.5 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-[2px] shadow-sm transition-all duration-300"
            >
              Shop Gifts
            </Link>
            <Link
              href="/custom-orders"
              className="px-8 py-3.5 border border-[#1C281F] text-[#1C281F] hover:bg-[#1C281F] hover:text-[#FAF7F2] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-[2px] transition-all duration-300"
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
            <ChenilleWireMotif variant="horizontal" strokeColor="#1C281F" petalColor="#967F4F" />
          </motion.div>
        </div>

        {/* Right: Asymmetric Product Composition with Inset */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative"
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-[6px] overflow-hidden shadow-atelier-lg border border-[#E8E2D8] bg-[#FCFBF9]">
            <Image
              src={heroImage || "/images/products/sunflower_bouquet.jpg"}
              alt="Handcrafted forever sunflower bouquet by The Pookie Craft Co."
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#C29F58] font-semibold block mb-1">
                Artisan Spotlight
              </span>
              <p className="font-serif text-xl sm:text-2xl font-light">
                Velvety Sunflower & Lavender Forever Bouquet
              </p>
            </div>
          </div>

          {/* Tactile Material Detail Inset */}
          <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#FCFBF9] p-3 rounded-[4px] shadow-atelier border border-[#E8E2D8] max-w-xs items-center gap-3">
            <div className="relative w-14 h-14 rounded-[2px] overflow-hidden flex-shrink-0 bg-[#F2EDE4] border border-[#E8E2D8]">
              <Image
                src="/images/products/pipe_cleaner_roses.jpg"
                alt="Velveteen chenille wire petal macro detail"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-xs font-sans">
              <strong className="block text-[#1C281F] font-semibold text-[11px] uppercase tracking-[0.1em]">
                Chenille-to-Petal
              </strong>
              <span className="text-[#667264] text-[10.5px] leading-tight block">
                Tactile wire hand-sculpted into velvety petals that never wilt.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
