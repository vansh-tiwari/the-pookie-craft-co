"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Layers,
  LayoutTemplate,
  MessageSquareQuote,
  Inbox,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Check,
  X,
  ExternalLink,
  RotateCcw,
  Download,
  Upload,
  AlertCircle,
  HelpCircle,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";

import type { Catalog, Category, Review } from "@/lib/catalog-types";
import { availability } from "@/lib/catalog-types";
import type { Product } from "@/types";
import type { CustomRequest } from "@/lib/requests";
import { ProductCard } from "@/components/shop/ProductCard";
import { validateCatalog } from "@/lib/validation";

const uid = () => crypto.randomUUID();

const emptyProduct = (category: string): Product => ({
  id: uid(),
  slug: "",
  name: "",
  description: "",
  price: 0,
  category,
  images: [],
  image_url: "",
  availability: "Made to Order",
  startingPrice: true,
  created_at: new Date().toISOString(),
  colors: [],
  variants: [],
});

function ImageUpload({
  onImages,
  multiple = false,
}: {
  onImages: (images: string[]) => void;
  multiple?: boolean;
}) {
  const [error, setError] = useState("");
  return (
    <div>
      <label className="border-2 border-dashed border-[#E8E2D8] hover:border-[#967F4F] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] rounded-[4px] p-6 text-center cursor-pointer transition-colors block group">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#FCFBF9] border border-[#E8E2D8] flex items-center justify-center text-[#967F4F] group-hover:scale-105 transition-transform">
            <Upload size={18} />
          </div>
          <span className="text-xs font-sans font-medium text-[#1C281F]">
            Upload {multiple ? "Product Photos" : "Cover Image"}
          </span>
          <span className="text-[11px] font-sans text-[#667264]">
            JPG, PNG, or WebP · Max 350 KB each {multiple ? "(Up to 8 photos)" : ""}
          </span>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={async (e) => {
            setError("");
            try {
              const files = Array.from(e.target.files || []);
              if (files.length > 8) throw new Error("Choose at most 8 photos.");
              const values = await Promise.all(
                files.map(async (f) => {
                  if (
                    f.size > 350000 ||
                    !["image/jpeg", "image/png", "image/webp"].includes(f.type)
                  )
                    throw new Error(
                      "Use JPG, PNG, or WebP images under 350 KB each.",
                    );
                  return await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result));
                    reader.onerror = () =>
                      reject(new Error("Image could not be read."));
                    reader.readAsDataURL(f);
                  });
                }),
              );
              onImages(values);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Upload failed.");
            }
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p role="alert" className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-[2px] mt-2 border border-rose-200">
          {error}
        </p>
      )}
    </div>
  );
}

