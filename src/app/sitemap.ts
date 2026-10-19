export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { siteConfig } from "@/config/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getCatalog();
  return [
    "",
    "/shop",
    "/story",
    "/contact",
    "/custom-orders",
    "/faq",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    ...c.products.map((p) => `/product/${p.slug}`),
  ].map((path) => ({ url: siteConfig.siteUrl + path }));
}
