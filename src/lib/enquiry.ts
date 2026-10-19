import type { Product } from "@/types";
import { availability, priceLabel } from "./catalog-types";
import { siteConfig, whatsappLink } from "@/config/site";
export interface Choices {
  color: string;
  personalization: string;
  quantity: number;
  variants: Record<string, string>;
}
export function productEnquiry(
  product: Product,
  choices: Choices,
  baseUrl = siteConfig.siteUrl,
) {
  if (
    !Number.isSafeInteger(choices.quantity) ||
    choices.quantity < 1 ||
    choices.quantity > 99
  )
    throw new Error("Choose a quantity between 1 and 99.");
  if (
    product.colors?.length &&
    !product.colors.some((c) => c.name === choices.color)
  )
    throw new Error("Please choose a color.");
  if (
    product.variants?.some((v) => !v.options.includes(choices.variants[v.name]))
  )
    throw new Error("Please choose each product option.");
  if (product.personalizationRequired && !choices.personalization.trim())
    throw new Error("Please enter your personalized text or design.");
  const intro =
    availability(product) === "Sold Out"
      ? "Hi! Could you confirm restocking or made-to-order options for this sold-out piece?"
      : "Hi, I’d like to place an order with The Pookie Craft Co.";
  return [
    intro,
    `Product: ${product.name}`,
    `Price: ${priceLabel(product)}${product.startingPrice ? " (quote to be confirmed)" : ""}`,
    `Colour: ${choices.color || "Not applicable"}`,
    `Personalized text/design: ${choices.personalization.trim() || "None requested"}`,
    ...Object.entries(choices.variants).map(([k, v]) => `${k}: ${v}`),
    `Quantity: ${choices.quantity}`,
    `Product link: ${baseUrl}/product/${product.slug}`,
    "Please confirm delivery charges and the final amount.",
  ].join("\n");
}
export function productEnquiryUrl(
  p: Product,
  c: Choices,
  baseUrl = siteConfig.siteUrl,
) {
  return whatsappLink(productEnquiry(p, c, baseUrl));
}
