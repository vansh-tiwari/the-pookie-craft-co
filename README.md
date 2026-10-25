# The Pookie Craft Co.

A mobile-first handmade-gift catalog with customization-aware WhatsApp enquiries, Instagram links, a server-protected owner studio, and stored custom requests. Built on the existing Next.js 15 / React 19 / Tailwind project and existing brand/product photos. Includes a persistent multi-item enquiry bag that slides in from the right over the current page, with product subtotals and one combined WhatsApp/Instagram summary. The bag icon and adding a product open the drawer; continuing to browse keeps the same page and scroll position. No online payment checkout, customer accounts, wishlists, or order tracking.

## Run locally

```sh
npm install
npm run dev
```

Open [the local preview](http://127.0.0.1:3000). The `127.0.0.1` origin avoids service-worker caches from unrelated projects previously served at `localhost:3000`.

Copy `.env.example` into a private environment file only if you do not already have `.env.local`. Preserve existing environment settings. The studio WhatsApp line is configured to `+91 78791 23355`. WhatsApp enquiry and order actions open WhatsApp Web/app directly.

## Owner access

1. Set `ADMIN_EMAIL` in `.env.local`.
2. Run `npm run admin:password` in a private terminal and store the resulting salted hash in `ADMIN_PASSWORD_HASH`. Input is visible in that terminal; plaintext passwords are never saved by the script.
3. Generate a secret with `openssl rand -hex 32`, and set `ADMIN_SESSION_SECRET`.
4. Restart the development server, then visit `/admin`.

There is one owner, no public registration. Sessions expire after eight hours. Cookie sessions are HttpOnly and SameSite Strict, and Secure in production. Server writes check authentication and request origin. Failed logins are throttled. See [handover](docs/HANDOVER.md) for recovery and operations.

## Content and storage

Development uses ignored `.data/catalog.json` and `.data/requests.json`; it is intended for a single local server. Seed products use the existing catalog. Only enquiry-bag selections (product IDs, colours/options, personalization, quantities) are saved in customer localStorage. Prices and images are read from the current catalog; customer enquiries are not stored as browser-local merchant leads.

Production uses an **owner-controlled Upstash-compatible Redis REST database**. Set server-only `CONTENT_REDIS_URL` and `CONTENT_REDIS_TOKEN`. Production admin login, content writes, and custom request storage are disabled until durable storage is configured. Public browsing can display the seed catalog without it. If a configured storage service fails, the application shows an error instead of silently replacing published content.

Uploaded photos are embedded in catalog data for this small Phase 1 catalog. Limits: 350 KB per image, eight photos per product, 4 MB per catalog save. Existing local assets remain in `public/images/`. Catalog saves use version checks to prevent overwriting newer edits. Separate image storage and media URLs are a future scaling step; this implementation deliberately avoids a second paid service.

Custom forms validate all six fields and confirm receipt only after server persistence. Core fields are idea, colours, budget, and personalized text/design; name and contact enable replies. The protected inbox holds up to 500 requests, refuses overflow, and supports permanent deletion. The form has a honeypot and a shared 30-request/hour limit. Logins have a shared ten-attempt/15-minute limit; these global limits are intentionally conservative for a single-owner business. Development counters are process-local; production counters live in Redis.

## Verify

```sh
npm run lint
npm test
npm run build
```

`npm test` starts an isolated local server on port 3101 with random, temporary test credentials and a disposable data directory. It checks multi-item bag identity/merging, fixed versus starting-price totals, restoration, stale/deleted products, combined messages, the enquiry builder, authorization, origin checks, request storage and deletion, publish conflicts, private-review filtering, product metadata, required routes, and disabled payment endpoints. It does not contact WhatsApp, Instagram, or an external database. Permission to bind localhost may be required in a sandbox.

## Costs and launch

No new runtime package dependencies were introduced. The service adapter uses native server-side fetch and Node cryptography.

Planning estimate checked 19 October 2026: Vercel Pro lists **US$20/month**, plus applicable usage/tax; confirm the existing account and seat costs. Vercel Hobby is restricted to personal, non-commercial use, so do not assume a business catalog is eligible for free hosting. Sources: [Vercel pricing](https://vercel.com/pricing), [Hobby plan terms](https://vercel.com/docs/plans/hobby).

Redis can start at **US$0/month within the provider's free-tier quotas**; select the owner’s plan after checking traffic, persistence, and backup needs. Domain registration and renewal are extra and depend on the chosen domain/registrar. No domain or service has been purchased. Source: [Upstash Redis pricing](https://upstash.com/pricing/redis).

Production needs verified contacts/product facts, owner credentials, an approved durable storage account, backups, final policy/business details, a preview review, and owner approval. No production deployment has been performed. See [launch and handover checklist](docs/HANDOVER.md).
