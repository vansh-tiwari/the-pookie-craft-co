"use client";

import type { Product } from "@/types";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, Copy, Check, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { useBag } from "@/context/BagContext";
import { bagEnquiry, bagTotals, money } from "@/lib/bag";
import { availability } from "@/lib/catalog-types";
import { siteConfig, whatsappLink } from "@/config/site";

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

  const totals = bagTotals(bag.items, products);
  const canEnquire = totals.canEnquire && catalogReady;
  const baseUrl =
    typeof window === "undefined" ? siteConfig.siteUrl : window.location.origin;

  const summary = totals.canEnquire
    ? bagEnquiry(bag.items, products, baseUrl)
    : "";

  function message() {
    if (!catalogReady)
      throw new Error(
        "Please wait for current prices and availability to load.",
      );
    return bagEnquiry(bag.items, products, baseUrl);
  }

  function whatsapp() {
    try {
      window.open(whatsappLink(message()), "_blank", "noopener,noreferrer");
      setNotice(
        "Your order enquiry is ready in WhatsApp. Review and send it to our studio.",
      );
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "Check your bag before enquiring.",
      );
    }
  }

  async function handleCopy() {
    try {
      const text = message();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setNotice("Order details copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setSummaryVisible(true);
      setNotice("Select and copy the order summary below.");
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
        /* Quiet Luxury Empty State with 1-Tap Category Discovery */
        <div className="py-12 px-2 text-center space-y-4 my-auto">
          <div className="w-14 h-14 rounded-full bg-[#FCF8FA] border border-[#F0E5EC] flex items-center justify-center mx-auto text-[#9B1B54] shadow-xs">
            <Sparkles size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl text-[#200E19] font-normal">
              Your bag is empty
            </h3>
            <p className="text-xs font-sans text-[#7E6875] max-w-xs mx-auto leading-relaxed font-light">
              Everlasting florals, custom keychains, and ambient lamps are waiting for you.
            </p>
          </div>

          {/* Quick Discovery Category Chips */}
          <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto text-left">
            <Link
              href="/shop?category=Flowers%20%26%20Bouquets"
              onClick={() => presentation === "drawer" && bag.closeBag()}
              className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#FCF8FA] border border-[#F0E5EC] hover:border-[#9B1B54]/50 text-xs font-sans text-[#200E19] rounded-[2px] transition-all flex items-center justify-between group"
            >
              <span>✿ Flowers & Bouquets</span>
              <span className="text-[#9B1B54] group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
            <Link
              href="/shop?category=Keychains"
              onClick={() => presentation === "drawer" && bag.closeBag()}
              className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#FCF8FA] border border-[#F0E5EC] hover:border-[#9B1B54]/50 text-xs font-sans text-[#200E19] rounded-[2px] transition-all flex items-center justify-between group"
            >
              <span>★ Custom Jersey Keychains</span>
              <span className="text-[#9B1B54] group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
            <Link
              href="/shop?category=Lamps%20%26%20Decor"
              onClick={() => presentation === "drawer" && bag.closeBag()}
              className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#FCF8FA] border border-[#F0E5EC] hover:border-[#9B1B54]/50 text-xs font-sans text-[#200E19] rounded-[2px] transition-all flex items-center justify-between group"
            >
              <span>✦ Lumiflower Lamps</span>
              <span className="text-[#9B1B54] group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              onClick={() => presentation === "drawer" && bag.closeBag()}
              className="inline-flex px-6 py-2.5 bg-[#9B1B54] hover:bg-[#7D1342] text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[2px] transition-all shadow-sm"
            >
              Explore Collection ↗
            </Link>
          </div>
        </div>
      ) : (
        /* Non-empty Bag Layout */
        <>
          {/* Scrollable Items Container */}
          <div
            className={`bag-items-wrapper ${
              presentation === "drawer"
                ? "flex-1 overflow-y-auto pr-1 space-y-3"
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
                    className="p-3.5 bg-[#FFFFFF] border border-[#F0E5EC] rounded-[2px] flex gap-3.5 items-start shadow-2xs hover:border-[#9B1B54]/40 transition-colors"
                  >
                    {/* 4:5 Aspect Image */}
                    <div className="relative aspect-[4/5] w-16 min-w-[64px] rounded-[2px] overflow-hidden bg-[#FCF8FA] border border-[#F0E5EC] flex-shrink-0">
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
                            className="object-cover"
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
                          <h4 className="font-serif text-[15px] text-[#200E19] font-normal leading-snug line-clamp-1">
                            {p ? (
                              <Link
                                href={`/product/${p.slug}`}
                                onClick={() =>
                                  presentation === "drawer" && bag.closeBag()
                                }
                                className="hover:text-[#9B1B54] transition-colors"
                              >
                                {p.name}
                              </Link>
                            ) : (
                              "Product no longer listed"
                            )}
                          </h4>
                          {/* Trash / Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              bag.remove(item.key);
                              setNotice("Piece removed from your bag.");
                            }}
                            className="text-[#7E6875] hover:text-rose-700 p-0.5 transition-colors"
                            aria-label={`Remove ${p?.name || "unlisted product"} from bag`}
                            title="Remove piece"
                          >
                            <Trash2 size={13} />
                          </button>
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
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[#FCF8FA] border border-[#F0E5EC] text-[10px] font-sans text-[#200E19]">
                              <span
                                className="w-2 h-2 rounded-full inline-block border border-black/15"
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
                                className="px-1.5 py-0.5 rounded-[2px] bg-[#FCF8FA] border border-[#F0E5EC] text-[10px] font-sans text-[#4A303F]"
                              >
                                {v}
                              </span>
                            ),
                          )}
                          {item.choices.personalization && (
                            <span className="px-1.5 py-0.5 rounded-[2px] bg-[#FCF8FA] border border-[#F0E5EC] text-[10px] font-sans text-[#4A303F] italic truncate max-w-[190px] block">
                              "{item.choices.personalization}"
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

                      {/* Line Footer: Stepper & Price */}
                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#F0E5EC]/80">
                        {/* Tactile - / + Stepper */}
                        <div className="inline-flex items-center border border-[#F0E5EC] rounded-[2px] bg-[#FFFFFF]">
                          <button
                            type="button"
                            onClick={() =>
                              bag.setQuantity(
                                item.key,
                                Math.max(1, item.choices.quantity - 1),
                              )
                            }
                            disabled={item.choices.quantity <= 1}
                            className="w-5 h-5 flex items-center justify-center text-[#200E19] hover:bg-[#FCF8FA] disabled:opacity-25 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-6 text-center text-xs font-sans font-semibold text-[#200E19]">
                            {item.choices.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              bag.setQuantity(
                                item.key,
                                Math.min(99, item.choices.quantity + 1),
                              )
                            }
                            disabled={item.choices.quantity >= 99}
                            className="w-5 h-5 flex items-center justify-center text-[#200E19] hover:bg-[#FCF8FA] disabled:opacity-25 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Price */}
                        {p && (
                          <div className="text-right">
                            <span className="font-sans text-[13px] font-semibold text-[#200E19] block leading-tight">
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
          </div>

          {/* Sticky Pinned Drawer Summary & CTA Section */}
          <div
            className={`bag-summary-dock ${
              presentation === "drawer"
                ? "border-t border-[#F0E5EC] bg-[#FCF8FA] p-5 space-y-3 mt-auto shadow-atelier"
                : "bag-summary mt-8"
            }`}
          >
            {/* Atelier Dispatch Promise */}
            <div className="flex items-center justify-between text-[10px] font-sans text-[#7E6875] pb-2 border-b border-[#F0E5EC]/80">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Handmade in Studio · India</span>
              </span>
              <span>Nationwide Dispatch</span>
            </div>

            {/* Product Total Row */}
            <div className="flex justify-between items-baseline pt-1">
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
              <p className="text-[10.5px] text-amber-900 bg-amber-50 p-2 rounded-[2px] border border-amber-200">
                Includes sold-out pieces; message will ask about restock.
              </p>
            )}

            {/* Primary Action Button: Order on WhatsApp */}
            <button
              type="button"
              onClick={whatsapp}
              disabled={!canEnquire || !siteConfig.whatsappClean}
              className="w-full py-3 px-4 rounded-[2px] bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-sans font-semibold tracking-[0.14em] uppercase transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle size={17} />
              <span>Order on WhatsApp ↗</span>
            </button>

            {/* Secondary Action Button: Copy Order Details with Animated Feedback */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!canEnquire}
              className={`w-full py-2.5 px-3 rounded-[2px] border border-[#F0E5EC] bg-[#FFFFFF] text-xs font-sans font-medium tracking-[0.08em] uppercase transition-all duration-200 flex items-center justify-center gap-1.5 ${
                copied
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-[#200E19] hover:bg-[#FCF8FA]"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-700" />
                  <span>✓ Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-[#7E6875]" />
                  <span>Copy Order Details</span>
                </>
              )}
            </button>

            {/* Footer Bottom Utility Row */}
            <div className="flex justify-between items-center text-[10.5px] font-sans text-[#7E6875] pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Remove every piece from your bag?")) {
                    bag.clear();
                    setNotice("");
                  }
                }}
                className="hover:text-rose-700 underline transition-colors"
              >
                Clear bag
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

      {/* Floating Notice / Toast */}
      {notice && (
        <div
          role="status"
          className="text-xs text-[#200E19] bg-[#FCF8FA] p-2 rounded-[2px] border border-[#F0E5EC] mt-2 text-center"
        >
          {notice}
        </div>
      )}

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
