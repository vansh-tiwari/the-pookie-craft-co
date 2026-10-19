import React, { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { getCatalog } from "@/lib/catalog";
import { BagProvider } from "@/context/BagContext";
import { BagDrawer, BagRouteOpener } from "@/components/bag/BagDrawer";
export const dynamic = "force-dynamic";

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
    images: [
      {
        url: "/images/products/sunflower_bouquet.jpg",
        alt: "Handmade forever flowers from The Pookie Craft Co.",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const catalog = await getCatalog();
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <BagProvider>
          <Navbar categories={catalog.categories} />
          <main id="main-content">{children}</main>
          <Footer />
          <BagDrawer initialProducts={catalog.products} />
          <Suspense fallback={null}>
            <BagRouteOpener />
          </Suspense>
        </BagProvider>
      </body>
    </html>
  );
}
