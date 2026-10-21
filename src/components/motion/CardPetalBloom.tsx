"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types";

interface CardPetalBloomProps {
  isHovered: boolean;
  product?: Product;
  className?: string;
}

export function CardPetalBloom({
  isHovered,
  product,
  className = "",
}: CardPetalBloomProps) {
  // Determine petal colors based on product category / title for magical customization
  const slug = (product?.slug || "").toLowerCase();
  const name = (product?.name || "").toLowerCase();

  let primaryColor = "#9B1B54"; // Royal Magenta default
  let secondaryColor = "#D8A657"; // Champagne Gold
  let tertiaryColor = "#C8256E"; // Vibrant Magenta

  if (slug.includes("sunflower") || name.includes("sunflower")) {
    primaryColor = "#F59E0B"; // Sunflower Gold
    secondaryColor = "#D8A657"; // Warm Honey
    tertiaryColor = "#9B1B54"; // Royal Magenta center
  } else if (slug.includes("rose") || name.includes("rose")) {
    primaryColor = "#BE123C"; // Ruby Red
    secondaryColor = "#9B1B54"; // Royal Magenta
    tertiaryColor = "#FB7185"; // Velvet Pink
  } else if (slug.includes("lavender") || name.includes("lavender")) {
    primaryColor = "#A855F7"; // Pastel Lilac
    secondaryColor = "#C084FC"; // Whisper Violet
    tertiaryColor = "#9B1B54"; // Royal Magenta
  } else if (slug.includes("lamp") || slug.includes("lumiflower")) {
    primaryColor = "#FBBF24"; // Amber Glow
    secondaryColor = "#F472B6"; // Blossom Glow
    tertiaryColor = "#D8A657"; // Champagne Gold
  } else if (slug.includes("csk") || slug.includes("dhoni")) {
    primaryColor = "#FACC15"; // Whistle Podu Yellow
    secondaryColor = "#9B1B54"; // Royal Magenta
    tertiaryColor = "#D8A657"; // Gold
  }

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-10 overflow-visible ${className}`}
    >
      {/* =========================================================
          TOP-RIGHT BLOOM CLUSTER (Unfurls on Hover)
      ========================================================= */}
      <div className="absolute -top-1 -right-1 overflow-visible">
        {/* Petal 1: Center Blossom */}
        <motion.div
          initial={false}
          animate={
            isHovered
              ? {
                  x: 12,
                  y: -12,
                  rotate: 42,
                  scale: 1,
                  opacity: 1,
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 0,
                }
          }
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
            mass: 0.6,
          }}
          className="absolute origin-bottom-left"
          style={{ willChange: "transform, opacity" }}
        >
          <svg
            width="26"
            height="34"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            <path
              d="M12 2C17 7 22 15 20 23C18 29 14 31 12 31C10 31 6 29 4 23C2 15 7 7 12 2Z"
              fill={primaryColor}
            />
            {/* Tactile chenille wire core rib */}
            <path
              d="M12 5C12 14 12 24 12 29"
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Petal 2: Right Fanned Blossom */}
        <motion.div
          initial={false}
          animate={
            isHovered
              ? {
                  x: 16,
                  y: -2,
                  rotate: 72,
                  scale: 0.88,
                  opacity: 0.95,
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 0,
                }
          }
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 17,
            mass: 0.6,
            delay: 0.03,
          }}
          className="absolute origin-bottom-left"
          style={{ willChange: "transform, opacity" }}
        >
          <svg
            width="22"
            height="30"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            <path
              d="M12 2C17 7 22 15 20 23C18 29 14 31 12 31C10 31 6 29 4 23C2 15 7 7 12 2Z"
              fill={secondaryColor}
            />
            <path
              d="M12 6C12 14 12 24 12 28"
              stroke="#FFFFFF"
              strokeOpacity="0.4"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Petal 3: Upper Fanned Blossom */}
        <motion.div
          initial={false}
          animate={
            isHovered
              ? {
                  x: 3,
                  y: -16,
                  rotate: 15,
                  scale: 0.84,
                  opacity: 0.92,
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 0,
                }
          }
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 17,
            mass: 0.6,
            delay: 0.05,
          }}
          className="absolute origin-bottom-left"
          style={{ willChange: "transform, opacity" }}
        >
          <svg
            width="22"
            height="30"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            <path
              d="M12 2C17 7 22 15 20 23C18 29 14 31 12 31C10 31 6 29 4 23C2 15 7 7 12 2Z"
              fill={tertiaryColor}
            />
            <path
              d="M12 6C12 14 12 24 12 28"
              stroke="#FFFFFF"
              strokeOpacity="0.4"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Central Floral Pistil Node */}
        <motion.div
          initial={false}
          animate={
            isHovered
              ? { scale: 1, opacity: 1 }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 20,
            delay: 0.06,
          }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#D8A657] border border-white shadow-xs"
        />
      </div>

      {/* =========================================================
          BOTTOM-LEFT LEAF & PETAL ACCENT
      ========================================================= */}
      <div className="absolute -bottom-1 -left-1 overflow-visible">
        {/* Botanical Sage Chenille Leaf */}
        <motion.div
          initial={false}
          animate={
            isHovered
              ? {
                  x: -12,
                  y: 10,
                  rotate: -52,
                  scale: 0.9,
                  opacity: 0.9,
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 0,
                }
          }
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 18,
            mass: 0.6,
            delay: 0.04,
          }}
          className="absolute origin-top-right"
          style={{ willChange: "transform, opacity" }}
        >
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-xs"
          >
            <path
              d="M10 2C15 6 19 13 17 20C15 25 12 27 10 27C8 27 5 25 3 20C1 13 5 6 10 2Z"
              fill="#3D6B52" // Botanical Sage leaf
            />
            <path
              d="M10 4C10 12 10 20 10 25"
              stroke="#FFFFFF"
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Small Companion Petal */}
        <motion.div
          initial={false}
          animate={
            isHovered
              ? {
                  x: -6,
                  y: 14,
                  rotate: -20,
                  scale: 0.78,
                  opacity: 0.85,
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 0,
                }
          }
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 18,
            mass: 0.6,
            delay: 0.06,
          }}
          className="absolute origin-top-right"
          style={{ willChange: "transform, opacity" }}
        >
          <svg
            width="18"
            height="24"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C17 7 22 15 20 23C18 29 14 31 12 31C10 31 6 29 4 23C2 15 7 7 12 2Z"
              fill={primaryColor}
            />
          </svg>
        </motion.div>
      </div>

      {/* =========================================================
          GENTLE FLUTTER PETAL DRIFT ON HOVER
      ========================================================= */}
      {isHovered && (
        <motion.div
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            scale: 0.6,
            opacity: 0,
          }}
          animate={{
            x: [0, 16, 28],
            y: [0, -22, -45],
            rotate: [0, 35, 75],
            scale: [0.6, 1, 0.7],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          className="absolute top-2 right-2"
          style={{ willChange: "transform, opacity" }}
        >
          <svg
            width="16"
            height="22"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-xs"
          >
            <path
              d="M12 2C17 7 22 15 20 23C18 29 14 31 12 31C10 31 6 29 4 23C2 15 7 7 12 2Z"
              fill={secondaryColor}
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
}
