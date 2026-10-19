import Image from "next/image";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { ProductCard } from "@/components/shop/ProductCard";
import { InstagramFeed } from "@/components/home/InstagramFeed";
export const metadata = {
  title: "The Pookie Craft Co. | Handmade happiness",
  alternates: { canonical: "/" },
};
export default async function HomePage() {
  const c = await getCatalog();
  const featured = c.products.filter((p) => p.featured).slice(0, 4);
  const best = c.products.filter((p) => p.bestseller).slice(0, 4);
  const reviews = c.reviews.filter((r) => r.published && r.permission);
  return (
    <>
      <div className="announcement">
        Handmade with a happy heart <span>✿</span> Delivered across India
      </div>
      <section className="pookie-hero">
        <div className="hero-copy">
          <p className="eyebrow">SMALL BATCHES. BIG FEELINGS.</p>
          <h1>{c.home.title}</h1>
          <p className="hero-description">{c.home.subtitle}</p>
          <div className="hero-actions">
            <Link className="pill-button" href="/shop">
              Find your happy <span>↗</span>
            </Link>
            <Link className="text-link" href="/custom-orders">
              Made just for you ↗
            </Link>
          </div>
          <div className="hero-note">
            <span>✿</span> Not just a gift. A little piece of your heart.
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-image">
            <Image
              src={c.home.image}
              alt="Handcrafted forever sunflower bouquet wrapped with love"
              fill
              priority
              sizes="(max-width:760px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="hero-sticker">
            100%
            <br />
            <strong>handmade</strong>
            <br />
            100% heart
          </div>
          <span className="hero-flower" aria-hidden="true">
            ✳
          </span>
          <div className="hero-caption">the kind of flowers that stay ♡</div>
        </div>
      </section>
      <div className="joy-strip">
        <span>✿ Made by hand</span>
        <span>♡ Customised for you</span>
        <span>✧ A little one of a kind</span>
        <span>↗ Delivered across India</span>
      </div>
      <section className="section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PICK YOUR KIND OF HAPPY</p>
            <h2>Little gifts, lovely possibilities.</h2>
          </div>
          <Link className="text-link" href="/shop">
            Explore everything ↗
          </Link>
        </div>
        <div className="category-grid">
          {c.categories.map((cat, i) => (
            <Link
              className={`category-card tone-${i % 4}`}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              key={cat.id}
            >
              <div className="category-photo">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width:640px) 45vw, 180px"
                  className="object-cover"
                />
              </div>
              <span>{cat.name} ↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section-wrap featured-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FROM OUR LITTLE STUDIO</p>
            <h2>Handpicked, heart-made.</h2>
          </div>
          <Link href="/shop" className="text-link">
            Shop all products ↗
          </Link>
        </div>
        <div className="catalog-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {!featured.length && (
          <p>
            Our next collection is being crafted. Explore the shop for more.
          </p>
        )}
      </section>
      <section className="story-band">
        <div className="story-illustration" aria-hidden="true">
          ✿
          <span>
            made slowly,
            <br />
            loved always.
          </span>
        </div>
        <div>
          <p className="eyebrow">A SMALL STUDIO WITH A BIG HEART</p>
          <h2>
            A little imperfect.
            <br />A lot of personality.
          </h2>
          <p>{c.home.story}</p>
          <Link href="/story" className="text-link">
            Meet the hands behind the happy ↗
          </Link>
        </div>
      </section>
      {best.length > 0 && (
        <section className="section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE ONES YOU KEEP COMING BACK FOR</p>
              <h2>Little crowd-pleasers.</h2>
            </div>
          </div>
          <div className="catalog-grid">
            {best.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
        </section>
      )}
      {reviews.length > 0 && (
        <section className="section-wrap">
          <p className="eyebrow">KIND WORDS, HAPPY HEARTS</p>
          <h2>From the Pookie family.</h2>
          <div className="review-grid">
            {reviews.map((r) => (
              <blockquote key={r.id}>
                <p>“{r.quote}”</p>
                <cite>{r.author}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}
      <InstagramFeed />
      <section className="custom-banner">
        <p className="eyebrow">YOUR IDEA + OUR HANDS</p>
        <h2>Have a little something in mind?</h2>
        <p>
          Your colours, your person, your kind of special. Let’s make it happen.
        </p>
        <Link href="/custom-orders" className="pill-button">
          Dream up a custom gift ↗
        </Link>
      </section>
    </>
  );
}
