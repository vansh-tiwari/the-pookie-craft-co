import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { INITIAL_PRODUCTS } from "@/data/products";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | The Pookie Craft Co.",
    };
  }

  return {
    title: `${product.name} | The Pookie Craft Co.`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = INITIAL_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  // Fallback to any other products if no category match
  const recommendations =
    relatedProducts.length > 0
      ? relatedProducts
      : INITIAL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={recommendations}
    />
  );
}
