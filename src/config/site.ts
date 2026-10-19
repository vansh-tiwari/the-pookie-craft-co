const rawWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919876543210";
const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, "");
// Auto-normalize: if user supplies 10 digits without country code (standard Indian mobile), prepend 91
const normalizedWhatsapp = cleanWhatsapp.length === 10 ? `91${cleanWhatsapp}` : cleanWhatsapp;
const formattedWhatsapp = normalizedWhatsapp ? `+${normalizedWhatsapp}` : "+919876543210";

export const siteConfig = {
  name: "The Pookie Craft Co.",
  brandSlug: "thepookiecraft",
  tagline: "Turning pipe cleaners into petals.",
  subline: "Handcrafted forever bouquets, custom IPL keychains & glowing Lumiflower lamps.",
  description:
    "Artisan craft studio specializing in velvety pipe cleaner floral bouquets that never wilt, custom sports jersey keychains, chocolate gift hampers, and glowing Lumiflower ambient lamps.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://thepookiecraft.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://thepookiecraft.com",
  
  // Contact & Social channels for Phase 1 checkout
  whatsappNumber: formattedWhatsapp,
  whatsappClean: normalizedWhatsapp || "919876543210",
  whatsappDisplay:
    process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ||
    formattedWhatsapp.replace(/(\+\d{2})(\d{5})(\d{5})/, "$1 $2 $3"),
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "thepookiecraft",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/thepookiecraft/",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello.thepookiecraft@gmail.com",
  studioLocation: "India (Ships Nationwide)",

  // Commercial rules
  currency: {
    symbol: "₹",
    code: "INR",
  },
  shipping: {
    freeThreshold: 999, // Free delivery above ₹999
    standardFee: 79,
    flatRate: 79,
    estimatedDays: "4–6 working days",
  },

  // Checkout engine mode: 'WHATSAPP' | 'INSTAGRAM' | 'RAZORPAY'
  checkoutMode: (process.env.NEXT_PUBLIC_CHECKOUT_MODE || "WHATSAPP") as
    | "WHATSAPP"
    | "INSTAGRAM"
    | "RAZORPAY",

  // Razorpay configuration for Phase 2
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",

  navigation: [
    { label: "Shop Drops", href: "/shop" },
    { label: "Our Story", href: "/story" },
    { label: "Custom Bouquets", href: "/custom-orders" },
    { label: "Studio Portal", href: "/admin" },
  ],
};
