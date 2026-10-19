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
            <p className="mt-4 max-w-xs">
              A little handmade happiness, from our hands to your heart.
            </p>
            <p className="mt-4 text-sm">Made in India. Gifted with love.</p>
          </div>
          <div>
            <h2>Find your little happy</h2>
            <Link href="/shop">Shop all products</Link>
            <button type="button" className="footer-bag-link" onClick={openBag}>
              Your enquiry bag
            </button>
            <Link href="/custom-orders">Request a custom order</Link>
            <Link href="/story">Our story</Link>
            <Link href="/faq">FAQs</Link>
          </div>
          <div>
            <h2>Let’s talk</h2>
            <a
              href={whatsappLink(
                "Hello! I'd like to enquire about a handmade gift.",
              )}
            >
              WhatsApp ↗
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
          "Hi! I'd love to know more about your handmade gifts.",
        )}
        target={siteConfig.whatsappClean ? "_blank" : undefined}
        rel="noreferrer"
        aria-label="Enquire on WhatsApp"
      >
        <MessageCircle size={24} />
        <span>Let’s chat</span>
      </a>
    </>
  );
}
