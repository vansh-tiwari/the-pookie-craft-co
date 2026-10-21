import type { Product } from "@/types";
import type { Choices } from "./enquiry";
import { productEnquiry } from "./enquiry";
import { availability } from "./catalog-types";
import { siteConfig } from "@/config/site";

export interface BagItem {
  key: string;
  productId: string;
  choices: Choices;
}
export const BAG_STORAGE_KEY = "pookie_enquiry_bag_v1";
export const MAX_BAG_ITEMS = 40;
export function selectionKey(productId: string, choices: Choices) {
  return JSON.stringify([
    productId,
    choices.color,
    choices.personalization.trim(),
    Object.entries(choices.variants).sort(([a], [b]) => a.localeCompare(b)),
  ]);
}
export function createBagItem(product: Product, choices: Choices): BagItem {
  const clean = {
    ...choices,
    personalization: choices.personalization.trim(),
    variants: Object.fromEntries(
      (product.variants || []).map((v) => [v.name, choices.variants[v.name]]),
    ),
  };
  productEnquiry(product, clean);
  return {
    key: selectionKey(product.id, clean),
    productId: product.id,
    choices: clean,
  };
}
export function addBagItem(items: BagItem[], item: BagItem) {
  const existing = items.find((x) => x.key === item.key);
  if (existing) {
    const quantity = existing.choices.quantity + item.choices.quantity;
    if (quantity > 99)
      throw new Error(
        "Each selection can have up to 99 pieces. Adjust the quantity in your bag.",
      );
    return items.map((x) =>
      x.key === item.key ? { ...x, choices: { ...x.choices, quantity } } : x,
    );
  }
  if (items.length >= MAX_BAG_ITEMS)
    throw new Error(
      "Your bag has 40 different selections. Please enquire about these before adding more.",
    );
  return [...items, item];
}
export function readBag(value: unknown): BagItem[] {
  if (!Array.isArray(value)) return [];
  const items: BagItem[] = [];
  for (const item of value.slice(0, MAX_BAG_ITEMS)) {
    const c = item?.choices;
    if (
      typeof item?.productId !== "string" ||
      item.productId.length > 500 ||
      !c ||
      typeof c.color !== "string" ||
      c.color.length > 200 ||
      typeof c.personalization !== "string" ||
      c.personalization.length > 1000 ||
      !Number.isSafeInteger(c.quantity) ||
      c.quantity < 1 ||
      c.quantity > 99 ||
      !c.variants ||
      typeof c.variants !== "object" ||
      Array.isArray(c.variants)
    )
      continue;
    const entries = Object.entries(c.variants);
    if (
      entries.length > 10 ||
      entries.some(
        ([key, v]) =>
          key.length > 200 || typeof v !== "string" || v.length > 500,
      )
    )
      continue;
    const choices: Choices = {
      color: c.color,
      personalization: c.personalization.trim(),
      quantity: c.quantity,
      variants: Object.fromEntries(entries) as Record<string, string>,
    };
    const next = {
      productId: item.productId,
      choices,
      key: selectionKey(item.productId, choices),
    };
    try {
      const merged = addBagItem(items, next);
      items.splice(0, items.length, ...merged);
    } catch {
      /* Ignore invalid duplicate quantities in persisted input. */
    }
  }
  return items;
}
export function bagLines(items: BagItem[], products: Product[]) {
  return items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    let error = "";
    if (!product)
      error =
        "This product is no longer listed. Remove it before sending your enquiry.";
    else {
      try {
        productEnquiry(product, item.choices);
      } catch (e) {
        error =
          e instanceof Error
            ? e.message
            : "Please reselect this product’s options.";
      }
    }
    const estimated =
      !!product?.startingPrice || !!item.choices.personalization.trim();
    return {
      item,
      product,
      error,
      estimated,
      amount: product
        ? (Math.round(product.price * 100) * item.choices.quantity) / 100
        : 0,
    };
  });
}
export function bagTotals(items: BagItem[], products: Product[]) {
  const lines = bagLines(items, products);
  const fixed =
    lines
      .filter((l) => !l.error && !l.estimated)
      .reduce((sum, l) => sum + Math.round(l.amount * 100), 0) / 100;
  const estimated =
    lines
      .filter((l) => !l.error && l.estimated)
      .reduce((sum, l) => sum + Math.round(l.amount * 100), 0) / 100;
  return {
    lines,
    fixed,
    estimated,
    subtotal: Math.round((fixed + estimated) * 100) / 100,
    productTotal: Math.round((fixed + estimated) * 100) / 100,
    needsQuote: lines.some((l) => l.estimated),
    canEnquire: lines.length > 0 && lines.every((l) => !l.error),
  };
}
export const money = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
export function bagEnquiry(
  items: BagItem[],
  products: Product[],
  baseUrl = siteConfig.siteUrl,
  giftNote?: string,
) {
  const totals = bagTotals(items, products);
  if (!items.length)
    throw new Error("Add a product to your bag first.");
  if (!totals.canEnquire)
    throw new Error(
      "Some bag items have changed. Remove them and choose their details again before placing your order.",
    );
  const parts = totals.lines.map(({ product: p, item, estimated, amount }, i) =>
    [
      `${i + 1}. ${p!.name}`,
      `Availability: ${availability(p!)}${availability(p!) === "Sold Out" ? " — please confirm restocking or made-to-order options" : ""}`,
      `Unit price: ${p!.startingPrice ? "From " : ""}${money(p!.price)}`,
      `Colour: ${item.choices.color || "Not applicable"}`,
      ...Object.entries(item.choices.variants).map(([k, v]) => `${k}: ${v}`),
      `Personalized text/design: ${item.choices.personalization || "None requested"}`,
      `Quantity: ${item.choices.quantity}`,
      `${estimated ? "Line Total (estimate pending quote)" : "Line Total"}: ${money(amount)}`,
      `Product link: ${baseUrl}/product/${p!.slug}`,
    ].join("\n"),
  );

  const lines = [
    "Hi, I’d like to place an order with The Pookie Craft Co.",
    ...parts,
    `Product Total: ${totals.needsQuote ? "From " : ""}${money(totals.productTotal)}`,
  ];

  if (giftNote && giftNote.trim()) {
    lines.push(`💌 Complimentary Handwritten Gift Note:\n"${giftNote.trim()}"`);
  }

  lines.push(
    "Delivery charges to be confirmed after sharing delivery location.",
    "Please confirm delivery charges and the final amount.",
  );

  return lines.join("\n\n");
}
