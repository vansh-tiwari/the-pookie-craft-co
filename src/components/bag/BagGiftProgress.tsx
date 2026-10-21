"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles, CheckCircle2 } from "lucide-react";
import { money } from "@/lib/bag";

interface BagGiftProgressProps {
  subtotal: number;
  threshold?: number;
}

export function BagGiftProgress({
  subtotal,
  threshold = 799,
}: BagGiftProgressProps) {
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));
  const remaining = Math.max(0, threshold - subtotal);
  const isUnlocked = percentage >= 100;

  return (
    <div className="bg-[#FAF2F7]/80 border-b border-[#F0E5EC] px-4 py-3">
      <div className="flex items-center justify-between text-xs font-sans mb-1.5">
        <div className="flex items-center gap-1.5 font-medium">
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 text-[#9B1B54] font-semibold">
              <Sparkles size={13} className="text-[#D8A657] fill-[#D8A657]" />
              <span>Complimentary Studio Gift Box Unlocked!</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[#4A303F]">
              <Gift size={13} className="text-[#9B1B54]" />
              <span>
                Add <strong className="text-[#9B1B54] font-semibold">{money(remaining)}</strong> for Free Studio Gift Box & Ribbon
              </span>
            </span>
          )}
        </div>
        <span className="text-[11px] font-sans font-semibold text-[#7E6875]">
          {isUnlocked ? "100%" : `${percentage}%`}
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 rounded-full bg-[#EBDCE6] overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${
            isUnlocked
              ? "bg-gradient-to-r from-[#9B1B54] via-[#D8A657] to-[#10B981]"
              : "bg-gradient-to-r from-[#9B1B54] via-[#C8256E] to-[#D8A657]"
          }`}
        />
      </div>
    </div>
  );
}
