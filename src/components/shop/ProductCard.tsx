"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const displayImage = isHovered && product.images[1] ? product.images[1] : product.image_url;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image_url,
      variant: product.variants?.[0]?.options[0],
      color: product.colors?.[0]?.name,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 450);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="group relative flex flex-col bg-[#FFFDF9] rounded-sm overflow-hidden border border-[#DCD1C1] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-organic"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Subtle Zoom */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6EFE3] block"
      >
        <Image
          src={displayImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Quiet Luxury Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.bestseller && (
            <span className="px-2.5 py-1 bg-[#283C2A] text-[#FEF7ED] text-[10px] font-sans tracking-[0.15em] uppercase rounded-xs shadow-xs">
              Bestseller
            </span>
          )}
          {discountPercentage && (
            <span className="px-2.5 py-1 bg-[#967F4F] text-[#FEF7ED] text-[10px] font-sans tracking-[0.15em] uppercase rounded-xs shadow-xs">
              Save {discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex gap-2 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={!product.in_stock}
            className={`flex-1 py-2.5 px-3 rounded-xs text-[11px] font-sans tracking-[0.16em] uppercase flex items-center justify-center space-x-2 transition-all duration-300 shadow-md ${
              isAdded
                ? "bg-[#967F4F] text-[#FEF7ED]"
                : "bg-[#283C2A]/95 hover:bg-[#283C2A] text-[#FEF7ED] backdrop-blur-xs"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#FEF7ED]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#FEF7ED]" strokeWidth={1.5} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Card Info Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          {/* Category Tag */}
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#967F4F] font-medium">
            {product.category}
          </p>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="block font-serif text-[17px] text-[#283C2A] group-hover:text-[#967F4F] transition-colors duration-200 line-clamp-1 leading-snug font-normal"
          >
            {product.name}
          </Link>

          {/* Material Subtitle */}
          {product.material && (
            <p className="text-xs text-[#687060] font-sans font-light line-clamp-1">
              {product.material}
            </p>
          )}
        </div>

        {/* Price & Mobile Add */}
        <div className="pt-3 border-t border-[#DCD1C1]/60 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-[17px] font-normal text-[#283C2A]">
              {siteConfig.currency.symbol}{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#687060]/60 line-through font-sans font-light">
                {siteConfig.currency.symbol}{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Mobile quick add button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 rounded-xs bg-[#283C2A] text-[#FEF7ED] hover:bg-[#967F4F] transition-colors"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