export function AdminDashboard({
  initial,
  initialRequests,
}: {
  initial: Catalog;
  initialRequests: CustomRequest[];
}) {
  const router = useRouter();
  const [catalog, setCatalog] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [tab, setTab] = useState<"Products" | "Categories" | "Homepage" | "Reviews" | "Custom requests">("Products");
  const [product, setProduct] = useState<Product | null>(null);
  const [requests, setRequests] = useState(initialRequests);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);

  const dirty = JSON.stringify(catalog) !== saved;
  const [editorDirty, setEditorDirty] = useState(false);

  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      if (dirty || editorDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [dirty, editorDirty]);

  function update(next: Catalog) {
    setCatalog(next);
    setNotice("");
  }

  function patchProduct(next: Partial<Product>) {
    setProduct((p) => (p ? { ...p, ...next } : p));
    setEditorDirty(true);
  }

  function leaveEditor() {
    if (editorDirty && !confirm("Discard this unsaved product edit?"))
      return false;
    setProduct(null);
    setEditorDirty(false);
    return true;
  }

  async function publish() {
    setBusy(true);
    setNotice("");
    try {
      const r = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catalog),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setCatalog(d);
      setSaved(JSON.stringify(d));
      setNotice("Published! Your storefront now features these changes.");
      router.refresh();
    } catch (e) {
      setNotice(
        e instanceof Error
          ? e.message
          : "Publishing failed. Your edits remain in this tab.",
      );
    } finally {
      setBusy(false);
    }
  }

  function move<T>(items: T[], i: number, d: number) {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= items.length) return next;
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  }

  function exportBackup() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(catalog, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `pookie-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function reload() {
    if (
      (dirty || editorDirty) &&
      !confirm("Discard all unsaved changes and load published content?")
    )
      return;
    try {
      const r = await fetch("/api/admin/content");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setCatalog(d);
      setSaved(JSON.stringify(d));
      setProduct(null);
      setEditorDirty(false);
      setNotice("Published content reloaded successfully.");
    } catch {
      setNotice("Could not reload. Your draft is unchanged.");
    }
  }

  const textField = (
    label: string,
    value: string,
    onChange: (s: string) => void,
    required = false,
    placeholder = "",
  ) => (
    <div>
      <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
        {label}
        {required && <span className="text-rose-600 ml-0.5">*</span>}
      </label>
      <input
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C281F] pb-24">
      {/* 1. Atelier Top Header & Toolbar */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8] shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Brand Lockup */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#967F4F]/40 bg-[#F2EDE4] flex-shrink-0">
                <Image
                  src="/images/instagram/logo.jpg"
                  alt="The Pookie Craft Co."
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block font-serif text-[17px] text-[#1C281F] font-medium leading-none">
                  The Pookie Craft Co.
                </span>
                <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#967F4F] font-semibold">
                  Owner Studio Atelier
                </span>
              </div>

              {/* Save Status Badge */}
              <div className="ml-3 pl-3 border-l border-[#E8E2D8] hidden sm:flex items-center gap-2">
                {dirty || editorDirty ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Unsaved changes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Check size={11} className="text-emerald-600" />
                    All saved
                  </span>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-sans">
              <button
                type="button"
                onClick={reload}
                title="Discard draft and fetch published content"
                className="px-3 py-2 bg-[#FCFBF9] hover:bg-[#F2EDE4] border border-[#E8E2D8] text-[#1C281F] rounded-[3px] transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reload</span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#FCFBF9] hover:bg-[#F2EDE4] border border-[#E8E2D8] text-[#1C281F] rounded-[3px] transition-colors inline-flex items-center gap-1.5"
              >
                <span>Storefront</span>
                <ExternalLink size={12} />
              </a>

              <button
                type="button"
                onClick={exportBackup}
                title="Download entire catalog as JSON backup"
                className="px-3 py-2 bg-[#FCFBF9] hover:bg-[#F2EDE4] border border-[#E8E2D8] text-[#1C281F] rounded-[3px] transition-colors inline-flex items-center gap-1.5"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Backup</span>
              </button>

              <label
                title="Restore content from a JSON backup file"
                className="px-3 py-2 bg-[#FCFBF9] hover:bg-[#F2EDE4] border border-[#E8E2D8] text-[#1C281F] rounded-[3px] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload size={13} />
                <span className="hidden sm:inline">Restore</span>
                <input
                  type="file"
                  className="hidden"
                  accept="application/json"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      if (f.size > 4 * 1024 * 1024) throw new Error();
                      const data = JSON.parse(await f.text());
                      validateCatalog({ ...data, version: catalog.version });
                      if (
                        !Array.isArray(data.products) ||
                        !Array.isArray(data.categories) ||
                        !Array.isArray(data.reviews) ||
                        !data.home
                      )
                        throw new Error();
                      if (
                        !confirm(
                          "Load this backup into your draft? Review it before publishing.",
                        )
                      )
                        return;
                      setCatalog({ ...data, version: catalog.version });
                      setProduct(null);
                      setEditorDirty(false);
                      setNotice(
                        "Backup loaded into draft. Review before publishing.",
                      );
                    } catch {
                      setNotice(
                        "Invalid backup. Choose a content backup under 4 MB.",
                      );
                    }
                    e.target.value = "";
                  }}
                />
              </label>

              <button
                type="button"
                disabled={!dirty || busy || editorDirty}
                onClick={publish}
                className="px-4 py-2 bg-[#1C281F] hover:bg-[#967F4F] disabled:bg-[#1C281F]/40 text-[#FAF7F2] font-semibold uppercase tracking-[0.12em] text-[11px] rounded-[3px] shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <Sparkles size={13} />
                <span>{busy ? "Publishing…" : "Publish Changes"}</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (
                    (dirty || editorDirty) &&
                    !confirm("Sign out and discard unsaved changes?")
                  )
                    return;
                  const r = await fetch("/api/admin/session", { method: "DELETE" });
                  if (r.ok) router.refresh();
                  else setNotice("Sign out failed. Please try again.");
                }}
                className="p-2 text-[#667264] hover:text-rose-700 transition-colors"
                title="Sign out of Owner Studio"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Feedback Notification Pill */}
      {notice && (
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="p-3 bg-[#FCFBF9] border border-[#967F4F]/40 text-[#1C281F] rounded-[4px] shadow-xs flex items-center justify-between text-xs font-sans"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-[#967F4F]" />
              <span>{notice}</span>
            </div>
            <button
              onClick={() => setNotice("")}
              className="text-[#667264] hover:text-[#1C281F]"
            >
              <X size={14} />
            </button>
          </motion.div>
        </div>
      )}

      {/* 3. Main Dashboard Body */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E2D8] overflow-x-auto pb-px mb-8">
          {[
            { id: "Products", label: "Catalog Products", icon: Package, count: catalog.products.length },
            { id: "Categories", label: "Categories", icon: Layers, count: catalog.categories.length },
            { id: "Homepage", label: "Homepage Story", icon: LayoutTemplate },
            { id: "Reviews", label: "Patron Reviews", icon: MessageSquareQuote, count: catalog.reviews.length },
            { id: "Custom requests", label: "Studio Inbox", icon: Inbox, count: requests.length },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (leaveEditor()) setTab(item.id as typeof tab);
                }}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-sans uppercase tracking-[0.14em] font-medium border-b-2 whitespace-nowrap transition-all ${
                  active
                    ? "border-[#967F4F] text-[#1C281F] font-semibold bg-[#FCFBF9]/60"
                    : "border-transparent text-[#667264] hover:text-[#1C281F] hover:border-[#E8E2D8]"
                }`}
              >
                <Icon size={14} className={active ? "text-[#967F4F]" : "text-[#8C988A]"} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active
                        ? "bg-[#1C281F] text-[#FAF7F2]"
                        : "bg-[#E8E2D8] text-[#5D685B]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: PRODUCTS
        ======================================================== */}
        {tab === "Products" && (
          <div className="space-y-6">
            {!product ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4">
                  <div>
                    <span className="eyebrow">Studio Inventory</span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#1C281F] font-normal">
                      Handcrafted Catalog ({catalog.products.length})
                    </h2>
                    <p className="text-xs font-sans text-[#667264] mt-1">
                      Drag or move up/down to curate featured placement and best-seller rank.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (leaveEditor()) {
                        setProduct(emptyProduct(catalog.categories[0]?.name || ""));
                        setPreview(false);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] font-sans text-xs font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all"
                  >
                    <Plus size={14} />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Product Grid / Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalog.products.map((p, i) => {
                    const status = availability(p);
                    return (
                      <div
                        key={p.id}
                        className="bg-[#FCFBF9] border border-[#E8E2D8] hover:border-[#967F4F]/40 rounded-[4px] p-4 flex gap-4 transition-all shadow-xs group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-24 rounded-[2px] overflow-hidden bg-[#F2EDE4] border border-[#E8E2D8] flex-shrink-0">
                          {p.image_url ? (
                            <Image
                              src={p.image_url}
                              alt={p.name}
                              fill
                              sizes="100px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#967F4F]">
                              <ImageIcon size={20} />
                            </div>
                          )}
                          <span
                            className={`absolute bottom-0 inset-x-0 text-[8.5px] font-sans uppercase tracking-[0.1em] text-center py-0.5 text-white ${
                              status === "Available"
                                ? "bg-emerald-700/90"
                                : status === "Made to Order"
                                  ? "bg-[#542034]/90"
                                  : "bg-stone-600/90"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="font-serif text-base text-[#1C281F] font-normal leading-tight line-clamp-1">
                                {p.name}
                              </h3>
                            </div>
                            <p className="text-xs font-sans text-[#667264] mt-0.5">
                              {p.category} · <span className="font-semibold text-[#1C281F]">₹{p.price}</span>
                              {p.startingPrice && <span className="text-[10px] text-[#967F4F] ml-1">(From)</span>}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                              {p.featured && (
                                <span className="text-[9.5px] font-sans font-semibold uppercase tracking-[0.1em] px-1.5 py-0.2 bg-[#FAF7F2] border border-[#967F4F]/40 text-[#967F4F] rounded-[2px]">
                                  Featured
                                </span>
                              )}
                              {p.bestseller && (
                                <span className="text-[9.5px] font-sans font-semibold uppercase tracking-[0.1em] px-1.5 py-0.2 bg-[#1C281F] text-[#FAF7F2] rounded-[2px]">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Control Strip */}
                          <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D8] mt-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                aria-label={`Move ${p.name} up`}
                                disabled={i === 0}
                                onClick={() =>
                                  update({
                                    ...catalog,
                                    products: move(catalog.products, i, -1),
                                  })
                                }
                                className="p-1.5 text-[#667264] hover:text-[#1C281F] disabled:opacity-30 disabled:hover:text-[#667264] transition-colors"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                type="button"
                                aria-label={`Move ${p.name} down`}
                                disabled={i === catalog.products.length - 1}
                                onClick={() =>
                                  update({
                                    ...catalog,
                                    products: move(catalog.products, i, 1),
                                  })
                                }
                                className="p-1.5 text-[#667264] hover:text-[#1C281F] disabled:opacity-30 disabled:hover:text-[#667264] transition-colors"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setProduct(structuredClone(p));
                                  setPreview(false);
                                }}
                                className="px-2.5 py-1 text-xs font-sans font-semibold text-[#1C281F] hover:text-[#967F4F] border border-[#E8E2D8] hover:border-[#967F4F] rounded-[2px] transition-colors inline-flex items-center gap-1"
                              >
                                <Edit3 size={11} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Delete “${p.name}”? Remember to publish changes to update storefront.`,
                                    )
                                  )
                                    update({
                                      ...catalog,
                                      products: catalog.products.filter(
                                        (x) => x.id !== p.id,
                                      ),
                                    });
                                }}
                                className="p-1.5 text-[#667264] hover:text-rose-700 transition-colors"
                                title="Delete creation"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* PRODUCT EDITOR VIEW */
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!product.images.length) {
                    setNotice("Please add at least one product image.");
                    return;
                  }
                  if (
                    catalog.products.some(
                      (p) => p.id !== product.id && p.slug === product.slug,
                    )
                  ) {
                    setNotice("Choose a unique product URL slug.");
                    return;
                  }
                  update({
                    ...catalog,
                    products: catalog.products.some((p) => p.id === product.id)
                      ? catalog.products.map((p) =>
                          p.id === product.id ? product : p,
                        )
                      : [...catalog.products, product],
                  });
                  setProduct(null);
                  setEditorDirty(false);
                }}
              >
                {/* Editor Header */}
                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 pb-4 border-b border-[#E8E2D8]">
                  <div>
                    <span className="eyebrow">Studio Atelier Editor</span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#1C281F] font-normal">
                      {catalog.products.some((p) => p.id === product.id)
                        ? `Editing “${product.name}”`
                        : "Craft a New Product"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreview(!preview)}
                      className="px-3.5 py-2 bg-[#FCFBF9] hover:bg-[#F2EDE4] border border-[#E8E2D8] text-xs font-sans text-[#1C281F] rounded-[3px] transition-colors inline-flex items-center gap-1.5"
                    >
                      {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{preview ? "Hide Preview" : "Live Card Preview"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={leaveEditor}
                      className="px-3.5 py-2 border border-[#E8E2D8] hover:bg-rose-50 text-xs font-sans text-[#667264] hover:text-rose-700 rounded-[3px] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] font-sans text-xs font-semibold tracking-[0.12em] uppercase rounded-[3px] shadow-sm transition-all"
                    >
                      Save to Draft
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Cards */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Card 1: Core Product Attributes */}
                    <div className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-6 space-y-5">
                      <h3 className="font-serif text-lg text-[#1C281F] border-b border-[#E8E2D8] pb-2">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {textField(
                          "Product Name",
                          product.name,
                          (v) => patchProduct({ name: v }),
                          true,
                          "e.g. Forever Yellow Sunflower Bouquet",
                        )}
                        <div>
                          <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                            Product URL Slug <span className="text-rose-600">*</span>
                          </label>
                          <input
                            required
                            pattern="[a-z0-9]+(-[a-z0-9]+)*"
                            maxLength={150}
                            value={product.slug}
                            placeholder="forever-yellow-sunflower-bouquet"
                            onChange={(e) => patchProduct({ slug: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                          />
                          <p className="text-[10.5px] text-[#8C988A] mt-1">
                            URL on storefront: /product/{product.slug || "example-slug"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                            Price (₹) <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="1000000"
                            step="0.01"
                            required
                            value={product.price}
                            onChange={(e) =>
                              patchProduct({ price: e.target.valueAsNumber || 0 })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                            Main Category
                          </label>
                          <select
                            value={product.category}
                            onChange={(e) => patchProduct({ category: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                          >
                            {catalog.categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                            Availability
                          </label>
                          <select
                            value={availability(product)}
                            onChange={(e) =>
                              patchProduct({
                                availability: e.target.value as Product["availability"],
                                in_stock: e.target.value !== "Sold Out",
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                          >
                            {["Available", "Sold Out", "Made to Order"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Additional Categories */}
                      <div>
                        <span className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-2">
                          Additional Display Categories
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          {catalog.categories
                            .filter((c) => c.name !== product.category)
                            .map((c) => {
                              const checked = product.categories?.includes(c.name) || false;
                              return (
                                <label
                                  key={c.id}
                                  className={`px-3 py-1.5 rounded-[3px] text-xs font-sans cursor-pointer border transition-colors inline-flex items-center gap-1.5 ${
                                    checked
                                      ? "bg-[#1C281F] text-white border-[#1C281F]"
                                      : "bg-white text-[#5D685B] border-[#E8E2D8] hover:border-[#967F4F]"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={checked}
                                    onChange={(e) =>
                                      patchProduct({
                                        categories: e.target.checked
                                          ? [...(product.categories || []), c.name]
                                          : product.categories?.filter(
                                              (x) => x !== c.name,
                                            ),
                                      })
                                    }
                                  />
                                  <span>{c.name}</span>
                                </label>
                              );
                            })}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                          Product Story &amp; Description <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                          required
                          maxLength={5000}
                          rows={4}
                          value={product.description}
                          placeholder="Describe the artisan craft, materials, dimensions, and styling notes..."
                          onChange={(e) =>
                            patchProduct({ description: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                        />
                      </div>

                      {/* Dimension and Material Specifications */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {textField(
                          "Dimensions / Size",
                          product.dimensions || "",
                          (v) => patchProduct({ dimensions: v || undefined }),
                          false,
                          "e.g. Height 32 cm · Spread 18 cm",
                        )}
                        {textField(
                          "Materials",
                          product.material || "",
                          (v) => patchProduct({ material: v || undefined }),
                          false,
                          "e.g. Plush chenille wire, floral tape, kraft wrap",
                        )}
                      </div>

                      {/* Storefront Switches */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8E2D8]">
                        {[
                          ["startingPrice", "Starting price (final quote varies)"],
                          ["featured", "Featured on Studio Homepage"],
                          ["bestseller", "Mark as Patron Bestseller"],
                          ["personalizationRequired", "Personalization note is required"],
                        ].map(([k, label]) => {
                          const isChecked = !!product[k as keyof Product];
                          return (
                            <label
                              key={k}
                              className="flex items-center gap-2.5 text-xs font-sans text-[#1C281F] cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                  patchProduct({ [k]: e.target.checked })
                                }
                                className="w-4 h-4 rounded-[2px] text-[#967F4F] focus:ring-[#967F4F] border-[#E8E2D8]"
                              />
                              <span>{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card 2: Imagery & Gallery */}
                    <div className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-6 space-y-4">
                      <div className="flex justify-between items-baseline border-b border-[#E8E2D8] pb-2">
                        <h3 className="font-serif text-lg text-[#1C281F]">
                          Product Photography ({product.images.length}/8)
                        </h3>
                        <span className="text-[11px] font-sans text-[#667264]">
                          First image is default catalog cover
                        </span>
                      </div>

                      {product.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {product.images.map((src, i) => (
                            <div
                              key={i}
                              className="relative aspect-[4/5] rounded-[3px] overflow-hidden bg-[#F2EDE4] border border-[#E8E2D8] group"
                            >
                              <Image
                                src={src}
                                alt={`Product photo ${i + 1}`}
                                fill
                                sizes="150px"
                                className="object-cover"
                              />
                              {i === 0 && (
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#1C281F] text-white text-[9px] font-sans font-semibold uppercase tracking-wider rounded-[2px]">
                                  Cover
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  patchProduct({
                                    images: product.images.filter((_, j) => i !== j),
                                    image_url:
                                      product.images.filter((_, j) => i !== j)[0] || "",
                                  })
                                }
                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                title="Remove photo"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <ImageUpload
                        multiple
                        onImages={(images) => {
                          const all = [...product.images, ...images].slice(0, 8);
                          patchProduct({ images: all, image_url: all[0] || "" });
                        }}
                      />
                    </div>

                    {/* Card 3: Color Swatches & Variants */}
                    <div className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-6 space-y-6">
                      <h3 className="font-serif text-lg text-[#1C281F] border-b border-[#E8E2D8] pb-2">
                        Options &amp; Customization
                      </h3>

                      {/* Colors */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F]">
                            Available Color Swatches
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              patchProduct({
                                colors: [
                                  ...(product.colors || []),
                                  { name: "Petal Pink", hex: "#EEAABB" },
                                ],
                              })
                            }
                            className="text-xs font-sans text-[#967F4F] hover:text-[#1C281F] font-semibold inline-flex items-center gap-1"
                          >
                            <Plus size={13} />
                            <span>Add Color</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {product.colors?.map((c, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input
                                aria-label={`Colour ${i + 1} name`}
                                required
                                value={c.name}
                                placeholder="Color name (e.g. Sunflower Yellow)"
                                onChange={(e) =>
                                  patchProduct({
                                    colors: product.colors?.map((x, j) =>
                                      j === i ? { ...x, name: e.target.value } : x,
                                    ),
                                  })
                                }
                                className="flex-1 px-3 py-2 bg-white border border-[#E8E2D8] rounded-[2px] text-xs text-[#1C281F] outline-none"
                              />
                              <input
                                aria-label={`Colour ${i + 1} swatch`}
                                type="color"
                                value={c.hex}
                                onChange={(e) =>
                                  patchProduct({
                                    colors: product.colors?.map((x, j) =>
                                      j === i ? { ...x, hex: e.target.value } : x,
                                    ),
                                  })
                                }
                                className="w-9 h-9 p-0.5 bg-white border border-[#E8E2D8] rounded-[2px] cursor-pointer"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  patchProduct({
                                    colors: product.colors?.filter((_, j) => j !== i),
                                  })
                                }
                                className="p-2 text-[#667264] hover:text-rose-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Variants / Arrangements */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F]">
                            Product Option Groups (e.g. Size, Arrangement)
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              patchProduct({
                                variants: [
                                  ...(product.variants || []),
                                  { name: "Arrangement", options: ["Single Stem", "Trio"] },
                                ],
                              })
                            }
                            className="text-xs font-sans text-[#967F4F] hover:text-[#1C281F] font-semibold inline-flex items-center gap-1"
                          >
                            <Plus size={13} />
                            <span>Add Option Group</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {product.variants?.map((v, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-center gap-2">
                              <input
                                required
                                aria-label="Option name"
                                placeholder="Group Name (e.g. Arrangement)"
                                value={v.name}
                                onChange={(e) =>
                                  patchProduct({
                                    variants: product.variants?.map((x, j) =>
                                      j === i ? { ...x, name: e.target.value } : x,
                                    ),
                                  })
                                }
                                className="w-full sm:w-1/3 px-3 py-2 bg-white border border-[#E8E2D8] rounded-[2px] text-xs text-[#1C281F] outline-none"
                              />
                              <input
                                required
                                aria-label="Option choices, separated by commas"
                                placeholder="Choices separated by commas (e.g. Single, Trio, Grand Bouquet)"
                                value={v.options.join(", ")}
                                onChange={(e) =>
                                  patchProduct({
                                    variants: product.variants?.map((x, j) =>
                                      j === i
                                        ? {
                                            ...x,
                                            options: e.target.value
                                              .split(",")
                                              .map((s) => s.trim())
                                              .filter(Boolean),
                                          }
                                        : x,
                                    ),
                                  })
                                }
                                className="w-full sm:flex-1 px-3 py-2 bg-white border border-[#E8E2D8] rounded-[2px] text-xs text-[#1C281F] outline-none"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  patchProduct({
                                    variants: product.variants?.filter((_, j) => j !== i),
                                  })
                                }
                                className="p-2 text-[#667264] hover:text-rose-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Preview & Docked Actions */}
                  <div className="lg:col-span-4 sticky top-24 space-y-4">
                    <div className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-5 shadow-sm">
                      <span className="eyebrow !mb-2">Storefront Preview</span>
                      <h4 className="font-serif text-lg text-[#1C281F] mb-3">
                        Patron View
                      </h4>
                      <div className="border border-[#E8E2D8] rounded-[4px] p-3 bg-[#FAF7F2]">
                        <ProductCard product={product} />
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#E8E2D8] flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] font-sans text-xs font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all"
                        >
                          Save Draft
                        </button>
                        <button
                          type="button"
                          onClick={leaveEditor}
                          className="px-4 py-2.5 border border-[#E8E2D8] hover:bg-rose-50 text-xs font-sans text-[#667264] hover:text-rose-700 rounded-[3px] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: CATEGORIES
        ======================================================== */}
        {tab === "Categories" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4">
              <div>
                <span className="eyebrow">Taxonomy &amp; Collections</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C281F] font-normal">
                  Studio Categories ({catalog.categories.length})
                </h2>
                <p className="text-xs font-sans text-[#667264] mt-1">
                  Organize your creations. Categories in use cannot be deleted without reassigning products.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...catalog,
                    categories: [
                      ...catalog.categories,
                      {
                        id: uid(),
                        name: "New Category",
                        description: "",
                        image: "/images/products/sunflower_bouquet.jpg",
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] font-sans text-xs font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all"
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {catalog.categories.map((c, i) => {
                const patch = (next: Partial<Category>) => {
                  const name = next.name ?? c.name;
                  update({
                    ...catalog,
                    categories: catalog.categories.map((x) =>
                      x.id === c.id ? { ...x, ...next } : x,
                    ),
                    products: catalog.products.map((p) => ({
                      ...p,
                      category: p.category === c.name ? name : p.category,
                      categories: p.categories?.map((x) =>
                        x === c.name ? name : x,
                      ),
                    })),
                  });
                };
                const productCount = catalog.products.filter(
                  (p) => p.category === c.name || p.categories?.includes(c.name),
                ).length;

                return (
                  <div
                    key={c.id}
                    className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-[3px] overflow-hidden bg-[#F2EDE4] border border-[#E8E2D8] flex-shrink-0">
                        {c.image && (
                          <Image
                            src={c.image}
                            alt={c.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-sans uppercase tracking-[0.12em] text-[#967F4F] font-semibold">
                          {productCount} {productCount === 1 ? "Product" : "Products"}
                        </span>
                        <input
                          required
                          value={c.name}
                          onChange={(e) => patch({ name: e.target.value })}
                          className="font-serif text-lg text-[#1C281F] bg-transparent border-b border-transparent hover:border-[#E8E2D8] focus:border-[#967F4F] outline-none w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-sans font-semibold uppercase tracking-[0.1em] text-[#667264] mb-1">
                        Category Description
                      </label>
                      <textarea
                        rows={2}
                        value={c.description}
                        placeholder="Brief editorial description for search and filtering..."
                        onChange={(e) => patch({ description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#E8E2D8] focus:border-[#967F4F] rounded-[2px] text-xs text-[#1C281F] outline-none"
                      />
                    </div>

                    <ImageUpload
                      onImages={(images) => {
                        if (images[0]) patch({ image: images[0] });
                      }}
                    />

                    <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D8]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() =>
                            update({
                              ...catalog,
                              categories: move(catalog.categories, i, -1),
                            })
                          }
                          className="p-1.5 text-[#667264] hover:text-[#1C281F] disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={i === catalog.categories.length - 1}
                          onClick={() =>
                            update({
                              ...catalog,
                              categories: move(catalog.categories, i, 1),
                            })
                          }
                          className="p-1.5 text-[#667264] hover:text-[#1C281F] disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (productCount > 0) {
                            setNotice(
                              `Cannot delete “${c.name}” while ${productCount} products are assigned to it. Reassign products first.`,
                            );
                            return;
                          }
                          if (confirm(`Delete category “${c.name}”?`))
                            update({
                              ...catalog,
                              categories: catalog.categories.filter(
                                (x) => x.id !== c.id,
                              ),
                            });
                        }}
                        className="text-xs font-sans text-rose-700 hover:text-rose-900 inline-flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: HOMEPAGE STORY
        ======================================================== */}
        {tab === "Homepage" && (
          <div className="max-w-4xl space-y-6">
            <div>
              <span className="eyebrow">Studio Editorial Story</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C281F] font-normal">
                Homepage Hero &amp; Brand Narrative
              </h2>
              <p className="text-xs font-sans text-[#667264] mt-1">
                Customize your headline, studio welcome narrative, and signature photography.
              </p>
            </div>

            <div className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-7 space-y-6">
              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                  Hero Headline
                </label>
                <textarea
                  rows={2}
                  value={catalog.home.title}
                  onChange={(e) =>
                    update({
                      ...catalog,
                      home: { ...catalog.home, title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] rounded-[3px] text-base font-serif text-[#1C281F] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                  Hero Introduction &amp; Tagline
                </label>
                <textarea
                  rows={2}
                  value={catalog.home.subtitle}
                  onChange={(e) =>
                    update({
                      ...catalog,
                      home: { ...catalog.home, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] rounded-[3px] text-sm text-[#1C281F] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                  Hero Signature Image
                </label>
                <div className="flex gap-4 items-center mb-3">
                  <div className="relative w-24 h-28 rounded-[3px] overflow-hidden bg-[#F2EDE4] border border-[#E8E2D8]">
                    <Image
                      src={catalog.home.image}
                      alt="Current hero banner"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <ImageUpload
                      onImages={(images) => {
                        if (images[0])
                          update({
                            ...catalog,
                            home: { ...catalog.home, image: images[0] },
                          });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                  Artisan Brand Story
                </label>
                <textarea
                  rows={5}
                  value={catalog.home.story}
                  onChange={(e) =>
                    update({
                      ...catalog,
                      home: { ...catalog.home, story: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] rounded-[3px] text-sm text-[#1C281F] leading-relaxed outline-none"
                />
              </div>

              {/* Draft Preview Block */}
              <div className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-[4px] space-y-3">
                <span className="eyebrow !mb-0">Headline Live Preview</span>
                <h3 className="font-serif text-2xl text-[#1C281F] font-normal">
                  {catalog.home.title}
                </h3>
                <p className="text-xs text-[#667264] max-w-xl">
                  {catalog.home.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: REVIEWS
        ======================================================== */}
        {tab === "Reviews" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4">
              <div>
                <span className="eyebrow">Patron Feedback</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C281F] font-normal">
                  Kind Words &amp; Testimonials ({catalog.reviews.length})
                </h2>
                <p className="text-xs font-sans text-[#667264] mt-1">
                  Only add genuine feedback with recorded customer permission. Reviews require both permission and publish toggles to appear on the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...catalog,
                    reviews: [
                      ...catalog.reviews,
                      {
                        id: uid(),
                        author: "Kind Patron",
                        quote: "",
                        published: false,
                        permission: false,
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] font-sans text-xs font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all"
              >
                <Plus size={14} />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catalog.reviews.map((r) => {
                const patch = (next: Partial<Review>) =>
                  update({
                    ...catalog,
                    reviews: catalog.reviews.map((x) =>
                      x.id === r.id ? { ...x, ...next } : x,
                    ),
                  });
                return (
                  <div
                    key={r.id}
                    className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 text-[#967F4F]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-xs">★</span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Delete this patron review?"))
                            update({
                              ...catalog,
                              reviews: catalog.reviews.filter((x) => x.id !== r.id),
                            });
                        }}
                        className="text-xs text-rose-700 hover:text-rose-900 inline-flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>

                    {textField(
                      "Customer Name",
                      r.author,
                      (author) => patch({ author }),
                      true,
                      "e.g. Priyanshi S., Bengaluru",
                    )}

                    <div>
                      <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5">
                        Feedback Quote
                      </label>
                      <textarea
                        rows={3}
                        value={r.quote}
                        placeholder="The custom bouquet arrived in perfect shape! The velvety texture of the pipe cleaners is so luxurious..."
                        onChange={(e) => patch({ quote: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#E8E2D8] focus:border-[#967F4F] rounded-[2px] text-xs text-[#1C281F] outline-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#E8E2D8]">
                      <label className="flex items-start gap-2.5 text-xs font-sans text-[#1C281F] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={r.permission}
                          onChange={(e) =>
                            patch({
                              permission: e.target.checked,
                              published: e.target.checked ? r.published : false,
                            })
                          }
                          className="w-4 h-4 rounded-[2px] text-[#967F4F] mt-0.5"
                        />
                        <span className="leading-tight">
                          Customer granted explicit permission to publish this feedback.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 text-xs font-sans text-[#1C281F] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={r.published}
                          disabled={!r.permission}
                          onChange={(e) => patch({ published: e.target.checked })}
                          className="w-4 h-4 rounded-[2px] text-[#967F4F] mt-0.5 disabled:opacity-40"
                        />
                        <span className="leading-tight">
                          Publish visibly on homepage.
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: CUSTOM REQUESTS (INBOX)
        ======================================================== */}
        {tab === "Custom requests" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4">
              <div>
                <span className="eyebrow">Studio Concierge Inbox</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C281F] font-normal">
                  Custom Inquiries &amp; Commissions ({requests.length})
                </h2>
                <p className="text-xs font-sans text-[#667264] mt-1">
                  Patron requests submitted through the custom-order form. Reach out via WhatsApp or email to confirm design and advance payment.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const r = await fetch("/api/admin/requests");
                    const d = await r.json();
                    if (!r.ok) throw new Error();
                    setRequests(d);
                    setNotice("Inbox refreshed.");
                  } catch {
                    setNotice(
                      "Could not refresh requests. Sign in again if session expired.",
                    );
                  }
                }}
                className="px-4 py-2.5 bg-[#FCFBF9] hover:bg-[#F2EDE4] border border-[#E8E2D8] text-xs font-sans text-[#1C281F] rounded-[3px] transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Refresh Inbox</span>
              </button>
            </div>

            {!requests.length ? (
              <div className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-12 text-center max-w-lg mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#967F4F]">
                  <Inbox size={22} />
                </div>
                <h3 className="font-serif text-xl text-[#1C281F]">
                  Your inbox is clear
                </h3>
                <p className="text-xs font-sans text-[#667264] leading-relaxed">
                  When customers submit a custom order request on the storefront, their idea, colours, and contact info will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {requests.map((r) => {
                  const isPhone = /^[0-9+ -]{7,15}$/.test(r.contact.trim());
                  const cleanPhone = r.contact.replace(/\D/g, "");
                  const whatsappHref = isPhone
                    ? `https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}`
                    : null;

                  return (
                    <div
                      key={r.id}
                      className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-6 space-y-4 shadow-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-xl text-[#1C281F]">
                              {r.name}
                            </h3>
                            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-[2px] text-[#667264]">
                              Ref: {r.id.slice(0, 8)}
                            </span>
                          </div>
                          <span className="text-[11px] font-sans text-[#8C988A] flex items-center gap-1 mt-0.5">
                            <Clock size={11} />
                            {new Date(r.createdAt).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}{" "}
                            IST
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              !confirm(
                                "Permanently delete this customer request and contact details?",
                              )
                            )
                              return;
                            try {
                              const response = await fetch("/api/admin/requests", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: r.id }),
                              });
                              if (!response.ok) throw new Error();
                              setRequests(requests.filter((x) => x.id !== r.id));
                              setNotice("Request deleted.");
                            } catch {
                              setNotice("Request could not be deleted.");
                            }
                          }}
                          className="p-1.5 text-[#8C988A] hover:text-rose-700 transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Contact Channels */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="px-2.5 py-1 bg-white border border-[#E8E2D8] rounded-[2px] text-xs font-sans text-[#1C281F] inline-flex items-center gap-1.5">
                          {r.contact.includes("@") ? <Mail size={12} className="text-[#967F4F]" /> : <Phone size={12} className="text-[#967F4F]" />}
                          <span>{r.contact}</span>
                        </span>

                        {whatsappHref && (
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-[#1C281F] hover:bg-[#967F4F] text-white rounded-[2px] text-[11px] font-sans font-semibold tracking-wider uppercase inline-flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle size={12} />
                            <span>Chat on WhatsApp</span>
                          </a>
                        )}
                        {r.contact.includes("@") && (
                          <a
                            href={`mailto:${r.contact}`}
                            className="px-2.5 py-1 bg-[#FCFBF9] hover:bg-[#F2EDE4] border border-[#E8E2D8] text-[11px] font-sans font-semibold text-[#1C281F] rounded-[2px] inline-flex items-center gap-1 transition-colors"
                          >
                            <Mail size={12} />
                            <span>Send Email</span>
                          </a>
                        )}
                      </div>

                      {/* Request Specs */}
                      <div className="grid grid-cols-2 gap-3 text-xs font-sans bg-[#FAF7F2] p-3.5 rounded-[3px] border border-[#E8E2D8]">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8C988A] font-semibold block">
                            Requested Idea
                          </span>
                          <span className="text-[#1C281F] font-medium block mt-0.5">
                            {r.idea}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8C988A] font-semibold block">
                            Target Budget
                          </span>
                          <span className="text-[#967F4F] font-semibold block mt-0.5">
                            {r.budget}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8C988A] font-semibold block">
                            Color Palette
                          </span>
                          <span className="text-[#1C281F] block mt-0.5">
                            {r.colors || "Artist's Choice"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8C988A] font-semibold block">
                            Personalization / Notes
                          </span>
                          <span className="text-[#1C281F] block mt-0.5">
                            {r.personalization || "None specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
