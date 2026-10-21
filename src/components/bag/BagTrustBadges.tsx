"use client";

import React from "react";
import { Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";

export function BagTrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#F0E5EC]/80 text-center">
      <div className="p-1.5 rounded-[4px] bg-[#FAF2F7]/60 border border-[#F0E5EC]/60">
        <Sparkles size={11} className="text-[#D8A657] mx-auto mb-0.5" />
        <span className="text-[9.5px] font-sans font-medium text-[#4A303F] block leading-tight">
          Never Wilts
        </span>
      </div>
      <div className="p-1.5 rounded-[4px] bg-[#FAF2F7]/60 border border-[#F0E5EC]/60">
        <HeartHandshake size={11} className="text-[#9B1B54] mx-auto mb-0.5" />
        <span className="text-[9.5px] font-sans font-medium text-[#4A303F] block leading-tight">
          Hand-Sculpted
        </span>
      </div>
      <div className="p-1.5 rounded-[4px] bg-[#FAF2F7]/60 border border-[#F0E5EC]/60">
        <ShieldCheck size={11} className="text-emerald-700 mx-auto mb-0.5" />
        <span className="text-[9.5px] font-sans font-medium text-[#4A303F] block leading-tight">
          Crush-Proof Box
        </span>
      </div>
    </div>
  );
}
