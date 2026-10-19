"use client";
import type { Product } from "@/types";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBag } from "@/context/BagContext";
import { bagEnquiry, bagTotals, money } from "@/lib/bag";
import { availability } from "@/lib/catalog-types";
import { siteConfig, whatsappLink } from "@/config/site";
export function BagContents({
  products,
  presentation = "page",
  catalogReady = true,
}: {
  products: Product[];
  presentation?: "page" | "drawer";
  catalogReady?: boolean;
}) {
  const bag = useBag();
  const [notice, setNotice] = useState("");
  const [summaryVisible, setSummaryVisible] = useState(false);
  const previewBack = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (presentation !== "drawer" || !summaryVisible) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    previewBack.current?.focus({ preventScroll: true });
    return () => {
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [summaryVisible, presentation]);
  const totals = bagTotals(bag.items, products);
  const canEnquire = totals.canEnquire && catalogReady;
  const baseUrl =
    typeof window === "undefined" ? siteConfig.siteUrl : window.location.origin;
  const summary = totals.canEnquire
    ? bagEnquiry(bag.items, products, baseUrl)
    : "";
  function message() {
    if (!catalogReady)
      throw new Error(
        "Please wait for current prices and availability to load.",
      );
    return bagEnquiry(bag.items, products, baseUrl);
  }
  function whatsapp() {
    try {
      window.open(whatsappLink(message()), "_blank", "noopener,noreferrer");
      setNotice(
        "Your enquiry is ready in WhatsApp. Review it and send it there. Your bag stays here until you clear it.",
      );
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "Check your bag before enquiring.",
      );
    }
  }
  async function copy() {
    try {
      const text = message();
      try {
        await navigator.clipboard.writeText(text);
        setNotice(
          "Summary copied. Open Instagram and paste it into your conversation with the studio.",
        );
      } catch {
        setSummaryVisible(true);
        setNotice(
          "Automatic copying is unavailable. Select and copy the summary below, then paste it into Instagram.",
        );
      }
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "Check your bag before copying.",
      );
    }
  }
  return (
    <div
      className={`section-wrap bag-page ${presentation === "drawer" ? "is-drawer" : ""}`}
      onClickCapture={(event) => {
        if (
          presentation === "drawer" &&
          event.target instanceof Element &&
          event.target.closest("a")
        )
          bag.closeBag();
      }}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR HANDCRAFTED SELECTION</p>
          <h1>Your Bag</h1>
        </div>
        <Link href="/shop" className="text-link">
          Continue Shopping ↗
        </Link>
      </div>
      <p className="intro-copy">
        Review your handcrafted keepsakes and flowers below. When ready, order
        directly with our studio on WhatsApp.
      </p>
      {bag.storageNotice && (
        <p className="admin-notice" role="status">
          {bag.storageNotice}
        </p>
      )}
      {!bag.ready ? (
        <p role="status">Opening your bag…</p>
      ) : !bag.items.length ? (
        <div className="empty-state">
          <span aria-hidden="true">✿</span>
          <h2>Your bag is currently empty.</h2>
          <p>
            Explore our handcrafted flowers, custom keychains, and ambient lamps
            to add items to your bag.
          </p>
          <Link href="/shop" className="pill-button">
            Shop Gifts ↗
          </Link>
        </div>
      ) : (
        <div
          className="bag-layout"
          inert={presentation === "drawer" && summaryVisible ? true : undefined}
        >
          <div className="bag-items">
            {totals.lines.map(
              ({ item, product: p, error, estimated, amount }) => (
                <article className="bag-item" key={item.key}>
                  {p ? (
                    <Link
                      href={`/product/${p.slug}`}
                      className="bag-item-photo"
                    >
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="110px"
                        className="object-cover"
                      />
                    </Link>
                  ) : (
                    <div
                      className="bag-item-photo missing-photo"
                      aria-hidden="true"
                    >
                      ✿
                    </div>
                  )}
                  <div className="bag-item-info">
                    <h2>
                      {p ? (
                        <Link href={`/product/${p.slug}`}>{p.name}</Link>
                      ) : (
                        "Product no longer listed"
                      )}
                    </h2>
                    {p && (
                      <p className="bag-availability">
                        {availability(p)}
                        {availability(p) === "Sold Out"
                          ? " · Restock enquiry only"
                          : ""}
                      </p>
                    )}
                    <dl>
                      <div>
                        <dt>Colour</dt>
                        <dd>{item.choices.color || "Not applicable"}</dd>
                      </div>
                      {Object.entries(item.choices.variants).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                      <div>
                        <dt>Personalized text/design</dt>
                        <dd>
                          {item.choices.personalization || "None requested"}
                        </dd>
                      </div>
                    </dl>
                    {error && (
                      <p role="alert" className="form-error">
                        {error}{" "}
                        {p && (
                          <Link href={`/product/${p.slug}`}>
                            Choose Options ↗
                          </Link>
                        )}
                      </p>
                    )}
                    <div className="bag-line-footer">
                      <label className="bag-quantity">
                        Quantity
                        <span className="sr-only">
                          {" "}
                          for {p?.name || "unlisted product"}
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          step={1}
                          value={item.choices.quantity}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            if (
                              Number.isSafeInteger(value) &&
                              value >= 1 &&
                              value <= 99
                            ) {
                              bag.setQuantity(item.key, value);
                              setNotice("");
                            }
                          }}
                        />
                      </label>
                      {p && (
                        <div className="bag-line-price">
                          <strong>
                            {estimated ? "From " : ""}
                            {money(amount)}
                          </strong>
                          <small>
                            {item.choices.quantity} ×{" "}
                            {p.startingPrice ? "from " : ""}
                            {money(p.price)}
                            {estimated ? " · quote pending" : ""}
                          </small>
                        </div>
                      )}
                      <button
                        className="text-link"
                        onClick={() => {
                          bag.remove(item.key);
                          setNotice("Selection removed from your bag.");
                        }}
                        aria-label={`Remove ${p?.name || "unlisted product"} from bag`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
            <button
              className="text-link"
              onClick={() => {
                if (confirm("Remove every item from your bag?")) {
                  bag.clear();
                  setNotice("");
                }
              }}
            >
              Clear bag
            </button>
          </div>
          <aside className="bag-summary" aria-label="Order summary">
            <p className="eyebrow">ORDER SUMMARY</p>
            <h2>Your bag at a glance.</h2>
            <details
              className="bag-price-breakdown"
              open={presentation !== "drawer"}
            >
              <summary>
                Price breakdown · {bag.count}{" "}
                {bag.count === 1 ? "piece" : "pieces"}
              </summary>
              <div className="bag-summary-row">
                <span>Pieces</span>
                <strong>{bag.count}</strong>
              </div>
              <div className="bag-summary-row">
                <span>Fixed-price items</span>
                <strong>{money(totals.fixed)}</strong>
              </div>
              {totals.needsQuote && (
                <div className="bag-summary-row">
                  <span>Starting/customized items</span>
                  <strong>From {money(totals.estimated)}</strong>
                </div>
              )}
            </details>
            <div className="bag-summary-total">
              <span>Product Total</span>
              <strong>
                {totals.needsQuote ? "From " : ""}
                {money(totals.subtotal)}
              </strong>
            </div>
            <p className="small-note">
              {totals.needsQuote
                ? "Customisation and delivery charges confirmed on WhatsApp."
                : "Delivery charges confirmed on WhatsApp."}
            </p>
            {totals.lines.some(
              (l) => l.product && availability(l.product) === "Sold Out",
            ) && (
              <p className="bag-warning">
                Your bag includes sold-out pieces. Your order message will ask about
                restocking or made-to-order options.
              </p>
            )}
            {!totals.canEnquire && (
              <p className="bag-warning">
                Some selections need attention. Remove them and add the updated
                choices before ordering.
              </p>
            )}
            <button
              className="pill-button"
              disabled={!canEnquire || !siteConfig.whatsappClean}
              onClick={whatsapp}
            >
              Order on WhatsApp ↗
            </button>
            {!siteConfig.whatsappClean && (
              <p className="small-note">
                WhatsApp details are being confirmed. Copy your order details and
                contact us on Instagram, or{" "}
                <Link href="/contact">see contact options</Link>.
              </p>
            )}
            <button
              className="bag-secondary-button"
              disabled={!canEnquire}
              onClick={copy}
            >
              Copy Order Details
            </button>
            <details
              className="bag-more-options"
              open={presentation !== "drawer"}
            >
              <summary>Order details & Instagram option</summary>
              <div className="bag-more-content">
                <a
                  className="text-link"
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Instagram ↗
                </a>
                <button
                  className="text-link"
                  disabled={!canEnquire}
                  onClick={() => {
                    try {
                      message();
                      setSummaryVisible(!summaryVisible);
                    } catch {
                      setNotice("Review your bag first.");
                    }
                  }}
                >
                  {summaryVisible ? "Hide" : "View"} Order Details
                </button>
                <p className="small-note">
                  Order details are securely prepared on your browser and hand-confirmed with our studio on WhatsApp.
                </p>
              </div>
            </details>
          </aside>
        </div>
      )}
      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}
      {summaryVisible && bag.items.length > 0 && (
        <section className="bag-message-preview">
          {presentation === "drawer" && (
            <button
              type="button"
              ref={previewBack}
              className="text-link"
              onClick={() => setSummaryVisible(false)}
            >
              ← Back to your bag
            </button>
          )}
          <label>
            Enquiry message — select to copy
            <textarea
              readOnly
              rows={16}
              value={summary}
              onFocus={(e) => e.currentTarget.select()}
            />
          </label>
        </section>
      )}
    </div>
  );
}
