import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { BrandCurtain } from "@/components/layout/BrandCurtain";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickCheckoutModal } from "@/components/cart/QuickCheckoutModal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} | Turning Pipe Cleaners Into Petals`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "the pookie craft",
    "pookie craft co",
    "pipe cleaner flowers india",
    "forever flower bouquet",
    "csk keychain",
    "dhoni keychain",
    "lumiflower lamp",
    "chocolate flower bouquet",
    "handmade gifts india",
  ],
  authors: [{ name: "The Pookie Craft Co. Studio" }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FEF7ED] text-[#283C2A] selection:bg-[#283C2A] selection:text-[#FEF7ED] font-sans antialiased">
        <CartProvider>
          {/* First session visual reveal */}
          <BrandCurtain />

          {/* Header navigation (fixed floating transparent-to-scrolled) */}
          <Navbar />

          {/* Page contents */}
          <main className="flex-grow">{children}</main>

          {/* Global Footer */}
          <Footer />

          {/* Interactive Slide-over Cart */}
          <CartDrawer />

          {/* Quick WhatsApp / Instagram Checkout Modal */}
          <QuickCheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
