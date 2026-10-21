"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { availability, priceLabel } from "@/lib/catalog-types";
import { productEnquiryUrl } from "@/lib/enquiry";
import { siteConfig } from "@/config/site";
import { ProductCard } from "@/components/shop/ProductCard";
import { useBag } from "@/context/BagContext";
import { CardPetalBloom } from "@/components/motion/CardPetalBloom";

export function ProductDetailClient({
  product: p,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [image, setImage] = useState(p.image_url);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [color, setColor] = useState("");
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [personalization, setPersonalization] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const bag = useBag();
  const status = availability(p);

  function enquire(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const choices = {
        color,
        variants,
        personalization,
        quantity,
      };
      if (
        (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") !==
        "direct"
      ) {
        bag.add(p, choices);
        setError("");
        setAdded(true);
        return;
      }
      const url = productEnquiryUrl(p, choices, window.location.origin);
      setError("");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please check your choices.");
    }
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 text-[#200E19]">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span className="text-[#200E19] font-medium">{p.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Imagery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className="relative overflow-visible"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <CardPetalBloom isHovered={isImageHovered} product={p} />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/5] min-h-[340px] sm:min-h-[460px] w-full rounded-[4px] overflow-hidden bg-[#FCF8FA] border border-[#F0E5EC] shadow-atelier"
            >
              <Image
                src={image}
                alt={p.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
              {p.bestseller && (
                <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] bg-[#200E19] text-[#FCF8FA] rounded-[2px] shadow-xs">
                  Bestseller
                </span>
              )}
            </motion.div>
          </div>

          {/* Thumbnail Strip */}
          {p.images && p.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {p.images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  aria-label={`View ${p.name}, image ${i + 1}`}
                  aria-pressed={image === src}
                  onClick={() => setImage(src)}
                  className={`relative w-16 h-20 rounded-[2px] overflow-hidden border flex-shrink-0 transition-all ${
                    image === src
                      ? "border-[#9B1B54] ring-1 ring-[#9B1B54]"
                      : "border-[#F0E5EC] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Options */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-6 space-y-6"
        >
          <div>
            <span className="eyebrow">{p.category}</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#200E19] font-normal leading-tight">
              {p.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl font-sans font-semibold text-[#200E19]">
                {priceLabel(p)}
              </span>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-[2px] font-sans uppercase tracking-[0.1em] ${
                  status === "Available"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : status === "Made to Order"
                      ? "bg-[#FDF2F7] text-[#9B1B54] border border-[#F0E5EC]"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="mt-4 text-sm font-sans text-[#4A303F] leading-relaxed font-light">
              {p.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#F0E5EC] text-xs font-sans space-y-2">
            <div className="flex justify-between py-1 border-b border-[#F0E5EC]/80">
              <span className="text-[#7E6875]">Size & Dimensions</span>
              <span className="text-[#200E19] font-medium">
                {p.dimensions || "Confirmed with studio on enquiry"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5EC]/80">
              <span className="text-[#7E6875]">Craft Materials</span>
              <span className="text-[#200E19] font-medium">
                {p.material || "Dense Chenille Craft Wire & Metal Findings"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#7E6875]">Dispatch & Handcrafting</span>
              <span className="text-[#200E19] font-medium">
                {p.leadTime || "Ships across India"}
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={enquire}
            onChangeCapture={() => setAdded(false)}
            className="space-y-4 pt-2"
          >
            {/* Variants */}
            {p.variants?.map((v) => (
              <div key={v.name} className="space-y-1.5">
                <label className="text-xs font-sans font-medium text-[#200E19] block">
                  {v.name} *
                </label>
                <select
                  required
                  value={variants[v.name] || ""}
                  onChange={(e) =>
                    setVariants({ ...variants, [v.name]: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs font-sans rounded-[2px] border border-[#F0E5EC] bg-[#FFFFFF] text-[#200E19] focus:outline-none focus:ring-1 focus:ring-[#9B1B54]"
                >
                  <option value="">Select an option</option>
                  {v.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Colors */}
            {!!p.colors?.length && (
              <div className="space-y-1.5">
                <span className="text-xs font-sans font-medium text-[#200E19] block">
                  Select Colour * {color && <span className="font-normal text-[#7E6875]">({color})</span>}
                </span>
                <div className="flex flex-wrap gap-2">
                  {p.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] border text-xs font-sans transition-all ${
                        color === c.name
                          ? "border-[#9B1B54] bg-[#9B1B54] text-[#FFFFFF]"
                          : "border-[#F0E5EC] bg-[#FFFFFF] text-[#4A303F] hover:border-[#9B1B54]"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 inline-block flex-shrink-0"
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
              <label className="text-xs font-sans font-medium text-[#200E19] flex justify-between">
                <span>Personalised Text or Notes</span>
                <span className="text-[#7E6875] font-normal">
                  {p.personalizationRequired ? "Required *" : "(Optional)"}
                </span>
              </label>
              <textarea
                maxLength={1000}
                rows={2}
                value={personalization}
                required={p.personalizationRequired}
                onChange={(e) => setPersonalization(e.target.value)}
                placeholder="Names, dates, jerseys, or color preferences…"
                className="w-full px-3.5 py-2.5 text-xs font-sans rounded-[2px] border border-[#F0E5EC] bg-[#FFFFFF] text-[#200E19] focus:outline-none focus:ring-1 focus:ring-[#9B1B54]"
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-sans font-medium text-[#200E19]">
                Quantity:
              </label>
              <div className="flex items-center border border-[#F0E5EC] rounded-[2px] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm text-[#200E19] hover:bg-[#FCF8FA]"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-sans text-center min-w-[32px] text-[#200E19]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  className="px-3 py-1 text-sm text-[#200E19] hover:bg-[#FCF8FA]"
                >
                  +
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-[2px]">
                {error}
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                name="action"
                value="bag"
                disabled={!bag.ready || status === "Sold Out"}
                className={`w-full py-3.5 px-6 rounded-[2px] text-xs font-sans font-semibold tracking-[0.16em] uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                  status === "Sold Out"
                    ? "bg-[#F0E5EC] text-[#7E6875] cursor-not-allowed"
                    : added
                      ? "bg-[#3D6B52] text-white"
                      : "bg-[#9B1B54] hover:bg-[#7D1342] text-[#FFFFFF] shadow-sm"
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Bag
                  </>
                ) : status === "Sold Out" ? (
                  "Sold Out"
                ) : (
                  "Add to Bag"
                )}
              </button>

              <button
                type="submit"
                name="action"
                value="direct"
                className="w-full py-3.5 px-6 rounded-[2px] bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-sans font-semibold tracking-[0.16em] uppercase shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MessageCircle size={17} />
                <span>
                  {status === "Sold Out"
                    ? "Ask About Restock on WhatsApp"
                    : "Order on WhatsApp"}
                </span>
                <span>↗</span>
              </button>
            </div>

            {added && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[2px] text-xs font-sans text-emerald-900 flex items-center justify-between">
                <span>Added to your bag.</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={bag.openBag}
                    className="font-semibold underline text-[#9B1B54]"
                  >
                    View Bag ↗
                  </button>
                  <Link href="/shop" className="underline">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}

            <div className="pt-2 text-center">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-sans text-[#7E6875] hover:text-[#9B1B54] inline-flex items-center gap-1 transition-colors"
              >
                <span>Prefer Instagram? Message studio (@thepookiecraft) ↗</span>
              </a>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-14 border-t border-[#F0E5EC]">
          <div className="mb-8">
            <span className="eyebrow">Studio Atelier</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#200E19] font-normal">
              More Handcrafted Keepsakes
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
