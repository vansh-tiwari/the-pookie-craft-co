import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Flower2, ShieldCheck } from "lucide-react";
import { getCatalog } from "@/lib/catalog";

export const metadata = {
  title: "Our Craft Story | The Pookie Craft Co.",
  description:
    "Meet The Pookie Craft Co. — an artisan Indian craft studio turning plush pipe cleaners into everlasting flower bouquets, custom keychains, and ambient lamps.",
  alternates: { canonical: "/story" },
};

export default async function StoryPage() {
  const { home } = await getCatalog();

  return (
    <div className="bg-[#FCF8FA] text-[#200E19] min-h-screen pt-28 sm:pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="breadcrumb !mb-6" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span className="text-[#200E19] font-medium">Our Story</span>
        </nav>

        {/* Hero Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 border-b border-[#F0E5EC] pb-16">
          <div className="lg:col-span-6 space-y-6">
            <span className="eyebrow">Contemporary Indian Craft</span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#200E19] font-normal tracking-tight leading-[1.12]">
              Turning plush pipe cleaners into everlasting petals.
            </h1>

            <div className="border-l-2 border-[#9B1B54] pl-5 py-1">
              <p className="font-serif text-xl sm:text-2xl text-[#200E19] italic font-light leading-snug">
                “Made to be kept. Given with love.”
              </p>
            </div>

            <p className="font-sans text-sm sm:text-base text-[#4A303F] font-light leading-relaxed">
              {home.story}
            </p>

            <p className="font-sans text-sm sm:text-base text-[#4A303F] font-light leading-relaxed">
              From velvety blossoms that never need watering to handcrafted sports jersey keychains and glowing Lumiflower lamps, we craft pieces meant to be treasured. Each creation is sculpted by hand in our India studio from tactile chenille wire and premium craft fibers.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#9B1B54] hover:bg-[#7D1342] text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] shadow-sm transition-all"
              >
                <span>Explore the Collection</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/custom-orders"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#9B1B54] hover:bg-[#9B1B54] text-[#9B1B54] hover:text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] transition-all"
              >
                <span>Create a Custom Gift</span>
              </Link>
            </div>
          </div>

          {/* Right Imagery Spread */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden bg-[#FCF8FA] border border-[#F0E5EC] shadow-atelier">
              <Image
                src="/images/products/pipe_cleaner_roses.jpg"
                alt="Handmade pink chenille rose bouquet"
                fill
                priority
                sizes="(max-width: 1024px) 50vw, 350px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden bg-[#FCF8FA] border border-[#F0E5EC] shadow-atelier mt-8">
              <Image
                src="/images/products/lumiflower_lamp.jpg"
                alt="Handmade glowing floral ambient lamp"
                fill
                sizes="(max-width: 1024px) 50vw, 350px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* 3 Craft Pillars */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="eyebrow !justify-center">Studio Ethos</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#200E19] font-normal">
              Why our flowers stay forever
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] border border-[#F0E5EC] rounded-[6px] p-8 space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#FCF8FA] border border-[#F0E5EC] flex items-center justify-center text-[#9B1B54]">
                <Flower2 size={20} />
              </div>
              <h3 className="font-serif text-xl text-[#200E19]">
                01. Tactile Chenille Wire
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#4A303F] leading-relaxed">
                We select dense, velvety chenille wrapped around flexible core wire. Each petal and leaf is shaped, bent, and knotted by hand with zero plastic molds.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#F0E5EC] rounded-[6px] p-8 space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#FCF8FA] border border-[#F0E5EC] flex items-center justify-center text-[#9B1B54]">
                <Heart size={20} />
              </div>
              <h3 className="font-serif text-xl text-[#200E19]">
                02. Zero Wilting, 100% Forever
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#4A303F] leading-relaxed">
                Unlike real flowers that wither after three days, our blooms stay bright, plush, and cheerful indefinitely without water, sunlight, or chemical preservatives.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#F0E5EC] rounded-[6px] p-8 space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#FCF8FA] border border-[#F0E5EC] flex items-center justify-center text-[#9B1B54]">
                <Sparkles size={20} />
              </div>
              <h3 className="font-serif text-xl text-[#200E19]">
                03. Thoughtful Personalization
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#4A303F] leading-relaxed">
                Whether you need a specific flower variety, a favorite sports jersey keychain, or a custom ambient light color, we build what connects with your loved ones.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#180812] text-[#FCF8FA] rounded-[6px] p-8 sm:p-14 text-center border border-[#9B1B54]/30 shadow-atelier">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-[10.5px] font-sans uppercase tracking-[0.22em] text-[#D8A657] font-semibold block">
              Handmade in India
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Ready to create something special?
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#D5C2CD] font-light leading-relaxed">
              Explore our current collection drops or share your custom gift brief with our artisans.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="px-7 py-3 bg-[#FFFFFF] hover:bg-[#9B1B54] text-[#200E19] hover:text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] transition-all shadow-sm"
              >
                Shop Gifts
              </Link>
              <Link
                href="/custom-orders"
                className="px-7 py-3 border border-white/30 hover:border-white text-white text-xs font-sans font-semibold tracking-[0.14em] uppercase rounded-[3px] transition-colors"
              >
                Create a Custom Gift
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
