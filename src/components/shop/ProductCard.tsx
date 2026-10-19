import React from "react";
import Image from "next/image";
import Link from "next/link";
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
    <article className="group relative bg-[#FFFDF9] rounded-lg border border-[#E4DDD2] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#682B43]/30">
      {/* Product Image Link */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-[#F6F0E6]/60">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.bestseller && (
            <span className="px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-[0.14em] bg-[#682B43] text-[#F6F0E6] rounded-xs shadow-xs">
              Bestseller
            </span>
          )}
          {status !== "Available" && (
            <span
              className={`px-2 py-0.5 text-[10px] font-sans font-medium uppercase tracking-[0.1em] rounded-xs backdrop-blur-xs ${
                status === "Made to Order"
                  ? "bg-amber-100/90 text-amber-900 border border-amber-200"
                  : "bg-stone-100/90 text-stone-700 border border-stone-200"
              }`}
            >
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          <p className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#667062] mb-1">
            {product.category}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-base sm:text-lg text-[#252923] font-normal leading-snug line-clamp-2 hover:text-[#682B43] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E4DDD2]/60">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm sm:text-base font-sans font-semibold text-[#252923]">
              {priceLabel(product)}
            </span>
            <span className="text-[11px] font-sans text-[#667062]">
              {status === "Available" ? "In Studio" : status}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="w-full py-2 px-3 text-center text-xs font-sans font-semibold tracking-[0.12em] uppercase rounded-md border border-[#252923] text-[#252923] hover:bg-[#682B43] hover:text-[#F6F0E6] hover:border-[#682B43] transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>{isSoldOut ? "Ask About Restock" : "Choose Options"}</span>
              <span aria-hidden="true" className="text-xs">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
