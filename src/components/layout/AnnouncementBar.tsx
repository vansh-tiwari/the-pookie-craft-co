import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  return (
    <div className="bg-[#283C2A] text-[#FEF7ED] text-[11px] font-sans font-light tracking-[0.16em] uppercase py-2 px-4 text-center border-b border-[#967F4F]/30 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span>🌸 Turning pipe cleaners into petals</span>
        <span className="text-[#967F4F]">●</span>
        <span className="hidden sm:inline">
          Complimentary shipping across India over {siteConfig.currency.symbol}
          {siteConfig.shipping.freeThreshold}
        </span>
        <span className="text-[#967F4F] hidden sm:inline">●</span>
        <Link
          href="/shop"
          className="underline hover:text-[#967F4F] transition-colors font-medium ml-1"
        >
          Shop Drops
        </Link>
      </div>
    </div>
  );
}
