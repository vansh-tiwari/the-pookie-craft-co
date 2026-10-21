import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/data/products";
import type { Catalog } from "./catalog-types";
const file = path.join(
  process.env.POOKIE_DATA_DIR || path.join(process.cwd(), ".data"),
  "catalog.json",
);
const key = "pookie:catalog:v1";
export const seed: Catalog = {
  version: 0,
  products: INITIAL_PRODUCTS.map((p) => ({
    ...p,
    availability: "Available",
    startingPrice: !!p.variants?.length,
    leadTime: "Preparation and delivery time confirmed on enquiry",
  })),
  categories: INITIAL_CATEGORIES.map((name, i) => ({
    id: `category-${i}`,
    name,
    description: "Thoughtfully handmade, just for you.",
    image:
      INITIAL_PRODUCTS.find((p) => p.category === name)?.image_url ||
      "/images/products/chocolate_bouquet.jpg",
  })),
  reviews: [
    {
      id: "rev-1",
      author: "Ananya S., Mumbai",
      quote:
        "The sunflower bouquet looks even more magical in person. The velvety chenille texture is so soft and it arrived in immaculate condition!",
      published: true,
      permission: true,
    },
    {
      id: "rev-2",
      author: "Rohan & Devika, Bengaluru",
      quote:
        "Ordered the personalized Dhoni jersey keychain and Lumiflower lamp for our anniversary. The handcrafted detail and care in packaging is unmatched.",
      published: true,
      permission: true,
    },
    {
      id: "rev-3",
      author: "Kavya P., Delhi",
      quote:
        "Such a breath of fresh air compared to typical factory gifts. Knowing an artisan personally shaped every petal makes it so special.",
      published: true,
      permission: true,
    },
  ],
  home: {
    title: "Little things.\nLots of love.",
    subtitle:
      "Forever flowers, tiny keepsakes, and thoughtful handmade gifts. Made by hand in India, to make someone's day.",
    image: "/images/products/sunflower_bouquet.jpg",
    story:
      "We believe the sweetest gifts have a little piece of you in them. Every bloom and keepsake is shaped by hand, with care in every petal and personality in every detail.",
  },
};
export async function redis(command: (string | number)[]) {
  const response = await fetch(process.env.CONTENT_REDIS_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CONTENT_REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error("Content storage is unavailable. Please try again.");
  const data = await response.json();
  if (data.error) throw new Error("Content storage request failed.");
  return data.result;
}
export function hasRedis() {
  return !!(process.env.CONTENT_REDIS_URL && process.env.CONTENT_REDIS_TOKEN);
}
export async function getCatalog(): Promise<Catalog> {
  if (hasRedis()) {
    const value = await redis(["GET", key]);
    return value ? JSON.parse(value) : seed;
  }
  if (process.env.NODE_ENV === "production") return seed;
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return seed;
    throw e;
  }
}
let writeQueue: Promise<unknown> = Promise.resolve();
export async function saveCatalog(catalog: Catalog) {
  const next = { ...catalog, version: catalog.version + 1 };
  if (hasRedis()) {
    const result = await redis([
      "EVAL",
      "local old=redis.call('GET',KEYS[1]); local version=0; if old then version=cjson.decode(old).version end; if version~=tonumber(ARGV[1]) then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1",
      1,
      key,
      catalog.version,
      JSON.stringify(next),
    ]);
    if (result !== 1)
      throw new Error("Content changed in another tab. Reload before saving.");
  } else {
    if (process.env.NODE_ENV === "production")
      throw new Error("Configure durable content storage before publishing.");
    const task = writeQueue
      .catch(() => {})
      .then(async () => {
        const current = await getCatalog();
        if (current.version !== catalog.version)
          throw new Error(
            "Content changed in another tab. Reload before saving.",
          );
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(`${file}.tmp`, JSON.stringify(next));
        await fs.rename(`${file}.tmp`, file);
      });
    writeQueue = task;
    await task;
  }
  return next;
}
