"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import type { Catalog } from "@/lib/catalog-types";
import { availability } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import type { Product } from "@/types";

export function ShopCatalog({ catalog }: { catalog: Catalog }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const aliases: Record<string, string> = {
    flowers: "Flowers & Bouquets",
    keychains: "Keychains",
    lamps: "Lamps & Decor",
    accessories: "Personalized Gifts",
  };

  // State initialized from URL query params
  const currentCategory = searchParams.get("category")
    ? aliases[searchParams.get("category")!] || searchParams.get("category")!
    : "All";
  const [category, setCategory] = useState(currentCategory);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [color, setColor] = useState(searchParams.get("color") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "featured");

  // Filter drawer/popover state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Sync state if searchParams change externally (e.g. Back button)
  useEffect(() => {
    const cat = searchParams.get("category");
    setCategory(cat ? aliases[cat] || cat : "All");
    setQuery(searchParams.get("q") || "");
    setColor(searchParams.get("color") || "");
    setStatus(searchParams.get("status") || "");
    setMaxPrice(searchParams.get("max") || "");
    setSort(searchParams.get("sort") || "featured");
  }, [searchParams]);

  // Push URL query when filters update
  const updateUrl = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextState = {
      category: category === "All" ? null : category,
      q: query.trim() || null,
      color: color || null,
      status: status || null,
      max: maxPrice || null,
      sort: sort === "featured" ? null : sort,
      ...overrides,
    };

    Object.entries(nextState).forEach(([key, val]) => {
      if (val) params.set(key, val);
      else params.delete(key);
    });

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  // Close filter popover on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(e.target as Node) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(e.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  // Close popover on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFilterOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Compute available colors across all products
  const allColors = Array.from(
    new Set(
      catalog.products.flatMap((p) => (p.colors || []).map((c) => c.name)),
    ),
  ).filter(Boolean);

  // Filter products
  const filteredProducts = catalog.products
    .filter((p) => {
      // Category filter
      if (category !== "All" && p.category !== category) return false;

      // Search query (name, description, tags, materials)
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = (p.tags || []).some((t) =>
          t.toLowerCase().includes(q),
        );
        const matchesMat = p.material?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTags && !matchesMat)
          return false;
      }

      // Color filter
      if (color) {
        const hasColor = (p.colors || []).some(
          (c) => c.name.toLowerCase() === color.toLowerCase(),
        );
        if (!hasColor) return false;
      }

      // Status filter
      if (status) {
        const pStatus = availability(p);
        if (pStatus !== status) return false;
      }

      // Max price filter
      if (maxPrice) {
        const num = Number(maxPrice);
        if (num > 0 && p.price > num) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      // Default: featured first, then bestsellers
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.bestseller && !b.bestseller) return -1;
      if (!a.bestseller && b.bestseller) return 1;
      return 0;
    });

  const activeFilterCount = [
    category !== "All",
    !!query,
    !!color,
    !!status,
    !!maxPrice,
    sort !== "featured",
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setCategory("All");
    setQuery("");
    setColor("");
    setStatus("");
    setMaxPrice("");
    setSort("featured");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-[#200E19]">
      {/* Compact Shop Header & Toolbar */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E5EC] pb-4">
          <div>
            <span className="eyebrow">Studio Atelier Collection</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#200E19] font-normal tracking-tight">
              All Creations
            </h1>
          </div>

          {/* Controls toolbar */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7E6875]"
              />
              <input
                type="search"
                placeholder="Search collection…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  updateUrl({ q: e.target.value });
                }}
                className="w-full pl-9 pr-3 py-2 text-xs font-sans rounded-[2px] border border-[#F0E5EC] bg-[#FFFFFF] text-[#200E19] focus:outline-none focus:ring-1 focus:ring-[#9B1B54]"
              />
            </div>

            {/* Filter Toggle Button */}
            <div className="relative">
              <button
                ref={filterButtonRef}
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-sans font-medium rounded-[2px] border transition-colors ${
                  activeFilterCount > 0 || isFilterOpen
                    ? "border-[#9B1B54] bg-[#9B1B54] text-[#FFFFFF]"
                    : "border-[#F0E5EC] bg-[#FFFFFF] text-[#200E19] hover:border-[#9B1B54]"
                }`}
                aria-expanded={isFilterOpen}
                aria-haspopup="dialog"
              >
                <SlidersHorizontal size={13} />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FFFFFF] text-[#9B1B54] text-[9px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Desktop Anchored Filter Popover */}
              {isFilterOpen && (
                <div
                  ref={filterPopoverRef}
                  className="hidden sm:block absolute right-0 top-full mt-2 w-80 bg-[#FFFFFF] border border-[#F0E5EC] rounded-[4px] shadow-atelier z-40 p-5 space-y-4"
                  role="dialog"
                  aria-label="Filter options"
                >
                  <div className="flex justify-between items-center border-b border-[#F0E5EC] pb-2">
                    <span className="font-serif text-lg font-medium text-[#200E19]">
                      Filter Collection
                    </span>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-[#7E6875] hover:text-[#200E19]"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Availability */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-[#200E19] block">
                      Availability
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
                      {["Available", "Made to Order", "Sold Out"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            const next = status === st ? "" : st;
                            setStatus(next);
                            updateUrl({ status: next });
                          }}
                          className={`px-2.5 py-1.5 rounded-[2px] border text-left transition-all ${
                            status === st
                              ? "border-[#9B1B54] bg-[#9B1B54] text-[#FFFFFF] font-medium"
                              : "border-[#F0E5EC] text-[#7E6875] hover:bg-[#FCF8FA] hover:border-[#9B1B54]"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colour Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-[#200E19] block">
                      Colour
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                      {allColors.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => {
                            const next = color === col ? "" : col;
                            setColor(next);
                            updateUrl({ color: next });
                          }}
                          className={`px-2.5 py-1 rounded-[2px] text-[11px] font-sans border transition-all ${
                            color === col
                              ? "border-[#9B1B54] bg-[#9B1B54] text-[#FFFFFF]"
                              : "border-[#F0E5EC] text-[#7E6875] hover:border-[#9B1B54]"
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-[#200E19] flex justify-between">
                      <span>Maximum Price</span>
                      <span className="font-semibold text-[#200E19]">
                        {maxPrice ? `₹${Number(maxPrice).toLocaleString("en-IN")}` : "Any"}
                      </span>
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={2500}
                      step={50}
                      value={maxPrice || 2500}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        updateUrl({ max: e.target.value });
                      }}
                      className="w-full accent-[#9B1B54]"
                    />
                  </div>

                  {/* Popover Actions */}
                  <div className="pt-2 border-t border-[#F0E5EC] flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setColor("");
                        setStatus("");
                        setMaxPrice("");
                        updateUrl({ color: null, status: null, max: null });
                      }}
                      className="text-[#7E6875] hover:underline"
                    >
                      Reset filters
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="px-3.5 py-1.5 bg-[#9B1B54] text-[#FFFFFF] rounded-[2px] font-sans font-medium hover:bg-[#7D1342] transition-colors"
                    >
                      Apply ({filteredProducts.length})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  updateUrl({ sort: e.target.value });
                }}
                className="px-3 py-2 text-xs font-sans rounded-[2px] border border-[#F0E5EC] bg-[#FFFFFF] text-[#200E19] focus:outline-none focus:ring-1 focus:ring-[#9B1B54] appearance-none pr-8 cursor-pointer"
              >
                <option value="featured">Featured first</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7E6875] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setCategory("All");
              updateUrl({ category: null });
            }}
            className={`px-3.5 py-1.5 text-xs font-sans rounded-[2px] whitespace-nowrap transition-all ${
              category === "All"
                ? "bg-[#9B1B54] text-[#FFFFFF] font-semibold shadow-xs"
                : "bg-[#FFFFFF] text-[#7E6875] border border-[#F0E5EC] hover:text-[#200E19] hover:border-[#9B1B54]"
            }`}
          >
            All Creations
          </button>
          {catalog.categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.name);
                updateUrl({ category: cat.name });
              }}
              className={`px-3.5 py-1.5 text-xs font-sans rounded-[2px] whitespace-nowrap transition-all ${
                category === cat.name
                  ? "bg-[#9B1B54] text-[#FFFFFF] font-semibold shadow-xs"
                  : "bg-[#FFFFFF] text-[#7E6875] border border-[#F0E5EC] hover:text-[#200E19] hover:border-[#9B1B54]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Active Filter Chips & Result Count */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-sans pt-1">
          <span className="text-[#7E6875]">
            Showing <strong className="text-[#200E19]">{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "creation" : "creations"}
          </span>

          {(category !== "All" ||
            query ||
            color ||
            status ||
            maxPrice ||
            sort !== "featured") && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {category !== "All" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#FCF8FA] border border-[#F0E5EC] text-[#200E19] text-[11px]">
                  {category}
                  <button
                    onClick={() => {
                      setCategory("All");
                      updateUrl({ category: null });
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {color && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#FCF8FA] border border-[#F0E5EC] text-[#200E19] text-[11px]">
                  Colour: {color}
                  <button
                    onClick={() => {
                      setColor("");
                      updateUrl({ color: null });
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {status && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#FCF8FA] border border-[#F0E5EC] text-[#200E19] text-[11px]">
                  {status}
                  <button
                    onClick={() => {
                      setStatus("");
                      updateUrl({ status: null });
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {maxPrice && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#FCF8FA] border border-[#F0E5EC] text-[#200E19] text-[11px]">
                  ≤ ₹{maxPrice}
                  <button
                    onClick={() => {
                      setMaxPrice("");
                      updateUrl({ max: null });
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[#9B1B54] hover:underline font-medium ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet Filters */}
      {isFilterOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-[#FFFFFF] rounded-t-xl p-5 max-h-[65vh] overflow-y-auto space-y-4 border-t border-[#F0E5EC] shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#F0E5EC] pb-3">
              <h3 className="font-serif text-lg font-medium text-[#200E19]">Filter Collection</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-full bg-[#FCF8FA] text-[#200E19]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile Availability */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#200E19] block">
                Availability
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {["Available", "Made to Order", "Sold Out"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      const next = status === st ? "" : st;
                      setStatus(next);
                      updateUrl({ status: next });
                    }}
                    className={`py-2 px-1 text-center rounded-[2px] border text-xs font-sans ${
                      status === st
                        ? "border-[#9B1B54] bg-[#9B1B54] text-[#FFFFFF] font-medium"
                        : "border-[#F0E5EC] text-[#7E6875]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Colours */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#200E19] block">
                Colour
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {allColors.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      const next = color === col ? "" : col;
                      setColor(next);
                      updateUrl({ color: next });
                    }}
                    className={`px-3 py-1 rounded-[2px] text-xs font-sans border ${
                      color === col
                        ? "border-[#9B1B54] bg-[#9B1B54] text-[#FFFFFF]"
                        : "border-[#F0E5EC] text-[#7E6875]"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-2 border-t border-[#F0E5EC] flex gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-[2px] border border-[#F0E5EC] text-xs font-sans font-medium text-[#200E19]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-2.5 rounded-[2px] bg-[#9B1B54] text-[#FFFFFF] text-xs font-sans font-medium hover:bg-[#7D1342]"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid with Framer Motion Layout Transitions */}
      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {filteredProducts.map((p, idx) => (
            <ProductCard
              key={p.id}
              product={p}
              priority={idx < 4}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#FFFFFF] rounded-[4px] border border-[#F0E5EC]">
          <span className="text-3xl font-serif text-[#9B1B54] block mb-2">✿</span>
          <h2 className="font-serif text-2xl font-normal text-[#200E19] mb-2">
            No gifts found matching your filters
          </h2>
          <p className="text-xs text-[#7E6875] font-sans max-w-md mx-auto mb-6">
            Try adjusting your colour, price, or search term, or commission a bespoke creation with our artisans.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-[#9B1B54] text-[#FFFFFF] text-xs font-sans font-medium rounded-[2px] hover:bg-[#7D1342] transition-colors"
            >
              Clear all filters
            </button>
            <a
              href="/custom-orders"
              className="px-5 py-2.5 border border-[#9B1B54] text-[#9B1B54] text-xs font-sans font-medium rounded-[2px] hover:bg-[#9B1B54] hover:text-[#FFFFFF] transition-colors"
            >
              Commission a Custom Creation ↗
            </a>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
