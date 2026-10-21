"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import { useBag } from "@/context/BagContext";
import type { Category } from "@/lib/catalog-types";

export function Navbar({ categories }: { categories: Category[] }) {
  const path = usePathname();
  const { count, ready, isOpen, openBag } = useBag();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setShopDropdownOpen(false);
  }, [path]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    }
    if (shopDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shopDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Studio Announcement Ribbon */}
      <div className="bg-[#180812] text-[#FCF8FA] text-[10.5px] font-sans tracking-[0.16em] uppercase py-2 px-4 text-center font-medium border-b border-[#9B1B54]/25 flex items-center justify-center gap-2">
        <span>Handcrafted in India</span>
        <span className="text-[#D8A657]">·</span>
        <span>Velvety blooms that stay forever</span>
        <span className="text-[#D8A657]">·</span>
        <span>Nationwide Dispatch</span>
      </div>

      <div className="bg-[#FCF8FA]/95 backdrop-blur-md border-b border-[#F0E5EC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#F0E5EC] bg-[#FFFFFF] flex-shrink-0 group-hover:border-[#9B1B54] transition-colors shadow-2xs">
            <Image
              src="/images/instagram/logo.jpg"
              alt="The Pookie Craft Co."
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="block font-serif text-[19px] sm:text-[21px] text-[#200E19] font-medium tracking-tight group-hover:text-[#9B1B54] transition-colors leading-tight">
              The Pookie Craft Co.
            </span>
            <span className="block text-[8.5px] font-sans uppercase tracking-[0.22em] text-[#9B1B54] font-semibold">
              Studio & Atelier · India
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[12px] font-sans font-medium uppercase tracking-[0.16em] text-[#200E19]">
          <Link
            href="/"
            className={`thread-underline transition-colors ${
              path === "/" ? "text-[#9B1B54] font-semibold" : "hover:text-[#9B1B54]"
            }`}
          >
            Home
          </Link>

          {/* Shop Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              className={`flex items-center gap-1 uppercase tracking-[0.16em] transition-colors ${
                path.startsWith("/shop")
                  ? "text-[#9B1B54] font-semibold"
                  : "hover:text-[#9B1B54]"
              }`}
            >
              <span>Shop</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  shopDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {shopDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full mt-2 w-56 bg-[#FFFFFF] border border-[#F0E5EC] rounded-[2px] shadow-atelier p-2 z-50 text-left normal-case"
                >
                  <Link
                    href="/shop"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-3 py-2 text-xs font-sans text-[#200E19] hover:bg-[#FCF8FA] hover:text-[#9B1B54] rounded-[2px] font-semibold border-b border-[#F0E5EC]/60"
                  >
                    All Creations
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?category=${encodeURIComponent(c.name)}`}
                      onClick={() => setShopDropdownOpen(false)}
                      className="block px-3 py-1.5 text-xs font-sans text-[#4A303F] hover:bg-[#FCF8FA] hover:text-[#9B1B54] rounded-[2px] transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/story"
            className={`thread-underline transition-colors ${
              path === "/story" ? "text-[#9B1B54] font-semibold" : "hover:text-[#9B1B54]"
            }`}
          >
            Our Story
          </Link>

          <Link
            href="/contact"
            className={`thread-underline transition-colors ${
              path === "/contact" ? "text-[#9B1B54] font-semibold" : "hover:text-[#9B1B54]"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions: Custom Orders CTA & Bag Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/custom-orders"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-[#9B1B54] text-[#9B1B54] hover:bg-[#9B1B54] hover:text-[#FFFFFF] text-[10.5px] font-sans font-semibold uppercase tracking-[0.16em] rounded-[2px] transition-all duration-200"
          >
            <span>Custom Orders</span>
            <span aria-hidden="true">↗</span>
          </Link>

          {/* Bag Trigger Button */}
          <button
            type="button"
            onClick={openBag}
            className="relative p-2.5 text-[#200E19] hover:text-[#9B1B54] transition-colors rounded-[2px] border border-[#F0E5EC] bg-[#FFFFFF] hover:border-[#9B1B54]/60 flex items-center gap-2"
            aria-label={`Your bag, ${ready ? count : 0} pieces`}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            <span className="hidden sm:inline text-[11px] font-sans font-semibold uppercase tracking-[0.14em]">
              Bag
            </span>
            {ready && count > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#9B1B54] text-[#FFFFFF] text-[9.5px] font-sans font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#200E19] hover:text-[#9B1B54]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </div>

      {/* Mobile Slide-Over Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-[#FCF8FA] border-b border-[#F0E5EC] px-6 py-6 overflow-hidden space-y-4"
          >
            <nav className="flex flex-col space-y-3 text-sm font-sans font-medium uppercase tracking-[0.14em] text-[#200E19]">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-1">
                Home
              </Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="py-1">
                Shop Collection
              </Link>
              <Link href="/story" onClick={() => setMobileOpen(false)} className="py-1">
                Our Story
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-1">
                Contact
              </Link>
              <Link
                href="/custom-orders"
                onClick={() => setMobileOpen(false)}
                className="inline-block mt-2 py-2.5 px-4 bg-[#9B1B54] text-[#FFFFFF] text-center text-xs font-semibold rounded-[2px] hover:bg-[#7D1342] transition-colors"
              >
                Create a Custom Gift ↗
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
