"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { RefreshCw } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const categoryMap: Record<string, string> = {
    keychains: "Keychains & Charms",
    flowers: "Forever Flowers",
    lamps: "Lumiflowers & Lamps",
    accessories: "Accessories",
  };

  const defaultCategory =
    initialCategoryParam && categoryMap[initialCategoryParam]
      ? categoryMap[initialCategoryParam]
      : "All";

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_PRODUCTS];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => p.in_stock);
    }

    if (sortBy === "bestseller") {
      result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, inStockOnly]);

  const handleReset = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("featured");
    setInStockOnly(false);
  };

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24 bg-[#FEF7ED] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Breadcrumb matching Crochet Cult */}
        <nav aria-label="Breadcrumb" className="border-b border-[#DCD1C1]/60 pb-3 mb-6">
          <ol className="flex items-center flex-wrap gap-2 text-[12px] font-sans font-light tracking-[0.06em] text-[#687060]">
            <li>
              <Link href="/" className="hover:text-[#283C2A] transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#967F4F]/50 text-[11px] font-serif">/</span>
              <span className="text-[#283C2A] font-normal" aria-current="page">
                Shop
              </span>
            </li>
          </ol>
        </nav>

        {/* Page Header matching Crochet Cult */}
        <div className="py-6 md:py-8 border-b border-[#DCD1C1] mb-8">
          <p className="text-[11px] font-sans tracking-[0.2em] uppercase mb-2 text-[#967F4F] font-medium">
            Handmade Studio Collection
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-serif text-4xl md:text-6xl font-light text-[#283C2A] leading-[1.05]">
              The Collection
            </h1>
            <p className="text-sm font-sans font-light text-[#687060] max-w-md">
              Every petal and loop is sculpted slowly by hand. Everlasting pipe cleaner blooms, sports jersey keychains, and ambient lamps.
            </p>
          </div>
        </div>

        {/* Filters */}
        <CategoryFilter
          categories={INITIAL_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          inStockOnly={inStockOnly}
          onToggleInStock={() => setInStockOnly((prev) => !prev)}
          totalCount={filteredProducts.length}
        />

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#FFFDF9] rounded-sm border border-[#DCD1C1] p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#F6EFE3] border border-[#DCD1C1] flex items-center justify-center mx-auto mb-4 text-2xl">
              🌸
            </div>
            <h3 className="font-serif text-xl text-[#283C2A] mb-2 font-normal">
              No matching pieces found
            </h3>
            <p className="text-xs text-[#687060] mb-6 font-sans font-light">
              We couldn&apos;t find any items matching your selected criteria. Try adjusting your search or filters.
            </p>
            <button
              onClick={handleReset}
              className="btn-secondary py-2.5 px-6 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FEF7ED] flex items-center justify-center font-sans text-xs text-[#687060]">
          Loading Studio Collection...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
