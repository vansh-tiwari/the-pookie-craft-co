"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { whatsappLink } from "@/config/site";

export function InformationPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#FAF7F2] text-[#1C281F] min-h-screen pt-28 sm:pt-36 pb-24">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="breadcrumb !mb-6" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span className="text-[#1C281F] font-medium">{title}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12 border-b border-[#E8E2D8] pb-8">
          <span className="eyebrow">Studio Client Concierge</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C281F] font-normal tracking-tight mt-1 mb-4">
            {title}
          </h1>
          <p className="text-base sm:text-lg font-sans text-[#5D685B] font-light leading-relaxed max-w-2xl">
            {intro}
          </p>
        </div>

        {/* Interactive Accordion / Cards */}
        <div className="space-y-4 mb-16">
          {sections.map((s, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] overflow-hidden transition-all duration-200 hover:border-[#967F4F]/50 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[11px] font-sans font-semibold text-[#967F4F] flex items-center justify-center flex-shrink-0">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl text-[#1C281F] font-normal leading-snug">
                      {s.title}
                    </h2>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-[#967F4F] transition-transform duration-300 flex-shrink-0 ${
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
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-[15px] font-sans text-[#5D685B] leading-relaxed border-t border-[#E8E2D8]/60 pl-16">
                        {s.text}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Studio Concierge Callout Box */}
        <div className="bg-[#FCFBF9] border border-[#967F4F]/30 rounded-[6px] p-8 sm:p-10 text-center relative overflow-hidden shadow-atelier">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#967F4F]/40 flex items-center justify-center mx-auto text-[#967F4F]">
              <Sparkles size={22} />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1C281F] font-normal">
              Need personalized assistance?
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#5D685B] leading-relaxed">
              Every creation is sculpted by hand in our India studio. If you have questions about specific custom palettes, rush delivery, or made-to-order inquiries, we’d love to chat.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappLink("Hello! I have a question regarding The Pookie Craft Co. policies or a custom order.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all"
              >
                <MessageCircle size={14} />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-6 py-3 border border-[#E8E2D8] hover:border-[#1C281F] text-[#1C281F] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] transition-colors"
              >
                <span>Visit Contact Studio</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
