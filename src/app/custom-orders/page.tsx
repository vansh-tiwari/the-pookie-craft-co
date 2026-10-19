"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight, Send, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function CustomOrdersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferences: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.notes) {
      alert("Please provide your name and requirements.");
      return;
    }

    const text = [
      `🌸 *CUSTOM ORDER INQUIRY — ${siteConfig.name.toUpperCase()}*`,
      `--------------------------------------`,
      `👤 *Full Name:* ${formData.name}`,
      formData.email ? `✉️ *Email:* ${formData.email}` : null,
      formData.phone ? `📞 *WhatsApp:* ${formData.phone}` : null,
      formData.preferences ? `🎨 *Color & Team Palette:* ${formData.preferences}` : null,
      `📝 *Requirements / Vision:*`,
      `"${formData.notes}"`,
      `--------------------------------------`,
      `✨ *Requesting artisan consultation to finalize design & delivery!*`,
    ]
      .filter(Boolean)
      .join("\n");

    const cleanNumber = siteConfig.whatsappClean || siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;

    setSubmitted(true);
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 400);
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 bg-[#FEF7ED] min-h-screen text-[#283C2A]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-8">
        {/* Breadcrumb */}
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
                Custom Orders
              </span>
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-[1.08] text-[#283C2A]">
            Custom Orders
          </h1>
          <p className="text-base sm:text-lg font-light text-[#3F4E3E] leading-relaxed">
            Have a custom bouquet arrangement, specific IPL jersey name/number, or unique chocolate hamper in mind? We hand-sculpt individual pieces tailored to your exact vision.
          </p>
        </div>

        {/* 3 Step Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F6EFE3] p-6 sm:p-8 rounded-sm space-y-3 border border-[#DCD1C1]">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-xl sm:text-2xl font-light text-[#967F4F]">01.</span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#283C2A]">Share Your Vision</h3>
            </div>
            <p className="text-sm text-[#3F4E3E] font-light leading-relaxed">
              Tell us the item, colors, flowers, jersey squad number, or chocolates you have in mind.
            </p>
          </div>

          <div className="bg-[#F6EFE3] p-6 sm:p-8 rounded-sm space-y-3 border border-[#DCD1C1]">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-xl sm:text-2xl font-light text-[#967F4F]">02.</span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#283C2A]">Receive Studio Quote</h3>
            </div>
            <p className="text-sm text-[#3F4E3E] font-light leading-relaxed">
              We estimate craft wire and packaging, crafting timeline, and provide a transparent quote.
            </p>
          </div>

          <div className="bg-[#F6EFE3] p-6 sm:p-8 rounded-sm space-y-3 border border-[#DCD1C1]">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-xl sm:text-2xl font-light text-[#967F4F]">03.</span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#283C2A]">Handcrafted &amp; Delivered</h3>
            </div>
            <p className="text-sm text-[#3F4E3E] font-light leading-relaxed">
              Our artisans meticulously shape your piece petal by petal and ship safely across India.
            </p>
          </div>
        </div>

        {/* Dark Forest Instant Assistance Banner */}
        <div className="w-full bg-[#1F3022] text-[#FEF7ED] p-8 sm:p-10 rounded-sm border border-[#283C2A] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 rounded-full bg-[#967F4F]/30 flex items-center justify-center text-[#FEF7ED] flex-shrink-0 mt-1 sm:mt-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FEF7ED] leading-tight">
                Need Instant Assistance?
              </h3>
              <p className="text-sm sm:text-base text-[#FEF7ED]/85 font-light leading-relaxed">
                Send reference pictures, discuss custom colors, or ask about delivery dates directly with our lead artisan on WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${siteConfig.whatsappClean || siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              "Hi The Pookie Craft Co.! I'd like to inquire about a custom handmade piece."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full lg:w-auto px-8 py-4 bg-[#FEF7ED] text-[#283C2A] text-xs font-sans tracking-[0.18em] uppercase font-semibold rounded-sm hover:bg-[#F6EFE3] transition-colors flex items-center justify-center gap-3 whitespace-nowrap flex-shrink-0"
          >
            <span>CHAT ON WHATSAPP</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Divider */}
        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#DCD1C1]/60" />
          </div>
          <div className="relative bg-[#FEF7ED] px-6 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.25em] text-[#967F4F] font-semibold">
            OR SUBMIT CONSULTATION FORM
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full bg-[#F6EFE3] p-6 sm:p-10 md:p-12 rounded-sm border border-[#DCD1C1]">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#283C2A] mx-auto" />
              <h3 className="font-serif text-2xl text-[#283C2A]">
                Custom Inquiry Dispatched!
              </h3>
              <p className="text-sm text-[#687060] max-w-md mx-auto">
                We&apos;ve prepared your custom commission request and opened WhatsApp to connect directly with our studio artisan.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary py-2.5 px-6 text-xs uppercase tracking-widest inline-block"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="text-center space-y-2 mb-8">
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#283C2A]">
                  Custom Order Request
                </h3>
                <p className="text-base text-[#3F4E3E] font-light">
                  Fill in your details below and our lead artisan will reach out to you within 24 hours.
                </p>
              </div>

              <div className="space-y-5 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-medium uppercase tracking-wider text-[#283C2A]/85 block">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-3.5 bg-[#FEF7ED] border border-[#DCD1C1]/60 text-base text-[#283C2A] placeholder:text-[#8C8275] focus:outline-none focus:border-[#283C2A] rounded-sm transition-colors font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-medium uppercase tracking-wider text-[#283C2A]/85 block">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full px-4 py-3.5 bg-[#FEF7ED] border border-[#DCD1C1]/60 text-base text-[#283C2A] placeholder:text-[#8C8275] focus:outline-none focus:border-[#283C2A] rounded-sm transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-medium uppercase tracking-wider text-[#283C2A]/85 block">
                      PHONE / WHATSAPP NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3.5 bg-[#FEF7ED] border border-[#DCD1C1]/60 text-base text-[#283C2A] placeholder:text-[#8C8275] focus:outline-none focus:border-[#283C2A] rounded-sm transition-colors font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-medium uppercase tracking-wider text-[#283C2A]/85 block">
                      COLOR / TEAM PREFERENCES
                    </label>
                    <input
                      type="text"
                      value={formData.preferences}
                      onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                      placeholder="e.g. CSK Yellow #7, Sunflower + Lavender, or MI Blue"
                      className="w-full px-4 py-3.5 bg-[#FEF7ED] border border-[#DCD1C1]/60 text-base text-[#283C2A] placeholder:text-[#8C8275] focus:outline-none focus:border-[#283C2A] rounded-sm transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-xs font-sans font-medium uppercase tracking-wider text-[#283C2A]/85 block">
                    DESCRIBE YOUR VISION &amp; REQUIREMENTS *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us what piece you want, jersey player names/numbers, flower combinations, chocolate additions, or target dates..."
                    className="w-full px-4 py-3.5 bg-[#FEF7ED] border border-[#DCD1C1]/60 text-base text-[#283C2A] placeholder:text-[#8C8275] focus:outline-none focus:border-[#283C2A] rounded-sm transition-colors resize-none font-sans"
                  />
                </div>
              </div>

              <div className="pt-2 w-full">
                <button
                  type="submit"
                  className="btn-primary w-full gap-2 py-4 text-xs font-semibold tracking-[0.16em] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND CONSULTATION INQUIRY</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
