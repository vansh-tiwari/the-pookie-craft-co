"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function LuxuryScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#967F4F] via-[#C29F58] to-[#967F4F] origin-left z-50 pointer-events-none"
    />
  );
}
