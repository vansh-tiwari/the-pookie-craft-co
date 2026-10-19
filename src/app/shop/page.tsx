import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
export const metadata = {
  title: "Shop Gifts | The Pookie Craft Co.",
  description:
    "Explore forever flowers, custom keychains, ambient lamps, and handcrafted gifts. Filter by category, colour, price, and availability.",
  alternates: { canonical: "/shop" },
};
export default async function ShopPage() {
  const c = await getCatalog();
  c.reviews = c.reviews.filter((r) => r.published && r.permission);
  return (
    <Suspense
      fallback={
        <div className="max-w-[1280px] mx-auto px-6 py-28 text-sm font-sans text-[#667062]">
          Loading collection…
        </div>
      }
    >
      <ShopCatalog catalog={c} />
    </Suspense>
  );
}
