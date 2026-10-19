"use client";
import Link from "next/link";
import { useBag } from "@/context/BagContext";
import { MessageCircle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
export function Footer() {
  const { openBag } = useBag();
  return (
    <>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <Link href="/" className="font-serif text-3xl">
              The Pookie Craft Co.
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[#DCD1C1]">
              Turning pipe cleaners into petals. Velvety forever flowers and
              custom keepsakes that stay forever.
            </p>
            <p className="mt-4 text-xs text-[#E6B94A]">Made in India · Shipped Nationwide</p>
          </div>
          <div>
            <h2>Shop & Discover</h2>
            <Link href="/shop">Shop Gifts</Link>
            <button type="button" className="footer-bag-link" onClick={openBag}>
              Your Bag
            </button>
            <Link href="/custom-orders">Custom Order Request</Link>
            <Link href="/story">Our Story</Link>
            <Link href="/faq">FAQs</Link>
          </div>
          <div>
            <h2>Connect With Us</h2>
            <a
              href={whatsappLink(
                "Hello! I'd like to place an order with The Pookie Craft Co.",
              )}
            >
              WhatsApp Studio ↗
            </a>
            <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
            {siteConfig.email && (
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            )}
            <Link href="/contact">Contact details</Link>
          </div>
          <div>
            <h2>The helpful details</h2>
            <Link href="/shipping">Shipping & delivery</Link>
            <Link href="/returns">Returns & replacements</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms & conditions</Link>
            <Link href="/admin">Owner sign in</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} The Pookie Craft Co.</span>
          <span>Good things take a little crafting.</span>
          <a href={siteConfig.instagramUrl} aria-label="Visit Instagram">
            <span>IG ↗</span>
          </a>
        </div>
      </footer>
      <a
        className="floating-whatsapp"
        href={whatsappLink(
          "Hi! I'd like to place an order with The Pookie Craft Co.",
        )}
        target={siteConfig.whatsappClean ? "_blank" : undefined}
        rel="noreferrer"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle size={24} />
        <span>Order on WhatsApp</span>
      </a>
    </>
  );
}
