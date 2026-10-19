import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { siteConfig } from "@/config/site";
import { ProductDetailClient } from "./ProductDetailClient";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getCatalog()).products.find((p) => p.slug === slug);
  return p
    ? {
        title: p.name,
        description: p.description,
        alternates: { canonical: `/product/${p.slug}` },
        openGraph: {
          title: p.name,
          description: p.description,
          url: `${siteConfig.siteUrl}/product/${p.slug}`,
          images: p.image_url.startsWith("/") ? [p.image_url] : [],
        },
      }
    : { title: "Product not found" };
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const p = catalog.products.find((p) => p.slug === slug);
  if (!p) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images
      .filter((i) => i.startsWith("/"))
      .map((i) => siteConfig.siteUrl + i),
    url: `${siteConfig.siteUrl}/product/${p.slug}`,
    brand: { "@type": "Brand", name: siteConfig.name },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetailClient
        key={p.id + catalog.version}
        product={p}
        relatedProducts={catalog.products
          .filter((x) => x.id !== p.id && x.category === p.category)
          .slice(0, 4)}
      />
    </>
  );
}
