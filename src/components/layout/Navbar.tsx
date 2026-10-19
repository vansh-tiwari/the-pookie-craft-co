"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin) return null;

  // On homepage before scroll, the navbar is transparent over the hero
  const isTransparent = isHome && !isScrolled;
  const textColor = isTransparent ? "text-white" : "text-[#283C2A]";
  const subtextColor = isTransparent ? "text-white/80 hover:text-white" : "text-[#687060] hover:text-[#283C2A]";
  const logoBadgeStyle = isTransparent
    ? "border-white/30 bg-white/10 text-white"
    : "border-[#DCD1C1] bg-[#F6EFE3] text-[#967F4F]";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent border-b border-transparent shadow-none"
            : "bg-[#FEF7ED]/95 backdrop-blur-md border-b border-[#DCD1C1] shadow-xs"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-[72px] md:h-[80px]">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`md:hidden p-2 transition-colors duration-300 ${textColor} hover:opacity-75`}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Brand Logo & Name */}
          <Link
            href="/"
            className={`font-serif text-[19px] md:text-[23px] font-light tracking-[0.14em] uppercase transition-all duration-300 hover:opacity-85 inline-flex items-center gap-3 ${textColor}`}
          >
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${logoBadgeStyle}`}>
              <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.8" />
                <path
                  d="M20 12C21.5 16 24 18.5 28 20C24 21.5 21.5 24 20 28C18.5 24 16 21.5 12 20C16 18.5 18.5 16 20 12Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" />
                <circle cx="32" cy="20" r="1.5" stroke="currentColor" strokeWidth="1" />
                <circle cx="20" cy="32" r="1.5" stroke="currentColor" strokeWidth="1" />
                <circle cx="8" cy="20" r="1.5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <span className="tracking-[0.18em] font-normal">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-10">
            {siteConfig.navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] font-sans tracking-[0.14em] uppercase transition-all duration-300 thread-underline ${
                    active ? `${textColor} font-semibold` : `${subtextColor} font-light`
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Cart Drawer Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className={`relative p-2 transition-all duration-300 ${textColor} hover:opacity-75 cursor-pointer flex items-center gap-2`}
              aria-label={`Open shopping bag with ${totalItems} items`}
            >
              <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#967F4F] text-[#FEF7ED] text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#1A281B] z-50 md:hidden backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-[#FEF7ED] z-50 flex flex-col justify-between shadow-2xl border-r border-[#DCD1C1] md:hidden p-6"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#DCD1C1]">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-lg tracking-[0.15em] uppercase text-[#283C2A] font-semibold"
                  >
                    {siteConfig.name}
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-[#283C2A] hover:text-[#967F4F] transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <nav className="flex flex-col gap-6 pt-8">
                  {siteConfig.navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[13px] font-sans tracking-[0.16em] uppercase text-[#283C2A] font-medium flex items-center justify-between hover:text-[#967F4F] transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#967F4F]" />
                    </Link>
                  ))}
                  <Link
                    href="/custom-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[13px] font-sans tracking-[0.16em] uppercase text-[#967F4F] font-semibold pt-4 border-t border-[#DCD1C1]/60"
                  >
                    ✨ Request Custom Piece
                  </Link>
                </nav>
              </div>

              <div className="pt-6 border-t border-[#DCD1C1] space-y-2">
                <p className="font-serif text-sm italic text-[#967F4F]">{siteConfig.tagline}</p>
                <p className="text-[11px] text-[#687060] font-sans">{siteConfig.studioLocation}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
