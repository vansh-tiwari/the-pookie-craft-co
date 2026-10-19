"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";

const FILTER_TABS = [
  "All Drops",
  "Keychains & Charms",
  "Forever Flowers",
  "Lumiflowers & Lamps",
  "Under ₹199",
  "Under ₹299",
];

export function FeaturedSection() {
  const [activeTab, setActiveTab] = useState("All Drops");

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    if (activeTab === "All Drops") return true;
    if (activeTab === "Keychains & Charms") return product.category === "Keychains & Charms";
    if (activeTab === "Forever Flowers") return product.category === "Forever Flowers";
    if (activeTab === "Lumiflowers & Lamps") return product.category === "Lumiflowers & Lamps";
    if (activeTab === "Under ₹199") return product.price <= 199;
    if (activeTab === "Under ₹299") return product.price <= 299;
    return true;
  });

  return (
    <section className="py-20 md:py-28 bg-[#FEF7ED]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header with Double Brass Lines */}
        <div className="mb-12 md:mb-16 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-6 bg-[#967F4F]" />
            <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#967F4F] font-medium">
              Handcrafted Teasers
            </p>
            <span className="h-[1px] w-6 bg-[#967F4F]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] text-[#283C2A]">
            Featured Collection
          </h2>

          <p className="text-sm md:text-base font-sans font-light leading-relaxed max-w-xl mx-auto text-[#687060]">
            Explore our small-batch handmade creations, thoughtfully sculpted loop by loop and petal by petal.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[12px] font-sans tracking-[0.08em] uppercase rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-[#283C2A] text-[#FEF7ED] border-[#283C2A] font-medium"
                    : "bg-[#F6EFE3]/80 text-[#687060] border-[#DCD1C1] hover:border-[#283C2A] hover:text-[#283C2A]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 md:mt-16">
          <Link href="/shop" className="btn-secondary">
            View All Pieces
          </Link>
        </div>
      </div>
    </section>
  );
}
