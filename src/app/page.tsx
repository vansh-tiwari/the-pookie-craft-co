import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { ProductCard } from "@/components/shop/ProductCard";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { ChenilleWireMotif } from "@/components/common/ChenilleWireMotif";

export const metadata = {
  title: "The Pookie Craft Co. | Turning Pipe Cleaners Into Petals",
  description:
    "Artisan studio specializing in handcrafted forever floral bouquets, custom sports jersey keychains, chocolate hampers, and glowing Lumiflower ambient lamps. Made in India.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const catalog = await getCatalog();
  const featured = catalog.products.filter((p) => p.featured).slice(0, 4);
  const bestsellers = catalog.products.filter((p) => p.bestseller).slice(0, 4);
  const reviews = catalog.reviews.filter((r) => r.published && r.permission);

  return (
    <div className="bg-[#F6F0E6] text-[#252923]">
      {/* 1. Announcement Ribbon */}
      <div className="bg-[#682B43] text-[#F6F0E6] text-xs font-sans tracking-[0.14em] uppercase py-2.5 px-4 text-center font-medium">
        <span>Handcrafted in India</span>
        <span className="mx-2 text-[#E6B94A]">✿</span>
        <span>Velvety blooms that stay forever</span>
        <span className="mx-2 text-[#E6B94A]">✿</span>
        <span>Nationwide Dispatch</span>
      </div>

      {/* 2. Product-Led Hero (480–620px content height, asymmetric composition) */}
      <section className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4DDD2]/60 border border-[#DCD6CA] text-xs font-sans font-medium text-[#682B43]">
              <span className="text-[#E6B94A]">✿</span>
              <span>Contemporary Indian Craft Studio</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#252923] font-normal leading-[1.08] tracking-tight">
                Made to be kept.
              </h1>
              <p className="text-base sm:text-lg font-sans text-[#4A5247] max-w-lg leading-relaxed font-light">
                Handcrafted flowers, personalised keepsakes, and gifts that never
                wilt. Crafted from plush chenille wire in our India studio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#682B43] hover:bg-[#532135] text-[#F6F0E6] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-md shadow-sm transition-all duration-200"
              >
                Shop Gifts
              </Link>
              <Link
                href="/custom-orders"
                className="px-8 py-3.5 border border-[#252923] text-[#252923] hover:bg-[#252923] hover:text-[#F6F0E6] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-md transition-all duration-200"
              >
                Create a Custom Gift
              </Link>
            </div>

            <div className="pt-2">
              <ChenilleWireMotif variant="horizontal" strokeColor="#682B43" petalColor="#E6B94A" />
            </div>
          </div>

          {/* Asymmetric Product Composition with Inset */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden shadow-xl border border-[#E4DDD2] bg-[#FFFDF9]">
              <Image
                src={catalog.home.image || "/images/products/sunflower_bouquet.jpg"}
                alt="Handcrafted forever sunflower bouquet by The Pookie Craft Co."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#E6B94A] block mb-0.5">
                  Artisan Spotlight
                </span>
                <p className="font-serif text-xl sm:text-2xl font-light">
                  Velvety Sunflower & Lavender Forever Bouquet
                </p>
              </div>
            </div>

            {/* Tactile Material Detail Inset */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#FFFDF9] p-3 rounded-xl shadow-lg border border-[#E4DDD2] max-w-xs items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#F6F0E6]">
                <Image
                  src="/images/products/pipe_cleaner_roses.jpg"
                  alt="Velveteen chenille wire petal macro detail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xs font-sans">
                <strong className="block text-[#252923] font-semibold">
                  Chenille-to-Petal
                </strong>
                <span className="text-[#667062] text-[11px] leading-tight block">
                  Bendable, tactile wire woven into velvety blossoms that last forever.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Concise Category Navigation */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#E4DDD2]/80">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 gap-2">
          <div>
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#682B43] font-semibold">
              EXPLORE OUR CRAFT
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#252923] font-normal mt-0.5">
              Categories to gift & keep
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-sans font-medium text-[#682B43] hover:underline inline-flex items-center gap-1"
          >
            <span>View full catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {catalog.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group bg-[#FFFDF9] p-3 rounded-xl border border-[#E4DDD2] hover:border-[#682B43] hover:shadow-sm transition-all text-center flex flex-col items-center"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#F6F0E6] mb-2.5">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 45vw, 150px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="font-serif text-sm text-[#252923] group-hover:text-[#682B43] transition-colors leading-tight line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Curated Featured Products */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E4DDD2]/80">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 gap-2">
          <div>
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#682B43] font-semibold">
              HANDMADE IN STUDIO
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#252923] font-normal mt-0.5">
              Featured Studio Drops
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-sans font-medium text-[#682B43] hover:underline inline-flex items-center gap-1"
          >
            <span>Shop all {catalog.products.length} products</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. Signature Studio & Craft Process Section (Tactile Green Craft Accent) */}
      <section className="bg-[#283C2A] text-[#F6F0E6] my-8 py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#E6B94A]">
                <span>THE ARTISAN PROCESS</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                Turning fuzzy pipe cleaners into everlasting petals.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#DCD1C1] font-light leading-relaxed">
                Every petal begins as a flexible wire wrapped in velvety chenille.
                Our craftswomen shape, wrap, and knot each bloom by hand in our
                India studio. No water needed, zero wilting, 100% forever.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l border-[#967F4F] pl-4">
                  <span className="font-serif text-2xl text-[#E6B94A] block">
                    01. Wire
                  </span>
                  <span className="text-xs text-[#DCD1C1]">
                    Plush velvety pipe cleaners shaped into organic botanical contours.
                  </span>
                </div>
                <div className="border-l border-[#967F4F] pl-4">
                  <span className="font-serif text-2xl text-[#E6B94A] block">
                    02. Bloom
                  </span>
                  <span className="text-xs text-[#DCD1C1]">
                    Hand-assembled bouquets & keychains crafted to last a lifetime.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/story"
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-[0.14em] uppercase text-[#E6B94A] hover:text-white transition-colors"
                >
                  <span>Read our craft story</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="relative aspect-4/5 rounded-xl overflow-hidden shadow-lg border border-white/10">
                <Image
                  src="/images/products/pipe_cleaner_roses.jpg"
                  alt="Pipe cleaner roses artisan process"
                  fill
                  sizes="(max-width: 768px) 50vw, 350px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/5 rounded-xl overflow-hidden shadow-lg border border-white/10 mt-6">
                <Image
                  src="/images/products/lumiflower_lamp.jpg"
                  alt="Lumiflower ambient lamp glowing handmade flowers"
                  fill
                  sizes="(max-width: 768px) 50vw, 350px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bestsellers & Keepsakes */}
      {bestsellers.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 gap-2">
            <div>
              <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#682B43] font-semibold">
                PATRON FAVOURITES
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#252923] font-normal mt-0.5">
                Bestselling Keepsakes & Blooms
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-sans font-medium text-[#682B43] hover:underline inline-flex items-center gap-1"
            >
              <span>Explore all gifts</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Approved Reviews */}
      {reviews.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E4DDD2]/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#682B43] font-semibold">
              COMMUNITY FEEDBACK
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#252923] font-normal mt-1">
              Treasured by patrons across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="bg-[#FFFDF9] p-6 rounded-xl border border-[#E4DDD2] flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-[#E6B94A]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-serif text-base text-[#252923] italic leading-relaxed">
                    “{r.quote}”
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E4DDD2]/60 text-xs font-sans text-[#667062]">
                  <strong className="text-[#252923] font-medium block">
                    {r.author}
                  </strong>
                  <span>Verified Patron</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Studio Instagram Gallery */}
      <InstagramFeed />

      {/* 9. Bespoke Custom Gift Banner */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-8">
        <div className="bg-[#FFFDF9] border border-[#E4DDD2] rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-[#E6B94A] text-2xl">✿</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252923] font-normal tracking-tight">
              Have a special creation in mind?
            </h2>
            <p className="text-sm sm:text-base font-sans text-[#4A5247] font-light max-w-lg mx-auto">
              Custom anniversary bouquets, personalized jersey keychains, or
              bespoke flower lamps. Tell us your concept and our artisans will
              bring it to life.
            </p>
            <div className="pt-2">
              <Link
                href="/custom-orders"
                className="inline-flex px-8 py-3.5 bg-[#682B43] hover:bg-[#532135] text-[#F6F0E6] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-md shadow-sm transition-all"
              >
                Create a Custom Gift ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
