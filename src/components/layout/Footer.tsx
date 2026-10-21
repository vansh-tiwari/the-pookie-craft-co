"use client";

import Link from "next/link";
import { useBag } from "@/context/BagContext";
import { MessageCircle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";

export function Footer() {
  const { openBag } = useBag();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#180812] text-[#FCF8FA] pt-16 pb-12 border-t border-[#9B1B54]/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-4">
              <Link href="/" className="font-serif text-3xl text-[#FCF8FA] tracking-tight block">
                The Pookie Craft Co.
              </Link>
              <p className="max-w-sm text-xs font-sans text-[#D5C2CD] leading-relaxed">
                Turning plush pipe cleaners into everlasting petals. Handcrafted forever bouquets,
                bespoke sport jersey keychains, and ambient Lumiflower lamps. Made with care in India.
              </p>
              <div className="pt-2">
                <span className="inline-block text-[10px] font-sans uppercase tracking-[0.2em] text-[#D8A657] border border-[#D8A657]/40 px-2.5 py-1 rounded-[2px]">
                  Handmade in India · Nationwide Dispatch
                </span>
              </div>
            </div>

            {/* Shop & Discover */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D8A657]">
                Discover
              </h3>
              <ul className="space-y-2 text-xs font-sans text-[#D5C2CD]">
                <li>
                  <Link href="/shop" className="hover:text-white hover:underline transition-colors">
                    Shop Gifts
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openBag}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Your Bag
                  </button>
                </li>
                <li>
                  <Link href="/custom-orders" className="hover:text-white hover:underline transition-colors">
                    Custom Creation
                  </Link>
                </li>
                <li>
                  <Link href="/story" className="hover:text-white hover:underline transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white hover:underline transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D8A657]">
                Connect
              </h3>
              <ul className="space-y-2 text-xs font-sans text-[#D5C2CD]">
                <li>
                  <a
                    href={whatsappLink("Hello! I'd like to place an order with The Pookie Craft Co.")}
                    className="hover:text-[#25D366] transition-colors inline-flex items-center gap-1"
                  >
                    <span>WhatsApp Studio</span>
                    <span>↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>Instagram (@thepookiecraft)</span>
                    <span>↗</span>
                  </a>
                </li>
                {siteConfig.email && (
                  <li>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="hover:text-white transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                )}
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Studio Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D8A657]">
                Atelier Notes
              </h3>
              <ul className="space-y-2 text-xs font-sans text-[#D5C2CD]">
                <li>
                  <Link href="/shipping" className="hover:text-white transition-colors">
                    Dispatch & Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition-colors">
                    Returns & Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-[#9E8393] hover:text-[#D8A657] transition-colors">
                    Owner Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-[#9E8393]">
            <span>© {currentYear} The Pookie Craft Co. All rights reserved.</span>
            <span>Crafted by hand, made to stay forever.</span>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#D8A657] hover:text-[#C8256E] transition-colors"
            >
              Follow our crafts on IG ↗
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Quiet Luxury WhatsApp Contact Button */}
      <a
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 bg-[#180812] text-[#FCF8FA] border border-[#9B1B54]/50 rounded-full shadow-atelier-lg hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 text-xs font-sans font-semibold uppercase tracking-[0.12em]"
        href={whatsappLink("Hi! I'd like to place an order with The Pookie Craft Co.")}
        target={siteConfig.whatsappClean ? "_blank" : undefined}
        rel="noreferrer"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle size={18} />
        <span>Order on WhatsApp</span>
      </a>
    </>
  );
}
