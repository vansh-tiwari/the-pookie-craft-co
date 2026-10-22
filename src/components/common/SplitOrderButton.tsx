"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function InstagramGlyph({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface SplitOrderButtonProps {
  onWhatsApp: () => void;
  onInstagram: () => void;
  disabled?: boolean;
  className?: string;
  whatsAppLabelExpanded?: string;
  whatsAppLabelCollapsed?: string;
  instagramLabelExpanded?: string;
  instagramLabelCollapsed?: string;
  size?: "default" | "compact";
}

export function SplitOrderButton({
  onWhatsApp,
  onInstagram,
  disabled = false,
  className = "",
  whatsAppLabelExpanded = "Order on WhatsApp",
  whatsAppLabelCollapsed = "WhatsApp",
  instagramLabelExpanded = "Order on Instagram",
  instagramLabelCollapsed = "Instagram",
  size = "default",
}: SplitOrderButtonProps) {
  const [hovered, setHovered] = useState<"whatsapp" | "instagram" | null>(null);

  // 70/30 split logic:
  // If user hovers on Instagram: WhatsApp shrinks to 30%, Instagram expands to 70%
  // Otherwise (unhovered or hovered on WhatsApp): WhatsApp is 70%, Instagram is 30%
  const isInstagramActive = hovered === "instagram";
  const whatsAppRatio = isInstagramActive ? 30 : 70;
  const instagramRatio = isInstagramActive ? 70 : 30;

  const py = size === "compact" ? "py-2.5" : "py-3.5";
  const fontSize = size === "compact" ? "text-[11px]" : "text-xs";

  return (
    <div className={`relative flex items-center gap-1.5 w-full select-none ${className}`}>
      {/* WhatsApp Button (70% Default, 30% on IG hover) */}
      <motion.button
        type="button"
        layout
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={onWhatsApp}
        onMouseEnter={() => setHovered("whatsapp")}
        onMouseLeave={() => setHovered(null)}
        disabled={disabled}
        style={{
          width: `${whatsAppRatio}%`,
          transition: "width 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`${py} px-3 rounded-[3px] bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:brightness-105 active:brightness-95 text-white ${fontSize} font-sans font-semibold tracking-[0.12em] uppercase shadow-sm flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Send direct order enquiry on WhatsApp"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle size={16} className="text-white fill-white/20 shrink-0" />
        <span className="truncate whitespace-nowrap">
          {whatsAppRatio >= 50 ? whatsAppLabelExpanded : whatsAppLabelCollapsed}
        </span>
        <span className="shrink-0 text-white/80 text-[11px]">↗</span>
      </motion.button>

      {/* Instagram Button (30% Default, 70% on IG hover) */}
      <motion.button
        type="button"
        layout
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={onInstagram}
        onMouseEnter={() => setHovered("instagram")}
        onMouseLeave={() => setHovered(null)}
        disabled={disabled}
        style={{
          width: `${instagramRatio}%`,
          transition: "width 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`${py} px-3 rounded-[3px] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:brightness-105 active:brightness-95 text-white ${fontSize} font-sans font-semibold tracking-[0.12em] uppercase shadow-sm flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Send direct order enquiry via Instagram DM"
        aria-label="Order on Instagram"
      >
        <InstagramGlyph className="w-4 h-4 shrink-0 text-white" />
        <span className="truncate whitespace-nowrap">
          {instagramRatio >= 50 ? instagramLabelExpanded : instagramLabelCollapsed}
        </span>
        <span className="shrink-0 text-white/80 text-[11px]">↗</span>
      </motion.button>
    </div>
  );
}
