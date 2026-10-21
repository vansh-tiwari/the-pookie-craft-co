"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Check, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { useBag } from "@/context/BagContext";
import { money } from "@/lib/bag";

interface BagQuickAddonsProps {
  products: Product[];
}

export function BagQuickAddons({ products }: BagQuickAddonsProps) {
  const { add, items } = useBag();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Pick 3 accessible add-ons from catalog
  const addonSlugs = [
    "velvet-sunset-rose-stem",
    "lavender-whisper-pearl-flower",
    "csk-dhoni-helicopter-jersey-keychain",
  ];

  const addonProducts = addonSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  if (!addonProducts.length) return null;

  function handleQuickAdd(p: Product) {
    const defaultColor = p.colors?.[0]?.name || "";
    const defaultVariants: Record<string, string> = {};
    if (p.variants?.length) {
      p.variants.forEach((v) => {
        if (v.options?.length) defaultVariants[v.name] = v.options[0];
      });
    }

    add(p, {
      quantity: 1,
      color: defaultColor,
      variants: defaultVariants,
      personalization: "",
    });

    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1800);
  }

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between text-xs font-sans">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9B1B54]">
          <Sparkles size={11} className="text-[#D8A657]" />
          <span>Complete Your Gift</span>
        </span>
        <span className="text-[10px] text-[#7E6875]">1-Tap Studio Add-ons</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {addonProducts.map((p) => {
          const isJustAdded = addedIds[p.id];
          const isAlreadyInBag = items.some((i) => i.productId === p.id);

          return (
            <div
              key={p.id}
              className="bg-[#FFFFFF] border border-[#F0E5EC] rounded-[6px] p-2 flex flex-col justify-between shadow-2xs hover:border-[#9B1B54]/40 transition-colors group"
            >
              <div className="relative aspect-square w-full rounded-[4px] overflow-hidden bg-[#FCF8FA] mb-1.5">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  sizes="90px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-0.5">
                <h5 className="font-serif text-[11.5px] text-[#200E19] leading-tight line-clamp-1 font-normal">
                  {p.name.replace(/CSK #7 Dhoni Helicopter Jersey Keychain/i, "CSK #7 Keychain")}
                </h5>
                <span className="text-[11px] font-sans font-semibold text-[#9B1B54] block">
                  {money(p.price)}
                </span>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => handleQuickAdd(p)}
                className={`mt-2 w-full py-1 px-1.5 rounded-[3px] text-[10px] font-sans font-semibold tracking-wider uppercase flex items-center justify-center gap-1 transition-all ${
                  isJustAdded
                    ? "bg-emerald-600 text-white"
                    : isAlreadyInBag
                    ? "bg-[#FAF2F7] text-[#9B1B54] border border-[#9B1B54]/30 hover:bg-[#9B1B54] hover:text-white"
                    : "bg-[#200E19] hover:bg-[#9B1B54] text-white"
                }`}
              >
                {isJustAdded ? (
                  <>
                    <Check size={10} />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus size={10} />
                    <span>{isAlreadyInBag ? "+ Add" : "Add"}</span>
                  </>
                )}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
