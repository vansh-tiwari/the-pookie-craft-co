"use client";

import React from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  totalCount: number;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onToggleInStock,
  totalCount,
}: CategoryFilterProps) {
  return (
    <div className="space-y-6 mb-10">
      {/* Top Search, Ready to Ship Toggle, and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#687060] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search forever flowers, IPL keychains, Lumiflowers..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm placeholder-[#687060]/70 text-[#283C2A] focus:outline-none focus:border-[#283C2A] transition-colors font-sans"
          />
        </div>

        {/* Right Sort & Filters */}
        <div className="flex items-center space-x-4 justify-between sm:justify-end">
          <span className="text-xs font-sans font-light text-[#687060]">
            {totalCount} {totalCount === 1 ? "piece" : "pieces"}
          </span>

          {/* In Stock Toggle */}
          <button
            onClick={onToggleInStock}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-sm text-xs font-sans tracking-wider uppercase transition-colors border ${
              inStockOnly
                ? "bg-[#283C2A] text-[#FEF7ED] border-[#283C2A]"
                : "bg-[#FFFDF9] text-[#687060] border-[#DCD1C1] hover:text-[#283C2A]"
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center border ${
                inStockOnly ? "bg-[#967F4F] border-[#967F4F] text-[#FEF7ED]" : "border-[#DCD1C1]"
              }`}
            >
              {inStockOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>Ready to Ship</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm pl-3 pr-8 py-2 text-xs font-sans text-[#283C2A] focus:outline-none focus:border-[#283C2A] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="bestseller">Sort: Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#967F4F] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 text-[12px] font-sans tracking-[0.08em] uppercase rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                isActive
                  ? "bg-[#283C2A] text-[#FEF7ED] border-[#283C2A] font-medium"
                  : "bg-[#F6EFE3]/80 text-[#687060] border-[#DCD1C1] hover:border-[#283C2A] hover:text-[#283C2A]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
