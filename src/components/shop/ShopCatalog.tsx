"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Catalog } from "@/lib/catalog-types";
import { availability } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";
export function ShopCatalog({ catalog }: { catalog: Catalog }) {
  const params = useSearchParams();
  const aliases: Record<string, string> = {
    flowers: "Flowers & Bouquets",
    keychains: "Keychains",
    lamps: "Lamps & Decor",
    accessories: "Personalized Gifts",
  };
  const requested = params.get("category");
  const selected = requested ? aliases[requested] || requested : "All";
  const [category, setCategory] = useState(selected);
  const [query, setQuery] = useState("");
  const [color, setColor] = useState("");
  const [status, setStatus] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("featured");
  const [previous, setPrevious] = useState(params.get("category"));
  if (previous !== params.get("category")) {
    setPrevious(params.get("category"));
    setCategory(selected);
  }
  const colors = Array.from(
    new Set(
      catalog.products.flatMap((p) => p.colors?.map((c) => c.name) || []),
    ),
  ).sort();
  const products = catalog.products
    .filter(
      (p) =>
        (category === "All" ||
          p.category === category ||
          p.categories?.includes(category)) &&
        p.name.toLowerCase().includes(query.toLowerCase().trim()) &&
        (!color || p.colors?.some((c) => c.name === color)) &&
        (!status || availability(p) === status) &&
        (!max || p.price <= Number(max)),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : Number(!!b.featured) - Number(!!a.featured),
    );
  const reset = () => {
    setCategory("All");
    setQuery("");
    setColor("");
    setStatus("");
    setMax("");
    setSort("featured");
  };
  return (
    <div className="section-wrap shop-wrap">
      <p className="eyebrow">A LITTLE SOMETHING FOR EVERYONE</p>
      <h1>The happy little shop.</h1>
      <p className="intro-copy">
        Find a forever flower, a tiny keepsake, or your next favourite gift.
        Every piece has a little handmade heart.
      </p>
      <div className="shop-filters">
        <label>
          Find your happy
          <input
            type="search"
            placeholder="Search by product name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            {catalog.categories.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label>
          Colour
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="">All colours</option>
            {colors.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Availability
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All availability</option>
            {["Available", "Made to Order", "Sold Out"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Maximum price (₹)
          <input
            type="number"
            min="0"
            placeholder="Any budget"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured first</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="results-row">
        <p role="status">
          {products.length} little {products.length === 1 ? "find" : "finds"}
        </p>
        <button className="text-link" onClick={reset}>
          Reset filters
        </button>
      </div>
      {products.length ? (
        <div className="catalog-grid">
          {products.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">✿</span>
          <h2>No little finds just yet.</h2>
          <p>
            Try another colour or budget, or tell us what you’re dreaming of.
          </p>
          <button className="pill-button" onClick={reset}>
            Clear filters
          </button>
          <a href="/custom-orders" className="text-link">
            Request something custom ↗
          </a>
        </div>
      )}
    </div>
  );
}
