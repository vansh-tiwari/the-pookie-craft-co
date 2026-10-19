"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please check your choices.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-xl shadow-2xl border border-[#E4DDD2] overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#F6F0E6] text-[#252923] hover:bg-[#E4DDD2] flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Product Imagery */}
        <div className="md:w-1/2 p-5 bg-[#F6F0E6]/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E4DDD2]">
          <div className="relative aspect-4/5 w-full rounded-lg overflow-hidden bg-[#E4DDD2]/40 shadow-inner">
            <Image
              src={selectedImage || product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
            />
            {product.bestseller && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-sans font-medium uppercase tracking-[0.14em] bg-[#682B43] text-[#F6F0E6] rounded-sm">
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
                  className={`relative w-12 h-14 rounded-md overflow-hidden border flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? "border-[#682B43] ring-1 ring-[#682B43]"
                      : "border-[#E4DDD2] opacity-70 hover:opacity-100"
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
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#667062] font-sans">
              {product.category}
            </p>
            <h2
              id="quick-view-title"
              className="font-serif text-2xl text-[#252923] mt-1 mb-2 font-normal leading-tight"
            >
              {product.name}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-sans font-semibold text-[#252923]">
                {priceLabel(product)}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-sans ${
                  status === "Available"
                    ? "bg-emerald-50 text-emerald-800"
                    : status === "Made to Order"
                      ? "bg-amber-50 text-amber-800"
                      : "bg-stone-100 text-stone-600"
                }`}
              >
                {status}
              </span>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              {/* Variants */}
              {product.variants?.map((v) => (
                <div key={v.name} className="space-y-1.5">
                  <label className="text-xs font-sans font-medium text-[#252923] block">
                    {v.name} *
                  </label>
                  <select
                    required
                    value={variants[v.name] || ""}
                    onChange={(e) =>
                      setVariants({ ...variants, [v.name]: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs font-sans rounded-md border border-[#E4DDD2] bg-[#FFFDF9] text-[#252923] focus:outline-none focus:ring-1 focus:ring-[#682B43]"
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
                  <span className="text-xs font-sans font-medium text-[#252923] block">
                    Colour: <span className="font-normal text-[#667062]">{color}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColor(c.name)}
                        className={`group relative flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all ${
                          color === c.name
                            ? "border-[#682B43] bg-[#682B43]/5 text-[#682B43] font-medium"
                            : "border-[#E4DDD2] text-[#667062] hover:border-[#682B43]"
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
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
                <label className="text-xs font-sans font-medium text-[#252923] flex justify-between">
                  <span>Personalised Text / Design</span>
                  <span className="text-[#667062] font-normal">
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
                  className="w-full px-3 py-2 text-xs font-sans rounded-md border border-[#E4DDD2] bg-[#FFFDF9] text-[#252923] focus:outline-none focus:ring-1 focus:ring-[#682B43]"
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-sans font-medium text-[#252923]">
                  Qty:
                </label>
                <div className="flex items-center border border-[#E4DDD2] rounded-md overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-sm text-[#252923] hover:bg-[#F6F0E6]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-sans text-center min-w-[28px]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="px-2.5 py-1 text-sm text-[#252923] hover:bg-[#F6F0E6]"
                  >
                    +
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-md">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSoldOut}
                className={`w-full py-3 px-4 rounded-md text-xs font-sans font-semibold tracking-[0.14em] uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSoldOut
                    ? "bg-[#E4DDD2] text-[#667062] cursor-not-allowed"
                    : added
                      ? "bg-emerald-800 text-white"
                      : "bg-[#682B43] hover:bg-[#532135] text-[#F6F0E6] shadow-sm"
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Bag
                  </>
                ) : isSoldOut ? (
                  "Sold Out"
                ) : (
                  "Add to Bag"
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4DDD2] flex justify-between items-center text-xs">
            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="text-[#682B43] hover:underline font-sans font-medium inline-flex items-center gap-1"
            >
              View full details ↗
            </Link>
            <span className="text-[#667062] text-[11px]">
              Delivery confirmed in WhatsApp
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
