import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { availability, priceLabel } from "@/lib/catalog-types";
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const status = availability(product);
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-photo">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 25vw"
          priority={priority}
          className="object-cover"
        />
        {product.bestseller && (
          <span className="product-badge">A little favourite</span>
        )}
        {status !== "Available" && (
          <span className="availability-badge">{status}</span>
        )}
        <span className="photo-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="product-info">
        <p>{product.category}</p>
        <Link href={`/product/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="price-row">
          <strong>{priceLabel(product)}</strong>
          <span>{status}</span>
        </div>
        <Link href={`/product/${product.slug}`} className="product-action">
          {status === "Sold Out"
            ? "Ask about restocking"
            : "Choose your details"}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
