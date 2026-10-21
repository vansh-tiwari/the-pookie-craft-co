"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";

export function OwnerLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center px-4 sm:px-6 py-16 relative overflow-hidden">
      {/* Decorative Atelier Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#967F4F]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Return to storefront link */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#667264] hover:text-[#1C281F] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Storefront</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Crest */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#967F4F]/30 bg-[#F2EDE4] mb-4 shadow-sm">
            <Image
              src="/images/instagram/logo.jpg"
              alt="The Pookie Craft Co."
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="eyebrow !justify-center !mb-1.5">
            Owner Studio Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-[34px] text-[#1C281F] font-normal tracking-tight">
            Hello, maker.
          </h1>
          <p className="text-xs sm:text-[13px] font-sans text-[#667264] mt-1.5 max-w-xs mx-auto leading-relaxed">
            Sign in to look after your little studio, update catalog items, and view custom requests.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#FCFBF9] border border-[#E8E2D8] rounded-[6px] shadow-atelier-lg p-7 sm:p-9">
          <form className="space-y-5" onSubmit={submit}>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5"
              >
                Owner Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#967F4F]">
                  <Mail size={15} />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  name="email"
                  autoComplete="username"
                  placeholder="owner@thepookiecraft.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-2 focus:ring-[#967F4F]/10 rounded-[3px] text-sm text-[#1C281F] placeholder:text-[#9EA89C] transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#1C281F] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#967F4F]">
                  <Lock size={15} />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E2D8] focus:border-[#967F4F] focus:ring-2 focus:ring-[#967F4F]/10 rounded-[3px] text-sm text-[#1C281F] placeholder:text-[#9EA89C] transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="p-3 bg-rose-50 border border-rose-200/80 rounded-[3px] text-xs text-rose-800 flex items-start gap-2.5"
              >
                <AlertCircle size={15} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 px-6 bg-[#1C281F] hover:bg-[#967F4F] disabled:bg-[#1C281F]/60 text-[#FAF7F2] font-sans text-xs font-semibold tracking-[0.16em] uppercase rounded-[3px] shadow-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {busy ? (
                <span>Entering Studio…</span>
              ) : (
                <>
                  <span>Open the Studio</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D8] text-[11px] text-[#667264] flex items-start gap-2 leading-relaxed">
            <ShieldCheck size={14} className="text-[#967F4F] flex-shrink-0 mt-0.5" />
            <p>
              Protected by server-side salted scrypt hashing &amp; HttpOnly SameSite encryption. Plaintext passwords are never saved.
            </p>
          </div>
        </div>

        {/* Studio Info Footnote */}
        <p className="text-center text-[11px] text-[#8C988A] mt-6">
          The Pookie Craft Co. · Private Maker Studio
        </p>
      </motion.div>
    </div>
  );
}
