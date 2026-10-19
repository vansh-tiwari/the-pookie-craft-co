"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  ShoppingBag,
  Clock,
  Plus,
  Minus,
  Check,
  Sparkles,
} from "lucide-react";
import { Product } from "@/types";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/shop/ProductCard";
import { StickyOrderBar } from "@/components/product/StickyOrderBar";
import { formatOrderNumber, getWhatsAppCheckoutUrl } from "@/utils/orderPayload";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem, openCart } = useCart();

  const [activeImage, setActiveImage] = useState(product.image_url);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.options[0] || "Standard"
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"craft" | "care" | "shipping">(
    "craft"
  );

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image_url,
        variant: selectedVariant,
        color: selectedColor,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 450);
  };

  const handleDirectWhatsAppOrder = () => {
    const orderNumber = formatOrderNumber();
    const subtotal = product.price * quantity;
    const shipping =
      subtotal >= siteConfig.shipping.freeThreshold
        ? 0
        : siteConfig.shipping.flatRate;
    const total = subtotal + shipping;

    const url = getWhatsAppCheckoutUrl({
      orderNumber,
      customer: {
        name: "Direct Patron",
        phone: "Via Product Page",
        address: "Confirming via chat",
        city: "",
        state: "",
        pincode: "",
        notes: `Selected Option: ${selectedVariant}${
          selectedColor ? ` | Color: ${selectedColor}` : ""
        }`,
      },
      items: [
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image_url,
          variant: selectedVariant,
          color: selectedColor,
          quantity,
        },
      ],
      subtotal,
      shipping,
      total,
    });

    window.open(url, "_blank");
  };

  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url];

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 bg-[#FEF7ED] min-h-screen text-[#283C2A]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Breadcrumb matching Crochet Cult */}
        <nav aria-label="Breadcrumb" className="border-b border-[#DCD1C1]/60 pb-3 mb-8">
          <ol className="flex items-center flex-wrap gap-2 text-[12px] font-sans font-light tracking-[0.06em] text-[#687060]">
            <li>
              <Link href="/" className="hover:text-[#283C2A] transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#967F4F]/50 text-[11px] font-serif">/</span>
              <Link href="/shop" className="hover:text-[#283C2A] transition-colors duration-200">
                Shop
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#967F4F]/50 text-[11px] font-serif">/</span>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="hover:text-[#283C2A] transition-colors duration-200"
              >
                {product.category}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#967F4F]/50 text-[11px] font-serif">/</span>
              <span className="text-[#283C2A] font-normal" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Big Main Image */}
            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden bg-[#F6EFE3] border border-[#DCD1C1] shadow-sm">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />

              {product.leadTime && (
                <div className="absolute top-4 left-4 bg-[#FEF7ED]/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#DCD1C1] shadow-xs text-xs font-sans text-[#283C2A] flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#967F4F]" />
                  <span>{product.leadTime}</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-24 rounded-sm overflow-hidden border transition-all flex-shrink-0 cursor-pointer ${
                      activeImage === img
                        ? "border-[#283C2A] ring-1 ring-[#283C2A]"
                        : "border-[#DCD1C1] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-[11px] font-sans tracking-[0.2em] uppercase mb-2 text-[#967F4F] font-medium">
                {product.category}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#283C2A] font-light leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="font-serif text-2xl sm:text-3xl text-[#283C2A] font-normal">
                  {siteConfig.currency.symbol}
                  {product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#687060]/70 line-through font-sans font-light">
                    {siteConfig.currency.symbol}
                    {product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-2.5 py-1 bg-[#967F4F] text-[#FEF7ED] font-sans font-medium text-xs tracking-wider uppercase rounded-xs">
                    Save{" "}
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>

              {/* Artisan Note */}
              <p className="mt-4 text-sm text-[#687060] leading-relaxed font-sans font-light">
                {product.description}
              </p>
            </div>

            {/* Variants Picker */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#DCD1C1]">
                {product.variants.map((v) => (
                  <div key={v.name}>
                    <label className="block text-xs font-sans uppercase tracking-wider text-[#687060] mb-2 font-medium">
                      {v.name}:{" "}
                      <span className="font-normal text-[#283C2A]">
                        {selectedVariant}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariant(opt)}
                          className={`px-4 py-2 rounded-sm text-xs font-sans tracking-wide uppercase transition-all cursor-pointer ${
                            selectedVariant === opt
                              ? "bg-[#283C2A] text-[#FEF7ED] font-medium"
                              : "bg-[#FFFDF9] text-[#687060] border border-[#DCD1C1] hover:border-[#283C2A] hover:text-[#283C2A]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Color Swatches if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-sans uppercase tracking-wider text-[#687060] font-medium">
                  Colorway:{" "}
                  <span className="font-normal text-[#283C2A]">
                    {selectedColor || product.colors[0].name}
                  </span>
                </label>
                <div className="flex items-center space-x-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                        selectedColor === c.name
                          ? "border-[#283C2A] ring-2 ring-[#283C2A]/30 scale-110"
                          : "border-[#DCD1C1] hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check className="w-3.5 h-3.5 text-stone-800 drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center space-x-4">
              <span className="text-xs font-sans uppercase tracking-wider text-[#687060] font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-[#DCD1C1] rounded-sm bg-[#FFFDF9]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-[#F6EFE3] text-[#283C2A] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-sans font-medium text-[#283C2A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-[#F6EFE3] text-[#283C2A] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dual Primary CTAs */}
            <div className="space-y-3 pt-4 border-t border-[#DCD1C1]">
              <button
                onClick={handleDirectWhatsAppOrder}
                className="w-full btn-primary py-4 px-6 flex items-center justify-center space-x-2 text-xs tracking-[0.16em] uppercase cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#967F4F]" />
                <span>Order Directly on WhatsApp</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full btn-secondary py-3.5 px-6 flex items-center justify-center space-x-2 text-xs tracking-[0.16em] uppercase cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#967F4F]" />
                    <span>Added to Studio Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    <span>Add to Studio Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Bespoke Custom Inquiry Link */}
            <div className="bg-[#F6EFE3] rounded-sm p-4 border border-[#DCD1C1] flex items-start space-x-3">
              <Sparkles className="w-4 h-4 text-[#967F4F] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#687060] font-sans font-light">
                <span className="font-medium text-[#283C2A]">
                  Need custom colors, player names, or bouquet sizes?
                </span>{" "}
                We handcraft bespoke commissions.{" "}
                <Link
                  href="/custom-orders"
                  className="text-[#967F4F] font-medium underline hover:text-[#283C2A] transition-colors"
                >
                  Inquire bespoke piece here
                </Link>
                .
              </div>
            </div>

            {/* Accordion / Tabbed Info */}
            <div className="pt-4 border-t border-[#DCD1C1]">
              <div className="flex border-b border-[#DCD1C1] text-xs font-sans tracking-wider uppercase">
                <button
                  onClick={() => setActiveTab("craft")}
                  className={`py-2 px-4 border-b-2 font-medium transition-colors cursor-pointer ${
                    activeTab === "craft"
                      ? "border-[#283C2A] text-[#283C2A]"
                      : "border-transparent text-[#687060] hover:text-[#283C2A]"
                  }`}
                >
                  Craft &amp; Materials
                </button>
                <button
                  onClick={() => setActiveTab("care")}
                  className={`py-2 px-4 border-b-2 font-medium transition-colors cursor-pointer ${
                    activeTab === "care"
                      ? "border-[#283C2A] text-[#283C2A]"
                      : "border-transparent text-[#687060] hover:text-[#283C2A]"
                  }`}
                >
                  Display &amp; Care
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`py-2 px-4 border-b-2 font-medium transition-colors cursor-pointer ${
                    activeTab === "shipping"
                      ? "border-[#283C2A] text-[#283C2A]"
                      : "border-transparent text-[#687060] hover:text-[#283C2A]"
                  }`}
                >
                  Delivery &amp; Packaging
                </button>
              </div>

              <div className="py-4 text-xs text-[#687060] leading-relaxed font-sans font-light">
                {activeTab === "craft" && (
                  <div className="space-y-2">
                    <p>
                      <strong className="text-[#283C2A] font-medium">Material:</strong>{" "}
                      {product.material || "High-Density Velvety Pipe Cleaners & Chenille Stems"}
                    </p>
                    {product.dimensions && (
                      <p>
                        <strong className="text-[#283C2A] font-medium">Dimensions:</strong> {product.dimensions}
                      </p>
                    )}
                    <p>
                      <strong className="text-[#283C2A] font-medium">Craft Technique:</strong> &ldquo;Turning pipe cleaners into petals.&rdquo; Each petal is hand-curved and shaped individually to achieve a velvety 3D bloom that never withers.
                    </p>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-2">
                    <p>• Gently dust with a soft makeup brush or hair dryer on cool, low setting.</p>
                    <p>• Keep away from prolonged water immersion to preserve chenille wire vibrancy.</p>
                    <p>• Flexible craft wire inside means you can gently re-fluff and adjust petals anytime!</p>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-2">
                    <p>
                      • <strong className="text-[#283C2A] font-medium">Dispatch:</strong> Ready pieces dispatch in 24–48 hours. Custom/made-to-order pieces take {product.leadTime || "3–5 days"}.
                    </p>
                    <p>
                      • <strong className="text-[#283C2A] font-medium">Shipping:</strong> Free standard shipping across India on orders above {siteConfig.currency.symbol}{siteConfig.shipping.freeThreshold.toLocaleString("en-IN")}.
                    </p>
                    <p>
                      • <strong className="text-[#283C2A] font-medium">Packaging:</strong> Arrives wrapped carefully in pleated protective paper with a personalized handwritten gift note.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#DCD1C1]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#967F4F] mb-1 font-medium">
                  Complementary Drops
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#283C2A] font-light">
                  You May Also Cherish
                </h3>
              </div>
              <Link
                href="/shop"
                className="btn-secondary py-2 px-4 text-xs"
              >
                View Collection →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Order Bar */}
      <StickyOrderBar
        product={product}
        selectedVariant={selectedVariant}
        selectedColor={selectedColor}
      />
    </div>
  );
}
