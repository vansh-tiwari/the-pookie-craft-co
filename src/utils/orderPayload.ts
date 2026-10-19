import { Order, OrderCustomer, CartItem } from "@/types";
import { siteConfig } from "@/config/site";

export function formatOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `POOKIE-${year}-${randomSuffix}`;
}

export function buildWhatsAppMessage(order: {
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}): string {
  const itemsText = order.items
    .map((item, index) => {
      const variantDetail = item.variant ? ` (${item.variant})` : "";
      return `   ${index + 1}. *${item.name}*${variantDetail}\n      Qty: ${item.quantity} × ${siteConfig.currency.symbol}${item.price.toLocaleString("en-IN")}`;
    })
    .join("\n");

  const shippingText =
    order.shipping === 0
      ? "FREE (Studio Privilege)"
      : `${siteConfig.currency.symbol}${order.shipping}`;

  return [
    `🌸 *NEW ORDER REQUEST — ${siteConfig.name.toUpperCase()}*`,
    `Order Ref: *#${order.orderNumber}*`,
    `--------------------------------------`,
    `👤 *Customer Details:*`,
    `• Name: ${order.customer.name}`,
    `• Contact: ${order.customer.phone}`,
    order.customer.email ? `• Email: ${order.customer.email}` : null,
    `• Delivery Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
    order.customer.notes ? `• Special Note / Customization: "${order.customer.notes}"` : null,
    `--------------------------------------`,
    `🎁 *Pookie Item(s):*`,
    itemsText,
    `--------------------------------------`,
    `• Subtotal: ${siteConfig.currency.symbol}${order.subtotal.toLocaleString("en-IN")}`,
    `• Shipping: ${shippingText}`,
    `• *TOTAL PAYABLE: ${siteConfig.currency.symbol}${order.total.toLocaleString("en-IN")}*`,
    `--------------------------------------`,
    `✨ *Craft Note:* Turning pipe cleaners into petals. Forever blooms that stay with them forever! Please confirm dispatch slot.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function getWhatsAppCheckoutUrl(order: {
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}): string {
  const text = buildWhatsAppMessage(order);
  const cleanNumber = siteConfig.whatsappClean || siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function saveOrderLead(order: Order): void {
  try {
    const existing = localStorage.getItem("pookie_craft_orders") || "[]";
    const orders: Order[] = JSON.parse(existing);
    const updated = [order, ...orders.filter((o) => o.id !== order.id)];
    localStorage.setItem("pookie_craft_orders", JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("pookie_craft_orders_updated", { detail: updated })
      );
    }
  } catch (e) {
    console.error("Failed to save order lead to local storage", e);
  }
}
