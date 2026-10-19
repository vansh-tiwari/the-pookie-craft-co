# The Pookie Craft Co. (@thepookiecraft) — D2C E-Commerce Storefront

An end-to-end artisanal D2C e-commerce platform built for **The Pookie Craft Co.** ([@thepookiecraft](https://www.instagram.com/thepookiecraft/)). Turning pipe cleaners into petals: handcrafted forever bouquets, custom IPL sports jersey keychains, ambient Lumiflower lamps, and Cadbury sweetheart gift hampers.

---

## 🌸 Key Highlights & Architectural Features

| Feature | Details |
| :--- | :--- |
| **Catalog Hydration** | **Instant 0ms SSR**: All 19 routes prerendered with Next.js 15 App Router |
| **Checkout Flow** | **Dual Phase**: 1-click WhatsApp / Instagram Concierge (Phase 1) + Ready-to-activate Razorpay (Phase 2) |
| **Authentic Instagram Media** | Real 9-post crop assets from your `@thepookiecraft` screenshot in `public/images/instagram/` |
| **Sharp Studio AI Imagery** | Ultra-sharp macro studio photography for hero drops in `public/images/products/` |
| **Mobile Conversion** | **Sticky Mobile Order Bar**: Persistent WhatsApp quick order bar on scroll |
| **Custom Commissions** | **Dedicated Bespoke Studio** (`/custom-orders`) for custom cricket jersey numbers & bouquet sizing |
| **Lead Protection** | **Merchant Lead Vault** (`/admin`): Captures leads locally before WhatsApp opens |
| **Editorial Brand Reveal** | **Brand Curtain**: First-session opening curtain animation with `sessionStorage` guard |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🛠️ Configuration & Brand Customization

All brand information, contact numbers, and checkout toggles live in a single file:
👉 **[`src/config/site.ts`](file:///Users/rtiwar36/Documents/PP/pookie/src/config/site.ts)**

```typescript
export const siteConfig = {
  name: "The Pookie Craft Co.",
  tagline: "Turning pipe cleaners into petals.",
  subline: "Handcrafted forever bouquets, custom IPL keychains & glowing Lumiflower lamps.",
  
  // Update your actual WhatsApp business number
  whatsappNumber: "+919876543210", 
  whatsappDisplay: "+91 98765 43210",
  instagramHandle: "thepookiecraft",
  instagramUrl: "https://www.instagram.com/thepookiecraft/",
  
  // Shipping thresholds
  shipping: {
    freeThreshold: 999, // Free delivery above ₹999
    flatRate: 79,
  },

  // Checkout Mode: 'WHATSAPP' | 'INSTAGRAM' | 'RAZORPAY'
  checkoutMode: "WHATSAPP",
};
```

---

## 🛍️ Active Product Catalog

The products from your Instagram feed and story highlights are defined in:
👉 **[`src/data/products.ts`](file:///Users/rtiwar36/Documents/PP/pookie/src/data/products.ts)**

- **CSK #7 Dhoni Helicopter Jersey Keychain** (₹199)
- **MI #45 Rohit Bleed Blue Jersey Keychain** (₹199)
- **RCB Virat King Jersey Keychain** (₹199)
- **Radiant Sunburst Pookie Sunflower** (₹249 — Under ₹299 drop)
- **The Lumiflower Fairy Blossom Lamp** (₹599)
- **The Pookie Sweetheart Cadbury Bouquet** (₹699)
- **Velvet Sunset Rose Stem** (₹179 — Under ₹199 drop)
- **Lavender Whisper & Pearl Flower** (₹199)
- **Handcrafted Floral Cup Holder Coaster** (₹249)

---

## 📱 Phase 1: WhatsApp & Instagram Checkout Architecture

1. **Bag & Quantity Selection**: Patrons add items to their bag with edition or color choices.
2. **Delivery Details Form**: Patrons enter Name, Phone, and Delivery Address.
3. **Structured WhatsApp URL**: An emoji-formatted WhatsApp message is generated with order reference `#POOKIE-2026-XXXX`, customer details, item breakdown, and subtotal.
4. **Lead Protection**: Before opening WhatsApp, the order is cached in the browser's storage. Even if the customer does not hit send, the merchant can see the lead in `/admin`.
5. **Instagram Fallback**: Patrons can click "Copy for Instagram" to copy the formatted text to clipboard and open `@thepookiecraft` in one click.

---

## 💳 Phase 2: Activating Razorpay Payments

When you are ready to accept UPI / Credit Card / NetBanking directly on your website:

1. Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_CHECKOUT_MODE="RAZORPAY"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_your_actual_key"
RAZORPAY_KEY_ID="rzp_live_your_actual_key"
RAZORPAY_KEY_SECRET="your_actual_secret"
```

2. The built-in API routes are already configured:
- `POST /api/create-order`: Generates Razorpay order IDs with amount verification.
- `POST /api/verify-payment`: Validates Razorpay HMAC SHA256 payment signatures.

---

## 🛡️ Studio Merchant Portal (`/admin`)

Visit **[`/admin`](http://localhost:3000/admin)** on your store:
- **Order Pipeline**: View new inquiries, crafting in-progress, and dispatched parcels.
- **Customer Contacts**: Names, phone numbers, delivery addresses, and custom notes.
- **One-Click Chat**: Open a direct WhatsApp chat with any patron right from the table.
- **CSV Export**: Download orders for courier label printing or account reconciliation.
