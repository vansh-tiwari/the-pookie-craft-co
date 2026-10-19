const raw = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
  /[^0-9]/g,
  "",
);
const configured = raw === "919876543210" ? "" : raw;
const number = configured.length === 10 ? `91${configured}` : configured;
export const siteConfig = {
  name: "The Pookie Craft Co.",
  brandSlug: "thepookiecraft",
  tagline: "Turning pipe cleaners into petals.",
  subline: "Handmade flowers, little keepsakes, and gifts with heart.",
  description:
    "Discover handmade forever flowers, personalized keychains, thoughtful gifts, and glowing flower lamps. Made with love in India. Enquire on WhatsApp or Instagram.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://the-pookie-craft-co.vercel.app",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://the-pookie-craft-co.vercel.app",
  whatsappNumber: number ? `+${number}` : "",
  whatsappClean: /^\d{11,15}$/.test(number) ? number : "",
  whatsappDisplay:
    process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ||
    (number ? `+${number}` : "To be confirmed"),
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "thepookiecraft",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/thepookiecraft/",
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  studioLocation: "Handmade in India · Delivery across India",
  currency: { symbol: "₹", code: "INR" },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About us", href: "/story" },
    { label: "Contact", href: "/contact" },
    { label: "Custom orders", href: "/custom-orders" },
  ],
};
export function whatsappLink(message: string) {
  return siteConfig.whatsappClean
    ? `https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent(message)}`
    : "/contact?channel=whatsapp";
}
