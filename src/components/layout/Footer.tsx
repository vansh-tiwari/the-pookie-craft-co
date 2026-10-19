"use client";

import React from "react";
import Link from "next/link";
import { Heart, Truck, ShieldCheck, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-[#F6EFE3] border-t border-[#DCD1C1] pt-16 pb-12 text-[#283C2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#DCD1C1]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#DCD1C1] bg-[#FEF7ED] flex items-center justify-center text-[#967F4F] shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                <div>
                  <span className="font-serif text-2xl tracking-[0.14em] font-normal block text-[#283C2A]">
                    {siteConfig.name.toUpperCase()}
                  </span>
                  <span className="font-serif text-sm italic text-[#967F4F] tracking-wide block">
                    Turning Pipe Cleaners Into Petals
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-sm text-[#687060] leading-relaxed max-w-md font-sans pt-2 font-light">
              An independent artisan craft studio. Every petal and stitch is intentionally shaped by hand from velvety pipe cleaners and soft threads to create everlasting floral keepsakes.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#DCD1C1] flex items-center justify-center text-[#283C2A] hover:bg-[#283C2A] hover:text-[#FEF7ED] transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href={`https://wa.me/${siteConfig.whatsappClean || siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  "Hello The Pookie Craft Co.! I have a question about your handmade pieces."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#DCD1C1] flex items-center justify-center text-[#283C2A] hover:bg-[#283C2A] hover:text-[#FEF7ED] transition-colors"
                aria-label="WhatsApp Studio"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>

              <a
                href="mailto:thepookiecraft@gmail.com"
                className="w-9 h-9 rounded-full border border-[#DCD1C1] flex items-center justify-center text-[#283C2A] hover:bg-[#283C2A] hover:text-[#FEF7ED] transition-colors"
                aria-label="Email Studio"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore Studio Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm tracking-widest uppercase font-normal text-[#283C2A] border-b border-[#DCD1C1] pb-2 inline-block">
              Explore Studio
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider uppercase font-medium text-[#687060] pt-1">
              <li>
                <Link href="/shop" className="hover:text-[#967F4F] transition-colors">
                  The Collection
                </Link>
              </li>
              <li>
                <Link href="/story" className="hover:text-[#967F4F] transition-colors">
                  Our Story &amp; Craft
                </Link>
              </li>
              <li>
                <Link href="/custom-orders" className="hover:text-[#967F4F] transition-colors">
                  Custom Craft Requests
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#967F4F] transition-colors"
                >
                  Instagram Studio Journal
                </a>
              </li>
            </ul>
          </div>

          {/* Artisan Promise Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-sm tracking-widest uppercase font-normal text-[#283C2A] border-b border-[#DCD1C1] pb-2 inline-block">
              Artisan Promise
            </h4>
            <div className="space-y-3 pt-1 text-xs text-[#687060] font-light">
              <div className="flex items-start space-x-3">
                <Heart className="w-4 h-4 text-[#967F4F] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>100% Handcrafted with love in small artisan batches in India.</span>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="w-4 h-4 text-[#967F4F] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>Standard delivery within 5–7 working days with safe eco-packaging.</span>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-4 h-4 text-[#967F4F] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>Direct artisan handshake via WhatsApp &amp; Instagram with personalized support.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#687060] gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Handcrafted with Love in India.</p>
          <div className="flex items-center space-x-6">
            <span>India Standard Delivery</span>
            <span className="text-[#967F4F]">●</span>
            <span>WhatsApp Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
