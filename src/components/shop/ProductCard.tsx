"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import type { Product } from "@/types";
import { availability, priceLabel } from "@/lib/catalog-types";

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
  const status = availability(product);
  const isSoldOut = status === "Sold Out";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="group relative bg-[#FCFBF9] rounded-[4px] border border-[#E8E2D8] hover:border-[#967F4F]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-atelier"
    >
      {/* Product Image Link Container with guaranteed 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] w-full min-h-[200px] overflow-hidden bg-[#F2EDE4]">
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
        </Link>

        {/* Quiet Luxury Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.bestseller && (
            <span className="px-2 py-0.5 text-[9.5px] font-sans font-semibold uppercase tracking-[0.16em] bg-[#1C281F] text-[#FAF7F2] rounded-[2px] shadow-xs">
              Bestseller
            </span>
          )}
          {status !== "Available" && (
            <span
              className={`px-2 py-0.5 text-[9.5px] font-sans font-medium uppercase tracking-[0.12em] rounded-[2px] backdrop-blur-xs ${
                status === "Made to Order"
                  ? "bg-[#FAF7F2]/95 text-[#967F4F] border border-[#967F4F]/30"
                  : "bg-[#FAF7F2]/95 text-[#667264] border border-[#E8E2D8]"
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
            className="hidden sm:inline-flex absolute bottom-3 right-3 z-10 px-2.5 py-1.5 bg-[#FAF7F2]/95 hover:bg-[#1C281F] text-[#1C281F] hover:text-[#FAF7F2] text-[10px] font-sans font-semibold tracking-[0.14em] uppercase rounded-[2px] border border-[#E8E2D8] shadow-sm backdrop-blur-xs transition-all duration-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 items-center gap-1.5"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={12} />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#667264] mb-1">
            {product.category}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-[16px] sm:text-[17px] text-[#1C281F] font-normal leading-snug line-clamp-1 hover:text-[#967F4F] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E8E2D8]/70">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[14px] sm:text-[15px] font-sans font-semibold text-[#1C281F]">
              {priceLabel(product)}
            </span>
            <span className="text-[10.5px] font-sans text-[#667264]">
              {status === "Available" ? "In Studio" : status}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="w-full py-2 px-3 text-center text-[11px] font-sans font-semibold tracking-[0.14em] uppercase rounded-[2px] border border-[#1C281F] text-[#1C281F] hover:bg-[#1C281F] hover:text-[#FAF7F2] transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>{isSoldOut ? "Ask About Restock" : "Choose Options"}</span>
              <span aria-hidden="true" className="text-xs">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
