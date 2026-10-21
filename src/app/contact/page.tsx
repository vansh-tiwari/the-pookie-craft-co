import Link from "next/link";
import { MessageCircle, Mail, Sparkles, Clock, MapPin, Truck, ArrowRight } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";

export const metadata = {
  title: "Contact the Studio | The Pookie Craft Co.",
  description:
    "Connect with The Pookie Craft Co. studio artisans for custom orders, bespoke bouquets, and nationwide delivery details.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="bg-[#FAF7F2] text-[#1C281F] min-h-screen pt-28 sm:pt-36 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="breadcrumb !mb-6" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span className="text-[#1C281F] font-medium">Contact Studio</span>
        </nav>

        {/* Page Header */}
        <div className="mb-14 border-b border-[#E8E2D8] pb-10">
          <span className="eyebrow">Studio Concierge · India</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C281F] font-normal tracking-tight mt-1 mb-4">
            Let’s make someone’s day.
          </h1>
          <p className="text-base sm:text-lg font-sans text-[#5D685B] font-light leading-relaxed max-w-2xl">
            Questions about a floral bouquet? A custom colour palette you can’t stop thinking about? We’d love to welcome you into our craft conversation.
          </p>
        </div>

        {/* Studio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: WhatsApp Concierge */}
          <div className="bg-[#FCFBF9] border border-[#E8E2D8] hover:border-[#967F4F]/50 rounded-[6px] p-8 flex flex-col justify-between shadow-xs transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#1C281F] text-[#FAF7F2] flex items-center justify-center">
                <MessageCircle size={22} className="text-[#C29F58]" />
              </div>
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#967F4F] font-semibold block mb-1">
                  Primary Studio Line
                </span>
                <h2 className="font-serif text-2xl text-[#1C281F]">
                  WhatsApp Studio
                </h2>
              </div>
              <p className="text-xs sm:text-[13px] font-sans text-[#5D685B] leading-relaxed">
                Direct chat with our lead craft artisan. Inquire about in-stock pieces, custom commissions, or express dispatch.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#1C281F] font-medium bg-[#FAF7F2] px-3 py-1.5 rounded-[3px] border border-[#E8E2D8] w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{siteConfig.whatsappDisplay || "Fast responses 10am–8pm IST"}</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E8E2D8]">
              <a
                href={whatsappLink("Hello! I’d like to enquire about a handmade gift from The Pookie Craft Co.")}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#1C281F] hover:bg-[#967F4F] text-[#FAF7F2] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Start Conversation</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Card 2: Instagram Atelier */}
          <div className="bg-[#FCFBF9] border border-[#E8E2D8] hover:border-[#967F4F]/50 rounded-[6px] p-8 flex flex-col justify-between shadow-xs transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#967F4F] flex items-center justify-center">
                <svg
                  className="w-5 h-5"
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
              </div>
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#967F4F] font-semibold block mb-1">
                  Visual Studio Gallery
                </span>
                <h2 className="font-serif text-2xl text-[#1C281F]">
                  Instagram Atelier
                </h2>
              </div>
              <p className="text-xs sm:text-[13px] font-sans text-[#5D685B] leading-relaxed">
                Watch making-of reels, new floral drop releases, behind-the-scenes chenille sculpting, and community love.
              </p>
              <div className="text-[12px] font-sans font-medium text-[#1C281F] bg-[#FAF7F2] px-3 py-1.5 rounded-[3px] border border-[#E8E2D8] w-fit">
                @{siteConfig.instagramHandle}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E8E2D8]">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 border border-[#1C281F] hover:bg-[#1C281F] text-[#1C281F] hover:text-[#FAF7F2] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] transition-all flex items-center justify-center gap-2"
              >
                <span>Visit Instagram ↗</span>
              </a>
            </div>
          </div>

          {/* Card 3: Custom Commissions Form */}
          <div className="bg-[#FCFBF9] border border-[#E8E2D8] hover:border-[#967F4F]/50 rounded-[6px] p-8 flex flex-col justify-between shadow-xs transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C281F] flex items-center justify-center">
                <Sparkles size={22} className="text-[#967F4F]" />
              </div>
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#967F4F] font-semibold block mb-1">
                  Bespoke Creations
                </span>
                <h2 className="font-serif text-2xl text-[#1C281F]">
                  Custom Orders
                </h2>
              </div>
              <p className="text-xs sm:text-[13px] font-sans text-[#5D685B] leading-relaxed">
                Personalized sports jersey keychains, custom anniversary flower arrangements, or ambient Lumiflower lamps.
              </p>
              <div className="text-[11px] font-sans text-[#5D685B] bg-[#FAF7F2] px-3 py-1.5 rounded-[3px] border border-[#E8E2D8] w-fit">
                Submit an idea in under 2 minutes
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E8E2D8]">
              <Link
                href="/custom-orders"
                className="w-full py-3 px-4 bg-[#967F4F] hover:bg-[#836E42] text-[#FAF7F2] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Share Your Idea</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Studio Craft & Fulfillment Information Banner */}
        <div className="bg-[#1C281F] text-[#FAF7F2] rounded-[6px] p-8 sm:p-12 border border-[#967F4F]/30 shadow-atelier">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#C29F58] flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-white font-normal mb-1">
                  Artisan Studio in India
                </h3>
                <p className="text-xs font-sans text-[#D4CDC2] leading-relaxed">
                  Every bloom and keychain is hand-twisted, wrapped, and assembled from quality chenille wire by our craft team.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#C29F58] flex-shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-white font-normal mb-1">
                  Nationwide Dispatch
                </h3>
                <p className="text-xs font-sans text-[#D4CDC2] leading-relaxed">
                  Carefully boxed with sturdy cushioning to ensure bouquets arrive in pristine petal form across all Indian pin codes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#C29F58] flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-white font-normal mb-1">
                  Crafting Timelines
                </h3>
                <p className="text-xs font-sans text-[#D4CDC2] leading-relaxed">
                  In-stock pieces dispatch within 24–48 hours. Custom creations typically take 2–5 days before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
