"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Eye } from "lucide-react";
import type { Product } from "@/types";
import { availability, priceLabel } from "@/lib/catalog-types";
import { CardPetalBloom } from "@/components/motion/CardPetalBloom";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  priority = false,
  onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const status = availability(product);
  const isSoldOut = status === "Sold Out";

  // Tactile 3D Tilt calculations
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3.5deg", "-3.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3.5deg", "3.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative bg-[#FFFFFF] rounded-[4px] border border-[#F0E5EC] hover:border-[#9B1B54]/50 overflow-visible flex flex-col justify-between transition-colors duration-300 hover:shadow-atelier"
    >
      {/* Interactive Blossoming Petals on Hover */}
      <CardPetalBloom isHovered={isHovered} product={product} />

      {/* Product Image Link Container with 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] w-full min-h-[200px] overflow-hidden rounded-t-[3px] bg-[#FCF8FA]">
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full relative"
          aria-label={`View details for ${product.name}`}
        >
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Soft velvet shimmer sheen on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#9B1B54]/0 via-[#FFFFFF]/0 to-[#FFFFFF]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Link>

        {/* Quiet Luxury Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.bestseller && (
            <span className="px-2 py-0.5 text-[9.5px] font-sans font-semibold uppercase tracking-[0.16em] bg-[#200E19] text-[#FCF8FA] rounded-[2px] shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8A657]" />
              Bestseller
            </span>
          )}
          {status !== "Available" && (
            <span
              className={`px-2 py-0.5 text-[9.5px] font-sans font-medium uppercase tracking-[0.12em] rounded-[2px] backdrop-blur-xs ${
                status === "Made to Order"
                  ? "bg-[#FDF2F7] text-[#9B1B54] border border-[#F0E5EC]"
                  : "bg-[#FCF8FA]/95 text-[#7E6875] border border-[#F0E5EC]"
              }`}
            >
              {status}
            </span>
          )}
        </div>

        {/* Quick View Button on Desktop Hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="hidden sm:inline-flex absolute bottom-3 right-3 z-10 px-2.5 py-1.5 bg-[#FCF8FA]/95 hover:bg-[#9B1B54] text-[#200E19] hover:text-[#FFFFFF] text-[10px] font-sans font-semibold tracking-[0.14em] uppercase rounded-[2px] border border-[#F0E5EC] shadow-sm backdrop-blur-xs transition-all duration-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 items-center gap-1.5 cursor-pointer"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={12} />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 relative z-10 bg-[#FFFFFF] rounded-b-[4px]">
        <div>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#7E6875] mb-1">
            {product.category}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-[16px] sm:text-[17px] text-[#200E19] font-normal leading-snug line-clamp-1 hover:text-[#9B1B54] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-[#F0E5EC]/80">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[14px] sm:text-[15px] font-sans font-semibold text-[#200E19]">
              {priceLabel(product)}
            </span>
            <span
              className={`text-[10.5px] font-sans ${
                status === "Available"
                  ? "text-[#3D6B52] font-medium"
                  : "text-[#7E6875]"
              }`}
            >
              {status === "Available" ? "In Studio" : status}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="w-full py-2 px-3 text-center text-[11px] font-sans font-semibold tracking-[0.14em] uppercase rounded-[2px] border border-[#9B1B54] text-[#9B1B54] hover:bg-[#9B1B54] hover:text-[#FFFFFF] transition-all duration-200 flex items-center justify-center gap-1.5 group/btn"
            >
              <span>{isSoldOut ? "Ask About Restock" : "Choose Options"}</span>
              <motion.span
                animate={
                  isHovered ? { rotate: 45, scale: 1.15 } : { rotate: 0, scale: 1 }
                }
                transition={{ duration: 0.25 }}
                aria-hidden="true"
                className="text-xs inline-block"
              >
                ↗
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
