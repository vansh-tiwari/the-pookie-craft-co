"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

export function BrandCurtain() {
  const pathname = usePathname();
  const [stage, setStage] = useState<"animating" | "sliding" | "done">(() => {
    if (pathname !== "/") return "done";
    try {
      if (sessionStorage.getItem("hasSeenBrandOpening") === "true") {
        return "done";
      }
    } catch {}
    return "animating";
  });

  useEffect(() => {
    if (stage !== "animating") return;

    const slideTimer = setTimeout(() => {
      setStage("sliding");
    }, 1800);

    const doneTimer = setTimeout(() => {
      setStage("done");
      try {
        sessionStorage.setItem("hasSeenBrandOpening", "true");
      } catch {}
    }, 2500);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(doneTimer);
    };
  }, [stage]);

  if (stage === "done" || pathname !== "/") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="brand-curtain"
        initial={{ y: 0 }}
        animate={stage === "sliding" ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 h-[100dvh] w-screen z-[9999] bg-[#FEF7ED] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden border-b-2 border-[#967F4F]"
      >
        <div className="flex flex-col items-center justify-center text-center p-6 max-w-xs">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center space-y-3"
          >
            {/* Minimalist Yarn Needle Icon */}
            <div className="w-14 h-14 rounded-full border border-[#DCD1C1] bg-[#F6EFE3] flex items-center justify-center text-[#967F4F] shadow-sm">
              <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.8" />
                <path
                  d="M20 12C21.5 16 24 18.5 28 20C24 21.5 21.5 24 20 28C18.5 24 16 21.5 12 20C16 18.5 18.5 16 20 12Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" />
                <circle cx="32" cy="20" r="1.5" stroke="currentColor" strokeWidth="1" />
                <circle cx="20" cy="32" r="1.5" stroke="currentColor" strokeWidth="1" />
                <circle cx="8" cy="20" r="1.5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <span className="font-serif text-2xl font-light tracking-[0.2em] uppercase text-[#283C2A] block">
              {siteConfig.name}
            </span>
            <span className="font-serif text-[12px] italic text-[#967F4F] tracking-wider block">
              {siteConfig.tagline}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
