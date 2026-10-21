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
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#9B1B54] via-[#C8256E] to-[#D8A657] origin-left z-50 pointer-events-none"
    />
  );
}
