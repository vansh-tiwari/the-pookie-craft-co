"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    total,
    openCheckout,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const freeShippingThreshold = siteConfig.shipping.freeThreshold;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#1A281B]/60 backdrop-blur-xs z-50 transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FEF7ED] shadow-2xl flex flex-col border-l border-[#DCD1C1]"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#DCD1C1] flex items-center justify-between bg-[#F6EFE3]">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-serif text-[#283C2A] tracking-wide font-light">
                  Your Studio Bag
                </span>
                <span className="text-xs font-sans bg-[#283C2A] text-[#FEF7ED] px-2 py-0.5 rounded-full font-medium">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-[#687060] hover:text-[#283C2A] rounded-full hover:bg-[#FEF7ED] transition-colors cursor-pointer"
                aria-label="Close shopping bag"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-3.5 bg-[#F6EFE3]/60 border-b border-[#DCD1C1] text-xs">
              {remainingForFreeShipping > 0 ? (
                <div>
                  <p className="text-[#283C2A] font-light mb-1.5 flex items-center justify-between">
                    <span>
                      Add <span className="font-medium text-[#967F4F]">{siteConfig.currency.symbol}{remainingForFreeShipping.toLocaleString("en-IN")}</span> more for Free Studio Shipping
                    </span>
                    <span className="text-[#687060] font-sans text-[11px]">
                      {Math.round(progressToFreeShipping)}%
                    </span>
                  </p>
                  <div className="w-full bg-[#DCD1C1]/60 h-1 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-[#283C2A] h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToFreeShipping}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 text-[#283C2A] font-light">
                  <Sparkles className="w-4 h-4 text-[#967F4F]" />
                  <span>You qualify for complimentary studio delivery across India.</span>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-[#DCD1C1]/60">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-[#F6EFE3] border border-[#DCD1C1] flex items-center justify-center mb-4 text-[#967F4F]">
                    <ShoppingBag className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl text-[#283C2A] mb-2 font-light">
                    Your bag is waiting to be filled
                  </h3>
                  <p className="text-sm text-[#687060] max-w-xs mb-6 font-sans font-light">
                    Each creation in our studio is sculpted slowly by hand. Discover our forever flower and keychain drops.
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-primary px-8 py-3 text-xs tracking-[0.16em]"
                  >
                    Explore Handcrafted Drops
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.variant || ""}`} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 rounded-sm overflow-hidden bg-[#F6EFE3] flex-shrink-0 border border-[#DCD1C1]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="font-serif text-base text-[#283C2A] hover:text-[#967F4F] transition-colors line-clamp-1 font-normal"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id, item.variant)}
                            className="text-[#687060] hover:text-red-700 p-1 transition-colors cursor-pointer"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.variant && (
                          <p className="text-[11px] text-[#687060] font-sans font-light mt-0.5">
                            Option: {item.variant}
                          </p>
                        )}

                        <p className="text-sm font-normal text-[#283C2A] mt-1 font-serif">
                          {siteConfig.currency.symbol}
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center border border-[#DCD1C1] rounded-sm bg-[#FFFDF9]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                            className="p-1 hover:bg-[#F6EFE3] text-[#283C2A] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-sans font-medium text-[#283C2A]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                            className="p-1 hover:bg-[#F6EFE3] text-[#283C2A] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#687060] font-sans font-light">
                          ({siteConfig.currency.symbol}{item.price.toLocaleString("en-IN")} each)
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-6 bg-[#F6EFE3] border-t border-[#DCD1C1] space-y-3">
                <div className="space-y-1.5 text-xs text-[#687060] font-sans font-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#283C2A] font-medium font-serif text-sm">
                      {siteConfig.currency.symbol}{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#283C2A] font-medium">
                      {shipping === 0 ? "Complimentary" : `${siteConfig.currency.symbol}${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#DCD1C1] text-base text-[#283C2A] font-serif font-normal">
                    <span>Estimated Total</span>
                    <span>{siteConfig.currency.symbol}{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={openCheckout}
                    className="w-full btn-primary py-4 px-4 flex items-center justify-center space-x-2 text-xs tracking-[0.16em] uppercase cursor-pointer"
                  >
                    <span>Proceed to Direct Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-1 flex items-center justify-center space-x-2 text-[11px] text-[#687060] text-center font-light">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#283C2A]" />
                  <span>Direct Artisan Handshake • WhatsApp &amp; Instagram Friendly</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
