import React from "react";

interface ChenilleWireMotifProps {
  className?: string;
  variant?: "horizontal" | "corner" | "loop" | "flourish";
  strokeColor?: string;
  petalColor?: string;
}

export function ChenilleWireMotif({
  className = "",
  variant = "horizontal",
  strokeColor = "#682B43",
  petalColor = "#E6B94A",
}: ChenilleWireMotifProps) {
  if (variant === "loop") {
    return (
      <svg
        viewBox="0 0 160 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block overflow-visible ${className}`}
        aria-hidden="true"
      >
        {/* Tactile Chenille Wire Curve resolving into a petal loop */}
        <path
          d="M4 42 C 40 42, 60 12, 85 14 C 110 16, 115 48, 92 46 C 70 44, 75 16, 120 18 C 140 19, 150 28, 156 30"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 0"
        />
        {/* Handcrafted Chenille Petal Knot */}
        <circle cx="88" cy="22" r="5" fill={petalColor} />
        <circle cx="98" cy="28" r="4.5" fill={strokeColor} fillOpacity="0.8" />
        <circle cx="156" cy="30" r="3.5" fill={petalColor} />
      </svg>
    );
  }

  if (variant === "corner") {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M10 90 Q 15 35, 55 30 T 90 10"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="90" cy="10" r="4" fill={petalColor} />
        <path
          d="M85 8 Q 92 2, 95 9 Q 97 16, 90 12 Z"
          fill={strokeColor}
          opacity="0.9"
        />
      </svg>
    );
  }

  if (variant === "flourish") {
    return (
      <svg
        viewBox="0 0 240 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M6 22 C 50 22, 70 8, 105 10 C 135 12, 145 32, 165 24 C 185 16, 210 20, 234 20"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Petal cluster */}
        <circle cx="105" cy="10" r="4" fill={petalColor} />
        <circle cx="165" cy="24" r="3.5" fill={strokeColor} />
        <circle cx="234" cy="20" r="4" fill={petalColor} />
      </svg>
    );
  }

  // Default horizontal wire-to-petal divider
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 180 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-44 h-8 overflow-visible"
      >
        <path
          d="M4 16 C 45 16, 65 6, 95 8 C 120 10, 130 26, 148 18 C 160 13, 170 16, 176 16"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Soft velvet loop petal */}
        <ellipse cx="96" cy="8" rx="4.5" ry="4" fill={petalColor} />
        <circle cx="148" cy="18" r="3.5" fill={strokeColor} />
        <circle cx="176" cy="16" r="3" fill={petalColor} />
      </svg>
    </div>
  );
}
