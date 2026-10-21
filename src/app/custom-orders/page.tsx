"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageCircle,
  ArrowRight,
  Check,
  AlertCircle,
  RotateCcw,
  Palette,
  HeartHandshake,
  Gift,
  CheckCircle2,
} from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";

const initial = {
  name: "",
  contact: "",
  idea: "",
  colors: "",
  budget: "",
  personalization: "",
  website: "",
};

const popularIdeas = [
  "Forever Rose Bouquet",
  "CSK / Dhoni Sports Jersey Keychain",
  "Glowing Lumiflower Ambient Lamp",
  "Chocolate Hamper Floral Bouquet",
  "Sunflowers & Daisies Mini Bouquet",
];

const budgetPresets = [
  "Under ₹500",
  "₹500 – ₹1,000",
  "₹1,000 – ₹2,500",
  "Bespoke / ₹2,500+",
];

export default function CustomOrdersPage() {
  const [form, setForm] = useState(initial);
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setId(data.id);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save your request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const whatsappMessage = `Hi! I submitted custom request ${id} on The Pookie Craft Co. website.\n\nProduct Idea: ${form.idea}\nColours: ${form.colors || "Artist Choice"}\nBudget: ${form.budget}\nPersonalization: ${form.personalization || "None"}\n\nPlease confirm availability, timeframe, and payment details!`;

  return (
    <div className="bg-[#FAF7F2] text-[#1C281F] min-h-screen pt-28 sm:pt-36 pb-24">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="breadcrumb !mb-6" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span className="text-[#1C281F] font-medium">Bespoke Custom Orders</span>
        </nav>

        {/* Header */}
        <div className="mb-12 border-b border-[#E8E2D8] pb-10">
          <span className="eyebrow">Studio Atelier Commissions</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C281F] font-normal tracking-tight mt-1 mb-4">
            Bespoke Custom Creations
          </h1>
          <p className="text-base sm:text-lg font-sans text-[#5D685B] font-light leading-relaxed max-w-2xl">
            Have a cherished vision in mind? Tell us what you’d like crafted. Our artisans will review your concept, confirm possibilities, and prepare a personalized quote.
          </p>
        </div>

        {/* 3 Step Process Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              num: "01",
              title: "Share Your Vision",
              desc: "Select an inspiration or describe your dream gift with custom colours and budget.",
              icon: Palette,
            },
            {
              num: "02",
              title: "Studio Consultation",
              desc: "We discuss possibilities, confirm final quote, and finalize advance payment.",
              icon: HeartHandshake,
            },
            {
              num: "03",
              title: "Handmade & Dispatched",
              desc: "Our artisans sculpt your piece with love, then safely pack and dispatch across India.",
              icon: Gift,
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-5 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-sans font-semibold text-[#967F4F] uppercase tracking-wider">
                    {step.num} ·
                  </span>
                  <span className="font-serif text-base text-[#1C281F] font-medium">
                    {step.title}
                  </span>
                </div>
                <p className="text-xs font-sans text-[#5D685B] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content Area: Success Card or Form */}
        <AnimatePresence mode="wait">
          {id ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#FCFBF9] border border-[#967F4F]/40 rounded-[6px] p-8 sm:p-12 text-center shadow-atelier"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} />
              </div>

              <span className="eyebrow !justify-center !mb-1">
                Inquiry Received
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#1C281F] font-normal mb-2">
                Your idea is in our studio inbox!
              </h2>

              <p className="text-xs font-sans text-[#967F4F] font-semibold tracking-wider uppercase mb-4">
                Reference ID: {id}
              </p>

              <p className="text-xs sm:text-sm font-sans text-[#5D685B] max-w-lg mx-auto leading-relaxed mb-8">
                Our maker will review your request and contact you at <strong className="text-[#1C281F]">{form.contact}</strong>. For instant confirmation, you can tap below to continue the chat on WhatsApp with your reference.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappLink(whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle size={15} />
                  <span>Continue on WhatsApp ↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setId("");
                    setForm(initial);
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 border border-[#E8E2D8] hover:border-[#1C281F] text-[#1C281F] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw size={13} />
                  <span>Submit Another Idea</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={submit}
              className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] p-6 sm:p-10 shadow-atelier space-y-7"
            >
              {/* Popular Idea Inspiration Chips */}
              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-2">
                  Popular Creations for Inspiration
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularIdeas.map((idea) => {
                    const selected = form.idea === idea;
                    return (
                      <button
                        key={idea}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            idea: selected ? "" : idea,
                          }))
                        }
                        className={`px-3 py-1.5 rounded-[3px] text-xs font-sans transition-all border ${
                          selected
                            ? "bg-[#1C281F] text-white border-[#1C281F]"
                            : "bg-white text-[#5D685B] border-[#E8E2D8] hover:border-[#967F4F]"
                        }`}
                      >
                        {idea}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Idea Description */}
              <div>
                <label
                  htmlFor="custom-idea"
                  className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5"
                >
                  Describe Your Creation <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="custom-idea"
                  required
                  rows={3}
                  placeholder="e.g. A bouquet of 7 lilac and cream chenille roses with eucalyptus leaves, wrapped in craft paper with a satin bow..."
                  value={form.idea}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, idea: e.target.value }))
                  }
                  className="w-full px-3.5 py-3 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none leading-relaxed"
                />
              </div>

              {/* Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="custom-name"
                    className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5"
                  >
                    Your Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="custom-name"
                    type="text"
                    required
                    placeholder="e.g. Ayesha Sharma"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="custom-contact"
                    className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5"
                  >
                    WhatsApp Number or Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="custom-contact"
                    type="text"
                    required
                    placeholder="e.g. +91 98765 43210 or yourname@gmail.com"
                    value={form.contact}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, contact: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                  />
                </div>
              </div>

              {/* Colors & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="custom-colors"
                    className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5"
                  >
                    Preferred Colour Palette
                  </label>
                  <input
                    id="custom-colors"
                    type="text"
                    placeholder="e.g. Pastel Pink, Sage Green, Goldenrod"
                    value={form.colors}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, colors: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="custom-budget"
                    className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5"
                  >
                    Target Budget (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="custom-budget"
                    type="text"
                    required
                    placeholder="e.g. ₹500–₹1,000 or ₹1,200"
                    value={form.budget}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, budget: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {budgetPresets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, budget: b }))}
                        className="text-[10.5px] font-sans px-2 py-0.5 rounded-[2px] bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#967F4F] text-[#5D685B] transition-colors"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personalization Note */}
              <div>
                <label
                  htmlFor="custom-personalization"
                  className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5"
                >
                  Personalization Details (Optional)
                </label>
                <input
                  id="custom-personalization"
                  type="text"
                  placeholder="e.g. Name to engrave on wooden tag, jersey number, or greeting card note"
                  value={form.personalization}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      personalization: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-1 focus:ring-[#967F4F] rounded-[3px] text-sm text-[#1C281F] transition-all outline-none"
                />
              </div>

              {/* Honeypot field (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, website: e.target.value }))
                  }
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-200 rounded-[3px] text-xs text-rose-800 flex items-center gap-2"
                >
                  <AlertCircle size={15} className="text-rose-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 px-6 bg-[#1C281F] hover:bg-[#967F4F] disabled:bg-[#1C281F]/60 text-[#FAF7F2] font-sans text-xs font-semibold tracking-[0.16em] uppercase rounded-[3px] shadow-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {busy ? (
                  <span>Sending to Studio Inbox…</span>
                ) : (
                  <>
                    <span>Submit Custom Request</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] font-sans text-[#8C988A] leading-relaxed">
                No automatic charges. We discuss all design choices, timing, and confirm advance payment directly in chat before making starts.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
