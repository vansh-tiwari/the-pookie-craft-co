"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronDown, Check, PenTool } from "lucide-react";
import { useBag } from "@/context/BagContext";

export function BagGiftNote() {
  const { giftNote, setGiftNote } = useBag();
  const [isOpen, setIsOpen] = useState(Boolean(giftNote));

  return (
    <div className="bg-[#FFFFFF] border border-[#F0E5EC] rounded-[6px] overflow-hidden shadow-2xs transition-colors hover:border-[#9B1B54]/30">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-sans text-[#200E19] hover:bg-[#FCF8FA] transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <Mail size={13} className="text-[#9B1B54] flex-shrink-0" />
          <span className="font-medium text-[#200E19]">
            Complimentary Handwritten Note
          </span>
          {giftNote.trim() && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#FAF2F7] text-[#9B1B54] text-[9.5px] font-semibold">
              <Check size={10} />
              <span>Added</span>
            </span>
          )}
        </span>
        <ChevronDown
          size={13}
          className={`text-[#7E6875] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[#F0E5EC]/80 bg-[#FCF8FA]/60 p-3.5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10.5px] font-sans text-[#7E6875]">
                <span className="inline-flex items-center gap-1">
                  <PenTool size={10} className="text-[#9B1B54]" />
                  <span>Penned on textured craft cardstock</span>
                </span>
                <span>{giftNote.length}/200</span>
              </div>
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value.slice(0, 200))}
                rows={3}
                placeholder="Write your personal message or special instructions (e.g. 'Happy Birthday Pookie! Love, Alex')..."
                className="w-full text-xs font-sans text-[#200E19] placeholder:text-[#9F8A96] bg-[#FFFFFF] border border-[#F0E5EC] focus:border-[#9B1B54] rounded-[4px] p-2.5 outline-none resize-none transition-colors"
              />
              <p className="text-[10px] font-sans text-[#7E6875] leading-relaxed">
                Tucked into your packaging with care. Automatically included in your WhatsApp enquiry.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
