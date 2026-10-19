"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { availability, priceLabel } from "@/lib/catalog-types";
import { productEnquiryUrl } from "@/lib/enquiry";
import { siteConfig } from "@/config/site";
import { ProductCard } from "@/components/shop/ProductCard";
import { useBag } from "@/context/BagContext";
export function ProductDetailClient({
  product: p,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [image, setImage] = useState(p.image_url);
  const [color, setColor] = useState("");
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [personalization, setPersonalization] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const bag = useBag();
  const status = availability(p);
  function enquire(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const choices = {
        color,
        variants,
        personalization,
        quantity,
      };
      if (
        (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") !==
        "direct"
      ) {
        bag.add(p, choices);
        setError("");
        setAdded(true);
        return;
      }
      const url = productEnquiryUrl(p, choices, window.location.origin);
      setError("");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check your choices.");
    }
  }
  return (
    <div className="section-wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
        <span>{p.name}</span>
      </nav>
      <div className="product-detail">
        <div>
          <div className="detail-photo">
            <Image
              src={image}
              alt={p.name}
              fill
              priority
              sizes="(max-width:760px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="thumbnails">
            {p.images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                aria-label={`View ${p.name}, image ${i + 1}`}
                aria-pressed={image === src}
                onClick={() => setImage(src)}
              >
                <Image
                  src={src}
                  alt=""
                  width={80}
                  height={90}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{p.category}</p>
          <h1>{p.name}</h1>
          <p className="detail-price">{priceLabel(p)}</p>
          <span className="status-label">{status}</span>
          <p>{p.description}</p>
          <dl>
            <dt>Size</dt>
            <dd>
              {p.dimensions || "Confirm your preferred size with the studio."}
            </dd>
            <dt>Materials</dt>
            <dd>
              {p.material || "Handcrafted materials; ask us for details."}
            </dd>
            <dt>Preparation</dt>
            <dd>
              Confirmed with you before ordering.
              {status === "Made to Order" &&
                " This piece is crafted after the details are agreed."}
            </dd>
          </dl>
          <form
            onSubmit={enquire}
            onChangeCapture={() => setAdded(false)}
            className="stack-form"
          >
            {p.variants?.map((v) => (
              <label key={v.name}>
                {v.name} *
                <select
                  required
                  value={variants[v.name] || ""}
                  onChange={(e) =>
                    setVariants({ ...variants, [v.name]: e.target.value })
                  }
                >
                  <option value="">Choose an option</option>
                  {v.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            ))}
            {!!p.colors?.length && (
              <fieldset>
                <legend>Choose your colour *</legend>
                <div className="color-choices">
                  {p.colors.map((c) => (
                    <label
                      className={
                        color === c.name
                          ? "color-choice chosen"
                          : "color-choice"
                      }
                      key={c.name}
                    >
                      <input
                        type="radio"
                        name="colour"
                        value={c.name}
                        required
                        checked={color === c.name}
                        onChange={() => setColor(c.name)}
                      />
                      <span style={{ background: c.hex }} />
                      {c.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <label>
              Personalized text / design{" "}
              {p.personalizationRequired ? "*" : "(optional)"}
              <textarea
                maxLength={1000}
                rows={3}
                value={personalization}
                required={p.personalizationRequired}
                onChange={(e) => setPersonalization(e.target.value)}
                placeholder="A name, a little message, a special idea…"
              />
            </label>
            <label>
              Quantity
              <input
                className="quantity-input"
                type="number"
                required
                min={1}
                max={99}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.valueAsNumber)}
              />
            </label>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button
              className="pill-button"
              type="submit"
              name="action"
              value="bag"
              disabled={!bag.ready}
            >
              {status === "Sold Out"
                ? "Save for Restock Request"
                : "Add to Bag"}
            </button>
            {added && (
              <div className="bag-added" role="status">
                Added to your bag.{" "}
                <button type="button" onClick={bag.openBag}>
                  View Bag ↗
                </button>
                <Link href="/shop">Continue Shopping ↗</Link>
              </div>
            )}
            {bag.storageNotice && (
              <p className="small-note" role="status">
                {bag.storageNotice}
              </p>
            )}
            <button
              className="bag-secondary-button"
              type="submit"
              name="action"
              value="direct"
            >
              {status === "Sold Out"
                ? "Ask About Restock on WhatsApp"
                : "Order on WhatsApp"}{" "}
              ↗
            </button>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Prefer Instagram? Message studio ↗
            </a>
            <p className="small-note">
              {p.startingPrice && "Custom options may cost extra. "}Final price,
              availability, shipping, preparation time, and advance payment are
              confirmed in conversation. Opening WhatsApp does not confirm an
              order.
            </p>
          </form>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h2>A few more little loves.</h2>
          <div className="catalog-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
