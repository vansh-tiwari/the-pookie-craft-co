import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
export const metadata = {
  title: "Shop handmade gifts",
  description:
    "Explore forever flowers, keychains, lamps, and personalised gifts. Filter by category, colour, price, and availability.",
  alternates: { canonical: "/shop" },
};
export default async function ShopPage() {
  const c = await getCatalog();
  c.reviews = c.reviews.filter((r) => r.published && r.permission);
  return (
    <Suspense
      fallback={<p className="section-wrap">Opening the happy little shop…</p>}
    >
      <ShopCatalog catalog={c} />
    </Suspense>
  );
}
