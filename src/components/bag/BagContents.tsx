"use client";

import type { Product } from "@/types";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, Copy, Check, MessageCircle, Sparkles, ArrowRight, Heart } from "lucide-react";
import { useBag } from "@/context/BagContext";
import { bagEnquiry, bagTotals, money } from "@/lib/bag";
import { availability } from "@/lib/catalog-types";
import { siteConfig, whatsappLink } from "@/config/site";
import { BagGiftProgress } from "./BagGiftProgress";
import { BagGiftNote } from "./BagGiftNote";
import { BagQuickAddons } from "./BagQuickAddons";
import { BagTrustBadges } from "./BagTrustBadges";
import { SplitOrderButton } from "@/components/common/SplitOrderButton";

export function BagContents({
  products,
  presentation = "page",
  catalogReady = true,
}: {
  products: Product[];
  presentation?: "page" | "drawer";
  catalogReady?: boolean;
}) {
  const bag = useBag();
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const noticeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotice = useCallback((msg: string, durationMs = 2600) => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice(msg);
    noticeTimerRef.current = setTimeout(() => {
      setNotice("");
    }, durationMs);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const totals = bagTotals(bag.items, products);
  const canEnquire = totals.canEnquire && catalogReady;
  const baseUrl =
    typeof window === "undefined" ? siteConfig.siteUrl : window.location.origin;

  const summary = totals.canEnquire
    ? bagEnquiry(bag.items, products, baseUrl, bag.giftNote)
    : "";

  function message() {
    if (!catalogReady)
      throw new Error(
        "Please wait for current prices and availability to load.",
      );
    return bagEnquiry(bag.items, products, baseUrl, bag.giftNote);
  }

  function whatsapp() {
    try {
      window.open(whatsappLink(message()), "_blank", "noopener,noreferrer");
      showNotice(
        "Your order enquiry is ready in WhatsApp. Review and send it to our studio.",
        4000,
      );
    } catch (e) {
      showNotice(
        e instanceof Error ? e.message : "Check your bag before enquiring.",
        3500,
      );
    }
  }

  async function handleInstagramBag() {
    try {
      const text = message();
      await navigator.clipboard.writeText(text);
      showNotice("Bag details copied! Paste in studio Instagram DM 💌", 3500);
      window.open(siteConfig.instagramUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      showNotice(
        e instanceof Error ? e.message : "Check your bag before enquiring.",
        3500,
      );
    }
  }

  async function handleCopy() {
    try {
      const text = message();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showNotice("Order details copied to clipboard!", 2500);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setSummaryVisible(true);
      showNotice("Select and copy the order summary below.", 4000);
    }
  }

  const isEmpty = !bag.items.length;

  // Drawer layout: flex-1 scrollable items + sticky bottom footer
  return (
    <div
      className={`bag-container ${
        presentation === "drawer"
          ? "flex flex-col h-full justify-between"
          : "section-wrap"
      }`}
    >
      {/* Page Header (only shown if not in drawer) */}
      {presentation !== "drawer" && (
        <>
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <span className="eyebrow">Studio Atelier</span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#200E19]">
                Your Bag
              </h1>
            </div>
            <Link
              href="/shop"
              className="text-xs font-sans font-semibold uppercase tracking-[0.14em] text-[#200E19] hover:text-[#9B1B54]"
            >
              Continue Shopping ↗
            </Link>
          </div>
          <p className="intro-copy mb-8">
            Review your handcrafted keepsakes and flowers below. When ready, order
            directly with our studio on WhatsApp.
          </p>
        </>
      )}

      {/* Storage notice if any */}
      {bag.storageNotice && (
        <p className="text-xs text-[#7E6875] bg-[#FCF8FA] p-2.5 rounded-[2px] border border-[#F0E5EC] mb-3">
          {bag.storageNotice}
        </p>
      )}

      {/* Loading State */}
      {!bag.ready ? (
        <div className="py-12 text-center text-xs font-sans text-[#7E6875]">
          Opening your bag…
        </div>
      ) : isEmpty ? (
        /* Poetic Atelier Empty State with 1-Tap Category Discovery */
        <div className="py-10 px-4 text-center space-y-5 my-auto">
          <div className="relative w-16 h-16 rounded-full bg-[#FAF2F7] border border-[#F0E5EC] flex items-center justify-center mx-auto text-[#9B1B54] shadow-atelier">
            <span className="text-2xl animate-pulse">🌸</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D8A657] border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
              ✦
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#D8A657] font-semibold block">
              Handcrafted in India
            </span>
            <h3 className="font-serif text-2xl text-[#200E19] font-normal">
              Your Keepsake Pouch is Waiting
            </h3>
            <p className="text-xs font-sans text-[#7E6875] max-w-xs mx-auto leading-relaxed font-light">
              Everlasting florals, custom sports keychains, and glowing lamps sculpted from plush chenille wire.
            </p>
          </div>

          {/* Quick Discovery Category Chips */}
          <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto text-left">
            <Link
              href="/shop?category=Flowers%20%26%20Bouquets"
              onClick={() => presentation === "drawer" && bag.closeBag()}
              className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#FAF2F7] border border-[#F0E5EC] hover:border-[#9B1B54]/50 text-xs font-sans text-[#200E19] rounded-[4px] transition-all flex items-center justify-between group shadow-2xs"
            >
              <span className="inline-flex items-center gap-2">
                <span>✿</span>
                <span className="font-medium">Forever Flowers &amp; Bouquets</span>
              </span>
              <span className="text-[#9B1B54] group-hover:translate-x-0.5 transition-transform text-xs">
                →
              </span>
            </Link>
            <Link
              href="/shop?category=Keychains"
              onClick={() => presentation === "drawer" && bag.closeBag()}
              className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#FAF2F7] border border-[#F0E5EC] hover:border-[#9B1B54]/50 text-xs font-sans text-[#200E19] rounded-[4px] transition-all flex items-center justify-between group shadow-2xs"
            >
              <span className="inline-flex items-center gap-2">
                <span>★</span>
                <span className="font-medium">Personalized Jersey Keychains</span>
              </span>
              <span className="text-[#9B1B54] group-hover:translate-x-0.5 transition-transform text-xs">
                →
              </span>
            </Link>
            <Link
              href="/shop?category=Lamps%20%26%20Decor"
              onClick={() => presentation === "drawer" && bag.closeBag()}
              className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#FAF2F7] border border-[#F0E5EC] hover:border-[#9B1B54]/50 text-xs font-sans text-[#200E19] rounded-[4px] transition-all flex items-center justify-between group shadow-2xs"
            >
              <span className="inline-flex items-center gap-2">
                <span>✦</span>
                <span className="font-medium">The Lumiflower Ambient Lamp</span>
              </span>
              <span className="text-[#9B1B54] group-hover:translate-x-0.5 transition-transform text-xs">
                →
              </span>
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              onClick={() => presentation === "drawer" && bag.closeBag()}
              className="inline-flex px-7 py-3 bg-[#9B1B54] hover:bg-[#7D1342] text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-[2px] transition-all shadow-sm"
            >
              Explore Collection ↗
            </Link>
          </div>
        </div>
      ) : (
        /* Non-empty Bag Layout */
        <>
          {/* Packaging Progress Tier Bar */}
          <BagGiftProgress subtotal={totals.subtotal} />

          {/* Scrollable Items Container */}
          <div
            className={`bag-items-wrapper ${
              presentation === "drawer"
                ? "flex-1 overflow-y-auto px-4 py-3 space-y-3"
                : "space-y-4"
            }`}
          >
            <AnimatePresence initial={false}>
              {totals.lines.map(
                ({ item, product: p, error, estimated, amount }) => (
                  <motion.article
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: -24,
                      height: 0,
                      marginBottom: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      overflow: "hidden",
                      transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="p-3 bg-[#FFFFFF] border border-[#F0E5EC] rounded-[8px] flex gap-3 items-start shadow-2xs hover:shadow-atelier hover:border-[#9B1B54]/30 transition-all group"
                  >
                    {/* 4:5 Aspect Image with Subtle Rounded Edges */}
                    <div className="relative aspect-[4/5] w-[68px] min-w-[68px] rounded-[5px] overflow-hidden bg-[#FCF8FA] border border-[#F0E5EC] flex-shrink-0 group-hover:border-[#9B1B54]/20 transition-colors">
                      {p ? (
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={() => presentation === "drawer" && bag.closeBag()}
                          className="block w-full h-full relative"
                        >
                          <Image
                            src={p.image_url}
                            alt={p.name}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl text-[#9B1B54]">
                          ✿
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-serif text-[15px] text-[#200E19] font-normal leading-snug line-clamp-1 group-hover:text-[#9B1B54] transition-colors">
                            {p ? (
                              <Link
                                href={`/product/${p.slug}`}
                                onClick={() =>
                                  presentation === "drawer" && bag.closeBag()
                                }
                              >
                                {p.name}
                              </Link>
                            ) : (
                              "Product no longer listed"
                            )}
                          </h4>
                          {/* Trash / Delete button with soft hover */}
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.88 }}
                            onClick={() => {
                              bag.remove(item.key);
                              showNotice("Piece removed from your bag.", 2500);
                            }}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[#7E6875] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            aria-label={`Remove ${p?.name || "unlisted product"} from bag`}
                            title="Remove piece"
                          >
                            <Trash2 size={13} />
                          </motion.button>
                        </div>

                        {p && (
                          <span className="text-[9.5px] font-sans uppercase tracking-[0.1em] text-[#7E6875] block mt-0.5">
                            {availability(p)}{" "}
                            {availability(p) === "Sold Out"
                              ? "· Restock enquiry only"
                              : ""}
                          </span>
                        )}

                        {/* Selected Options Badges */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.choices.color && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF2F7] border border-[#F0E5EC] text-[10px] font-sans text-[#200E19]">
                              <span
                                className="w-2 h-2 rounded-full inline-block border border-black/15 shadow-2xs"
                                style={{
                                  backgroundColor:
                                    p?.colors?.find(
                                      (c) => c.name === item.choices.color,
                                    )?.hex || "#9B1B54",
                                }}
                              />
                              <span>{item.choices.color}</span>
                            </span>
                          )}
                          {Object.entries(item.choices.variants).map(
                            ([k, v]) => (
                              <span
                                key={k}
                                className="px-2 py-0.5 rounded-full bg-[#FCF8FA] border border-[#F0E5EC] text-[10px] font-sans text-[#4A303F]"
                              >
                                {v}
                              </span>
                            ),
                          )}
                          {item.choices.personalization && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-[#FAF2F7] border border-[#9B1B54]/25 text-[#9B1B54] text-[10.5px] font-serif italic max-w-[200px] truncate block">
                              <span>"{item.choices.personalization}"</span>
                            </span>
                          )}
                        </div>

                        {error && (
                          <p role="alert" className="text-[10.5px] text-rose-700 bg-rose-50 p-1.5 rounded-[2px] mt-1.5">
                            {error}{" "}
                            {p && (
                              <Link
                                href={`/product/${p.slug}`}
                                onClick={() =>
                                  presentation === "drawer" && bag.closeBag()
                                }
                                className="underline font-semibold text-[#9B1B54]"
                              >
                                Choose Options ↗
                              </Link>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Line Footer: Capsule Stepper & Serif Price */}
                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#F0E5EC]/80">
                        {/* Tactile Capsule Stepper */}
                        <div className="inline-flex items-center border border-[#F0E5EC] rounded-full bg-[#FAF2F7] px-1 py-0.5 shadow-2xs">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            onClick={() =>
                              bag.setQuantity(
                                item.key,
                                Math.max(1, item.choices.quantity - 1),
                              )
                            }
                            disabled={item.choices.quantity <= 1}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[#200E19] hover:bg-white disabled:opacity-25 transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={10} />
                          </motion.button>
                          <span className="w-6 text-center text-xs font-sans font-semibold text-[#200E19]">
                            {item.choices.quantity}
                          </span>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            onClick={() =>
                              bag.setQuantity(
                                item.key,
                                Math.min(99, item.choices.quantity + 1),
                              )
                            }
                            disabled={item.choices.quantity >= 99}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[#200E19] hover:bg-white disabled:opacity-25 transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus size={10} />
                          </motion.button>
                        </div>

                        {/* Price */}
                        {p && (
                          <div className="text-right">
                            <span className="font-serif text-[15.5px] font-normal text-[#200E19] block leading-tight">
                              {estimated ? "From " : ""}
                              {money(amount)}
                            </span>
                            <span className="text-[10px] font-sans text-[#7E6875] block leading-tight">
                              {item.choices.quantity} × {money(p.price)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ),
              )}
            </AnimatePresence>

            {/* Gift Note Accordion & Quick Add-Ons */}
            <div className="pt-2 space-y-3">
              <BagGiftNote />
              <BagQuickAddons products={products} />
            </div>
          </div>

          {/* Sticky Pinned Drawer Summary & CTA Section */}
          <div
            className={`bag-summary-dock ${
              presentation === "drawer"
                ? "border-t border-[#F0E5EC] bg-[#FFFFFF] p-4 sm:p-5 space-y-3 mt-auto shadow-atelier"
                : "bag-summary mt-8"
            }`}
          >
            {/* Product Total Row */}
            <div className="flex justify-between items-baseline pt-0.5">
              <div>
                <span className="text-[11.5px] font-sans font-semibold uppercase tracking-[0.14em] text-[#200E19] block">
                  Product Total
                </span>
                <span className="text-[10.5px] font-sans text-[#7E6875]">
                  Shipping confirmed on WhatsApp
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-normal text-[#200E19]">
                  {totals.needsQuote ? "From " : ""}
                  {money(totals.subtotal)}
                </span>
              </div>
            </div>

            {/* Warnings */}
            {totals.lines.some(
              (l) => l.product && availability(l.product) === "Sold Out",
            ) && (
              <p className="text-[10.5px] text-amber-900 bg-amber-50 p-2 rounded-[3px] border border-amber-200">
                Includes sold-out pieces; message will ask about restock.
              </p>
            )}

            {/* Primary Interactive Dual Action: [ Order on WhatsApp (70%) | Instagram (30%) ] */}
            <SplitOrderButton
              onWhatsApp={whatsapp}
              onInstagram={handleInstagramBag}
              disabled={!canEnquire}
              whatsAppLabelExpanded="Order on WhatsApp"
              whatsAppLabelCollapsed="WhatsApp"
              instagramLabelExpanded="Order on Instagram"
              instagramLabelCollapsed="Instagram"
            />

            {/* Footer Bottom Utility Row */}
            <div className="flex justify-between items-center text-[10.5px] font-sans text-[#7E6875] pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Remove every piece from your bag?")) {
                    bag.clear();
                    showNotice("Bag cleared.", 2500);
                  }
                }}
                className="hover:text-rose-700 underline transition-colors"
              >
                Clear bag
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!canEnquire}
                className="hover:text-[#200E19] underline transition-colors"
              >
                {copied ? "✓ Copied" : "Copy details"}
              </button>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#200E19] transition-colors"
              >
                Prefer Instagram? DM studio ↗
              </a>
            </div>
          </div>
        </>
      )}

      {/* Floating Notice / Toast (Auto-dismissing) */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="status"
            className="fixed sm:absolute bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none"
          >
            <div className="bg-[#180812] text-white text-[11.5px] font-sans font-medium px-4 py-2 rounded-full shadow-xl border border-[#D8A657]/40 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8A657]" />
              <span>{notice}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback Textarea Message Preview if automatic clipboard fails */}
      {summaryVisible && bag.items.length > 0 && (
        <section className="p-4 bg-[#FFFFFF] border border-[#F0E5EC] rounded-[2px] mt-3">
          <label className="text-xs font-sans text-[#200E19] font-semibold block mb-2">
            Order message — tap to select & copy:
          </label>
          <textarea
            readOnly
            rows={8}
            value={summary}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full text-xs font-mono p-2 border border-[#F0E5EC] bg-[#FCF8FA] rounded-[2px]"
          />
        </section>
      )}
    </div>
  );
}
