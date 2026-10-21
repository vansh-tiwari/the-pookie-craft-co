"use client";

import React, { useEffect, useState, useId } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Artisan craft petal SVG shapes
function CraftPetalShape({
  type,
  color,
  size = 24,
}: {
  type: number;
  color: string;
  size?: number;
}) {
  const filterId = useId();

  if (type === 0) {
    // Teardrop Sunflower/Rose Petal with soft chenille-inspired vein
    return (
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 24 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xs"
      >
        <path
          d="M12 2C17 7 22 15 20 23C18 29 14 31 12 31C10 31 6 29 4 23C2 15 7 7 12 2Z"
          fill={color}
          fillOpacity="0.85"
        />
        {/* Delicate inner petal vein */}
        <path
          d="M12 6C12 14 12 24 12 28"
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === 1) {
    // Rounded Blossom Petal with tactile curve
    return (
      <svg
        width={size * 1.1}
        height={size * 1.1}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xs"
      >
        <path
          d="M14 2C20 4 26 10 25 17C24 23 18 26 14 26C10 26 4 23 3 17C2 10 8 4 14 2Z"
          fill={color}
          fillOpacity="0.8"
        />
        <circle cx="14" cy="14" r="3" fill="#FFFFFF" fillOpacity="0.25" />
      </svg>
    );
  }

  if (type === 2) {
    // Slender Chenille Wire Floral Loop
    return (
      <svg
        width={size * 0.9}
        height={size * 1.4}
        viewBox="0 0 20 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 2C15 7 18 16 15 24C13 29 11 30 10 30C9 30 7 29 5 24C2 16 5 7 10 2Z"
          fill={color}
          fillOpacity="0.75"
        />
        <path
          d="M10 3C13.5 7.5 16 15 13.5 22C12 26 10.5 27 10 27"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="0.8"
        />
      </svg>
    );
  }

  // Type 3: Small Floating Florette / Bud
  return (
    <svg
      width={size * 1.2}
      height={size * 1.2}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="7" r="4" fill={color} fillOpacity="0.75" />
      <circle cx="17" cy="12" r="4" fill={color} fillOpacity="0.75" />
      <circle cx="12" cy="17" r="4" fill={color} fillOpacity="0.75" />
      <circle cx="7" cy="12" r="4" fill={color} fillOpacity="0.75" />
      <circle cx="12" cy="12" r="2.5" fill="#D8A657" fillOpacity="0.9" />
    </svg>
  );
}

interface PetalItem {
  id: number;
  initialX: number; // in %
  initialY: number; // in %
  type: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  swayAmount: number;
  rotateRange: number;
  opacity: number;
}

const PALETTE = [
  "#9B1B54", // Royal Magenta
  "#C8256E", // Vibrant Magenta
  "#D8A657", // Champagne Gold
  "#F59E0B", // Sunflower Gold
  "#E87A90", // Rose Velvet
  "#F472B6", // Blossom Pink
  "#A21CAF", // Deep Plum Petal
];

export function PetalsBackground() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mouse spring for gentle cursor ripple reaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  // Pre-configured petal distribution (deterministic values to prevent visual jump)
  const [petals] = useState<PetalItem[]>(() => {
    const items: PetalItem[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        initialX: 4 + (i * 94) / count + ((i * 17) % 7) - 3,
        initialY: 5 + ((i * 23) % 90),
        type: i % 4,
        color: PALETTE[i % PALETTE.length],
        size: 16 + (i % 3) * 6,
        duration: 14 + (i % 5) * 3,
        delay: (i * 0.7) % 5,
        swayAmount: 25 + (i % 4) * 15,
        rotateRange: 45 + (i % 4) * 30,
        opacity: 0.16 + (i % 3) * 0.08,
      });
    }
    return items;
  });

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    media.addEventListener("change", onMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse offset between -30px and +30px for subtle breeze impulse
      const nx = (e.clientX / window.innerWidth - 0.5) * 60;
      const ny = (e.clientY / window.innerHeight - 0.5) * 60;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {petals.map((petal) => {
        // Reduced motion: static subtle decorative placement
        if (prefersReducedMotion) {
          return (
            <div
              key={petal.id}
              style={{
                position: "absolute",
                left: `${petal.initialX}%`,
                top: `${petal.initialY}%`,
                opacity: petal.opacity * 0.7,
                transform: `rotate(${petal.id * 35}deg)`,
              }}
            >
              <CraftPetalShape
                type={petal.type}
                color={petal.color}
                size={petal.size}
              />
            </div>
          );
        }

        return (
          <motion.div
            key={petal.id}
            initial={{
              x: 0,
              y: 0,
              rotate: 0,
              scale: 0.9,
              opacity: petal.opacity,
            }}
            animate={{
              // Gentle organic drift: sine sway x, floating drift y, continuous 3D rotation
              x: [
                -petal.swayAmount,
                petal.swayAmount * 0.8,
                -petal.swayAmount * 0.5,
                petal.swayAmount,
                -petal.swayAmount,
              ],
              y: [-15, 20, -10, 25, -15],
              rotate: [
                -petal.rotateRange,
                petal.rotateRange * 0.7,
                -petal.rotateRange * 0.5,
                petal.rotateRange,
                -petal.rotateRange,
              ],
              rotateX: [0, 25, 0, -25, 0],
              rotateY: [0, 30, 0, -30, 0],
              scale: [0.95, 1.05, 0.92, 1.02, 0.95],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: `${petal.initialX}%`,
              top: `${petal.initialY}%`,
              // Add slight interactive cursor breeze displacement
              translateX: springX,
              translateY: springY,
              willChange: "transform",
            }}
          >
            <CraftPetalShape
              type={petal.type}
              color={petal.color}
              size={petal.size}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
