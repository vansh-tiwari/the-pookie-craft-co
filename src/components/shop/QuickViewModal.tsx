"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import type { Product } from "@/types";
import { availability, priceLabel } from "@/lib/catalog-types";
import { useBag } from "@/context/BagContext";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const bag = useBag();
  const [selectedImage, setSelectedImage] = useState("");
  const [color, setColor] = useState("");
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [personalization, setPersonalization] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image_url);
      setColor(product.colors?.[0]?.name || "");
      setVariants({});
      setPersonalization("");
      setQuantity(1);
      setError("");
      setAdded(false);
    }
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const status = availability(product);
  const isSoldOut = status === "Sold Out";

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      bag.add(product, {
        color,
        variants,
        personalization,
        quantity,
      });
      setError("");
      setAdded(true);
      setTimeout(() => {
        onClose();
        bag.openBag();
      }, 400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please check your choices.");
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#FCFBF9] rounded-[4px] shadow-2xl border border-[#E8E2D8] overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#FAF7F2] text-[#1C281F] hover:bg-[#E8E2D8] flex items-center justify-center transition-colors shadow-xs"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>

          {/* Product Imagery */}
          <div className="md:w-1/2 p-5 bg-[#FAF7F2] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E2D8]">
            <div className="relative aspect-[4/5] min-h-[240px] w-full rounded-[2px] overflow-hidden bg-[#F2EDE4] shadow-xs">
              <Image
                src={selectedImage || product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
              {product.bestseller && (
                <span className="absolute top-3 left-3 px-2 py-0.5 text-[9.5px] font-sans font-semibold uppercase tracking-[0.16em] bg-[#1C281F] text-[#FAF7F2] rounded-[2px]">
                  Bestseller
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-12 h-14 rounded-[2px] overflow-hidden border flex-shrink-0 transition-all ${
                      selectedImage === img
                        ? "border-[#967F4F] ring-1 ring-[#967F4F]"
                        : "border-[#E8E2D8] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Option Selection Form */}
          <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#667264] font-sans font-semibold">
                {product.category}
              </p>
              <h2
                id="quick-view-title"
                className="font-serif text-[22px] text-[#1C281F] mt-1 mb-2 font-normal leading-tight"
              >
                {product.name}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-base font-sans font-semibold text-[#1C281F]">
                  {priceLabel(product)}
                </span>
                <span
                  className={`text-[10.5px] px-2 py-0.5 rounded-[2px] font-sans ${
                    status === "Available"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : status === "Made to Order"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  {status}
                </span>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                {/* Variants */}
                {product.variants?.map((v) => (
                  <div key={v.name} className="space-y-1.5">
                    <label className="text-[11.5px] font-sans font-medium text-[#1C281F] block">
                      {v.name} *
                    </label>
                    <select
                      required
                      value={variants[v.name] || ""}
                      onChange={(e) =>
                        setVariants({ ...variants, [v.name]: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs font-sans rounded-[2px] border border-[#E8E2D8] bg-[#FFFFFF] text-[#1C281F] focus:outline-none focus:ring-1 focus:ring-[#967F4F]"
                    >
                      <option value="">Select option</option>
                      {v.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11.5px] font-sans font-medium text-[#1C281F] block">
                      Colour: <span className="font-normal text-[#667264]">{color}</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setColor(c.name)}
                          className={`group relative flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-[2px] border transition-all ${
                            color === c.name
                              ? "border-[#967F4F] bg-[#967F4F]/10 text-[#1C281F] font-medium"
                              : "border-[#E8E2D8] text-[#667264] hover:border-[#967F4F]"
                          }`}
                          title={c.name}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personalization */}
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-sans font-medium text-[#1C281F] flex justify-between">
                    <span>Personalised Text / Design</span>
                    <span className="text-[#667264] font-normal">
                      {product.personalizationRequired ? "Required" : "Optional"}
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={personalization}
                    required={product.personalizationRequired}
                    onChange={(e) => setPersonalization(e.target.value)}
                    placeholder="e.g. Name, date, jersey number…"
                    className="w-full px-3 py-2 text-xs font-sans rounded-[2px] border border-[#E8E2D8] bg-[#FFFFFF] text-[#1C281F] focus:outline-none focus:ring-1 focus:ring-[#967F4F]"
                  />
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <label className="text-[11.5px] font-sans font-medium text-[#1C281F]">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-[#E8E2D8] rounded-[2px] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-sm text-[#1C281F] hover:bg-[#FAF7F2]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-sans text-center min-w-[28px]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      className="px-2.5 py-1 text-sm text-[#1C281F] hover:bg-[#FAF7F2]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-[2px]">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSoldOut}
                  className={`w-full py-2.5 px-4 rounded-[2px] text-[11px] font-sans font-semibold tracking-[0.16em] uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                    isSoldOut
                      ? "bg-[#E8E2D8] text-[#667264] cursor-not-allowed"
                      : added
                        ? "bg-[#1C281F] text-[#FAF7F2]"
                        : "bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] shadow-xs"
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={14} /> Added to Bag
                    </>
                  ) : isSoldOut ? (
                    "Sold Out"
                  ) : (
                    "Add to Bag"
                  )}
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E2D8] flex justify-between items-center text-xs">
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="text-[#1C281F] hover:text-[#967F4F] font-sans font-medium inline-flex items-center gap-1 transition-colors"
              >
                View full details ↗
              </Link>
              <span className="text-[#667264] text-[10.5px]">
                Nationwide Dispatch
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
