import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { ProductCard } from "@/components/shop/ProductCard";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { HomeHero } from "@/components/home/HomeHero";
import { MotionFadeIn } from "@/components/motion/MotionFadeIn";

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
    <div className="bg-[#FCF8FA] text-[#200E19]">
      {/* 1. Product-Led Luxury Hero */}
      <HomeHero heroImage={catalog.home.image || "/images/products/sunflower_bouquet.jpg"} />

      {/* 3. Categories Navigation */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#F0E5EC]">
        <MotionFadeIn>
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 gap-2">
            <div>
              <span className="eyebrow">Studio Atelier</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#200E19] font-normal mt-0.5">
                Categories to Gift & Keep
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-sans font-semibold text-[#200E19] hover:text-[#9B1B54] inline-flex items-center gap-1.5 transition-colors uppercase tracking-[0.12em]"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {catalog.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group bg-[#FFFFFF] p-3 rounded-[4px] border border-[#F0E5EC] hover:border-[#9B1B54]/60 hover:shadow-atelier transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square rounded-[2px] overflow-hidden bg-[#FCF8FA] mb-2.5">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 150px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="font-serif text-[13.5px] text-[#200E19] group-hover:text-[#9B1B54] transition-colors leading-tight line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </MotionFadeIn>
      </section>

      {/* 4. Curated Featured Products */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#F0E5EC]">
        <MotionFadeIn>
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 gap-2">
            <div>
              <span className="eyebrow">Handmade in Studio</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#200E19] font-normal mt-0.5">
                Featured Studio Drops
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-sans font-semibold text-[#200E19] hover:text-[#9B1B54] inline-flex items-center gap-1.5 transition-colors uppercase tracking-[0.12em]"
            >
              <span>View all {catalog.products.length} creations</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </MotionFadeIn>
      </section>

      {/* 5. Signature Studio & Craft Process Section */}
      <section className="bg-[#180812] text-[#FCF8FA] my-10 py-16 sm:py-24 border-y border-[#9B1B54]/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <MotionFadeIn className="lg:col-span-5 space-y-6">
              <span className="text-[10.5px] font-sans uppercase tracking-[0.22em] text-[#D8A657] font-semibold block">
                The Artisan Process
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                Turning plush pipe cleaners into everlasting petals.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#D5C2CD] font-light leading-relaxed">
                Every petal begins as a flexible wire wrapped in velvety chenille.
                Our craftswomen shape, wrap, and knot each bloom by hand in our
                India studio. No water needed, zero wilting, 100% forever.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l border-[#9B1B54] pl-4">
                  <span className="font-serif text-2xl text-[#D8A657] block">
                    01. Wire
                  </span>
                  <span className="text-xs text-[#D5C2CD] font-light">
                    Plush velvety pipe cleaners shaped into organic botanical contours.
                  </span>
                </div>
                <div className="border-l border-[#9B1B54] pl-4">
                  <span className="font-serif text-2xl text-[#D8A657] block">
                    02. Bloom
                  </span>
                  <span className="text-xs text-[#D5C2CD] font-light">
                    Hand-assembled bouquets & keychains crafted to last a lifetime.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/story"
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-[0.16em] uppercase text-[#D8A657] hover:text-white transition-colors"
                >
                  <span>Read our craft story</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </MotionFadeIn>

            <MotionFadeIn delay={0.2} className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden shadow-atelier-lg border border-white/10">
                <Image
                  src="/images/products/pipe_cleaner_roses.jpg"
                  alt="Pipe cleaner roses artisan process"
                  fill
                  sizes="(max-width: 768px) 50vw, 350px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden shadow-atelier-lg border border-white/10 mt-6">
                <Image
                  src="/images/products/lumiflower_lamp.jpg"
                  alt="Lumiflower ambient lamp glowing handmade flowers"
                  fill
                  sizes="(max-width: 768px) 50vw, 350px"
                  className="object-cover"
                />
              </div>
            </MotionFadeIn>
          </div>
        </div>
      </section>

      {/* 6. Bestsellers & Keepsakes */}
      {bestsellers.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <MotionFadeIn>
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 gap-2">
              <div>
                <span className="eyebrow">Patron Favourites</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#200E19] font-normal mt-0.5">
                  Bestselling Keepsakes & Blooms
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-sans font-semibold text-[#200E19] hover:text-[#9B1B54] inline-flex items-center gap-1.5 transition-colors uppercase tracking-[0.12em]"
              >
                <span>Explore all gifts</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestsellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </MotionFadeIn>
        </section>
      )}

      {/* 7. Approved Reviews */}
      {reviews.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#F0E5EC]">
          <MotionFadeIn>
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="eyebrow !justify-center">Community Feedback</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#200E19] font-normal mt-1">
                Treasured by patrons across India
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="bg-[#FFFFFF] p-6 rounded-[4px] border border-[#F0E5EC] flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex gap-1 text-[#D8A657]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-xs">★</span>
                      ))}
                    </div>
                    <p className="font-serif text-base text-[#200E19] italic leading-relaxed font-light">
                      “{r.quote}”
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#F0E5EC] text-xs font-sans text-[#7E6875]">
                    <strong className="text-[#200E19] font-medium block">
                      {r.author}
                    </strong>
                    <span>Verified Patron</span>
                  </div>
                </div>
              ))}
            </div>
          </MotionFadeIn>
        </section>
      )}

      {/* 8. Studio Instagram Gallery */}
      <InstagramFeed />

      {/* 9. Bespoke Custom Gift Banner */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 mb-8">
        <MotionFadeIn>
          <div className="bg-[#FFFFFF] border border-[#F0E5EC] rounded-[4px] p-8 sm:p-14 text-center relative overflow-hidden shadow-atelier">
            <div className="max-w-2xl mx-auto space-y-5 relative z-10">
              <span className="eyebrow !justify-center">Bespoke Studio Commissions</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#200E19] font-normal tracking-tight">
                Have a special creation in mind?
              </h2>
              <p className="text-sm sm:text-base font-sans text-[#4A303F] font-light max-w-lg mx-auto leading-relaxed">
                Custom anniversary bouquets, personalized jersey keychains, or
                bespoke flower lamps. Tell us your concept and our artisans will
                bring it to life.
              </p>
              <div className="pt-2">
                <Link
                  href="/custom-orders"
                  className="inline-flex px-8 py-3.5 bg-[#9B1B54] hover:bg-[#7D1342] text-[#FFFFFF] text-xs font-sans font-semibold tracking-[0.16em] uppercase rounded-[2px] shadow-sm transition-all duration-300"
                >
                  Create a Custom Gift ↗
                </Link>
              </div>
            </div>
          </div>
        </MotionFadeIn>
      </section>
    </div>
  );
}
