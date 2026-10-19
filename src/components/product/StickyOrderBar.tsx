"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { getWhatsAppCheckoutUrl, formatOrderNumber } from "@/utils/orderPayload";

interface StickyOrderBarProps {
  product: Product;
  selectedVariant?: string;
  selectedColor?: string;
}

export function StickyOrderBar({
  product,
  selectedVariant,
  selectedColor,
}: StickyOrderBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image_url,
      variant: selectedVariant,
      color: selectedColor,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 450);
  };

  const handleDirectWhatsApp = () => {
    const orderNumber = formatOrderNumber();
    const url = getWhatsAppCheckoutUrl({
      orderNumber,
      customer: {
        name: "Valued Patron",
        phone: "Direct Inquirer",
        address: "To be confirmed in chat",
        city: "",
        state: "",
        pincode: "",
        notes: `Selected edition: ${selectedVariant || "Standard"}`,
      },
      items: [
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image_url,
          variant: selectedVariant,
          color: selectedColor,
          quantity: 1,
        },
      ],
      subtotal: product.price,
      shipping:
        product.price >= siteConfig.shipping.freeThreshold
          ? 0
          : siteConfig.shipping.flatRate,
      total:
        product.price >= siteConfig.shipping.freeThreshold
          ? product.price
          : product.price + siteConfig.shipping.flatRate,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FEF7ED]/95 backdrop-blur-md border-t border-[#DCD1C1] shadow-2xl py-3 px-4 sm:px-6 transition-transform duration-300">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Product Thumbnail & Price */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative w-11 h-11 rounded-sm overflow-hidden bg-[#F6EFE3] flex-shrink-0 border border-[#DCD1C1]">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif text-sm font-normal text-[#283C2A] truncate">
              {product.name}
            </h4>
            <p className="font-serif text-xs text-[#283C2A] font-light">
              {siteConfig.currency.symbol}{product.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleAdd}
            className="btn-secondary py-2.5 px-4 text-xs tracking-wider"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#967F4F]" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="hidden sm:inline">Add to Bag</span>
              </>
            )}
          </button>

          <button
            onClick={handleDirectWhatsApp}
            className="btn-primary py-2.5 px-4 text-xs tracking-wider flex items-center space-x-1.5 shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#967F4F]" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
