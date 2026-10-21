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
    <div className="bg-[#FCF8FA] text-[#200E19] min-h-screen pt-28 sm:pt-36 pb-24">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="breadcrumb !mb-6" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span className="text-[#200E19] font-medium">{title}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12 border-b border-[#F0E5EC] pb-8">
          <span className="eyebrow">Studio Client Concierge</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#200E19] font-normal tracking-tight mt-1 mb-4">
            {title}
          </h1>
          <p className="text-base sm:text-lg font-sans text-[#4A303F] font-light leading-relaxed max-w-2xl">
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
                className="bg-[#FFFFFF] border border-[#F0E5EC] rounded-[6px] overflow-hidden transition-all duration-200 hover:border-[#9B1B54]/50 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#FCF8FA] border border-[#F0E5EC] text-[11px] font-sans font-semibold text-[#9B1B54] flex items-center justify-center flex-shrink-0">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl text-[#200E19] font-normal leading-snug">
                      {s.title}
                    </h2>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-[#9B1B54] transition-transform duration-300 flex-shrink-0 ${
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
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-[15px] font-sans text-[#4A303F] leading-relaxed border-t border-[#F0E5EC]/80 pl-16">
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
        <div className="bg-[#FFFFFF] border border-[#9B1B54]/30 rounded-[6px] p-8 sm:p-10 text-center relative overflow-hidden shadow-atelier">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FCF8FA] border border-[#9B1B54]/40 flex items-center justify-center mx-auto text-[#9B1B54]">
              <Sparkles size={22} />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#200E19] font-normal">
              Need personalized assistance?
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#4A303F] leading-relaxed">
              Every creation is sculpted by hand in our India studio. If you have questions about specific custom palettes, rush delivery, or made-to-order inquiries, we’d love to chat.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappLink("Hello! I have a question regarding The Pookie Craft Co. policies or a custom order.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#9B1B54] hover:bg-[#7D1342] text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all"
              >
                <MessageCircle size={14} />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-6 py-3 border border-[#9B1B54] hover:bg-[#9B1B54] hover:text-[#FFFFFF] text-[#9B1B54] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] transition-colors"
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
