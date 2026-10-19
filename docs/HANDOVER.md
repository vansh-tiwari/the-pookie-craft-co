# Owner and developer handover

## Delivered locally

- Retained the Next.js project, logo, Instagram crops, and product photos; rebuilt the responsive customer interface with cream, forest, pink, and pastel accents.
- Homepage hero, seven category shortcuts, featured and best-seller selections, editable story, approved-review area, and reliable local Instagram gallery.
- Catalog search by name, category (including additional product categories), maximum price, colour, availability, and price sorting. Empty results offer reset and custom enquiry actions.
- Shareable product routes with multiple photos, dimensions, materials, options, colour, personalization, quantity, fixed/starting prices, and three availability states.
- Dynamic, encoded WhatsApp enquiries include chosen options and the product URL. Sold-out enquiries explicitly ask about restocking/made-to-order possibilities. No order is automatically confirmed.
- Custom requests persist server-side before success; only the owner can read/delete them. Optional reference images can be shared in the follow-up conversation.
- Owner email/password authentication, protected mutations, image upload, product/category editing and ordering, homepage text/banner, permission-gated reviews, draft/publish separation, stale-write protection, and backup import/export for catalog content.
- About, contact, FAQs, shipping, replacements, privacy, and terms pages. Sitemap, robots, canonical URLs, product social metadata, basic Product JSON-LD, reduced-motion CSS, keyboard focus, skip link, labels, and meaningful image text.
- Restored a persistent multi-item enquiry bag with separate customized selections, quantity/removal controls, product subtotals, a combined WhatsApp message, and a copyable Instagram summary. Shipping is agreed by location; starting/customized prices remain estimates.
- Removed the public browser-local lead dashboard, payment-checkout workflow, unapproved reviews, invented fixed shipping charges, and unused payment-checkout components. Former payment API endpoints return 410 even if legacy payment environment variables remain.

The existing product descriptions/prices/options are seed content, not newly verified business facts. The owner must approve them before publication. Empty categories have useful empty states; new product data was not fabricated to fill them.

## Customer enquiry bag

Choose options, colour, personalization, and quantity on a product page, then add the selection to the enquiry bag. Identical selections merge; different customization stays separate. The header bag button opens a right-hand drawer over the current page, where quantities can be changed and items removed. Adding a product opens the same drawer automatically. “Continue browsing”, the close button, Escape, or clicking the dimmed backdrop dismisses it and preserves the page and scroll position. Old `/bag` bookmarks redirect to the shop and open this drawer rather than a separate bag page. The bag survives reloads on the same browser; clearing it removes saved selections. No address or payment information is required.

The bag separates fixed-price amounts from starting/customized estimates. It does not add shipping or present a final payable total. Sold-out products are restock enquiries. If a product is deleted or its available options change, remove the affected selection and add the new choices before sending. Opening the drawer refreshes current catalog prices and options; enquiry actions wait for a successful refresh. The drawer traps keyboard focus, locks background scrolling, and restores focus to the opening control when closed.

“Enquire on WhatsApp” prepares one complete message; the customer reviews and sends it in WhatsApp. Until a real studio number is configured, this action is disabled with contact alternatives. “Copy summary for Instagram” copies the same information, with a selectable-text fallback if clipboard access fails. The website never automatically sends a message, confirms an order, or clears the bag after opening another app.

## Daily owner workflow

1. Sign in at `/admin`. There is no registration page.
2. **Products:** add/edit an item; set a unique URL, price type, main/additional categories, description, size, colours/options, photos, availability, and homepage flags. Required personalization can be toggled per product. Save the product into the draft.
3. Use arrow controls to order products. Homepage sections use this order and show up to four products each. Deleting a product also removes it from homepage selections because selections are flags on the products themselves.
4. **Categories:** edit names/descriptions/photos/order. Renaming updates product assignments. Reassign all associated products before deleting an in-use category.
5. **Homepage:** change banner photo, headline, introduction, and story. Product cards and homepage text have draft previews. “View storefront” shows the currently published version.
6. **Reviews:** enter genuine feedback, record customer permission, and enable publication. Unapproved reviews are excluded from public rendering and public responses. No fake ratings or verified-purchase badges are generated.
7. **Publish changes** applies the draft to the live content store immediately. For preview review, use a separate preview database so edits cannot affect production. Unsaved edits are marked; failed publication leaves the draft intact. Reloading published content or signing out warns before discarding edits. Browser unload prompts cover changed drafts.
8. **Custom requests:** refresh the inbox, reply via the contact the customer provided, and delete contact details when no longer needed. This is an enquiry inbox, not sales/order tracking. No email notification is configured; the owner checks the inbox manually.
9. Download a content backup before deleting products/categories. Store backups privately. Catalog backups do not include customer requests; the full developer backup does.

Changing a product slug changes its public link. The editor warns about this; automatic redirect history is not implemented. Preserve published slugs when possible.

## Account setup and recovery

All credentials stay in environment variables, never source control. Generate the owner password hash using `npm run admin:password`, then configure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and a random `ADMIN_SESSION_SECRET` of at least 32 characters. Keep the real password in an owner-controlled password manager.

Recovery: the authenticated Vercel project owner generates a new salted password hash locally, replaces `ADMIN_PASSWORD_HASH` in the appropriate deployment environment, rotates `ADMIN_SESSION_SECRET`, and redeploys. Existing sessions become invalid. There is no email-reset provider or public password-reset endpoint. Transfer project/account recovery access securely to the business owner.

The shared login throttle resets after 15 minutes. Do not clear production throttling merely to bypass an active attack. Review hosting logs if repeated failures occur. Never log login bodies or secrets.

## Storage and media

| Data                       | Development                        | Production                                      |
| -------------------------- | ---------------------------------- | ----------------------------------------------- |
| Source and shipped images  | Git/workspace; `public/images/`    | Owner-controlled repository + Vercel deployment |
| Catalog and uploaded media | `.data/catalog.json`               | Redis key `pookie:catalog:v1`                   |
| Custom requests            | `.data/requests.json`              | Redis list `pookie:requests:v1`                 |
| Authentication             | Server environment + signed cookie | Vercel environment + Secure signed cookie       |
| Throttle counters          | Process memory                     | Expiring Redis counters                         |

Use a persistent Redis database, not an evictable cache. Keep credentials server-only and configure the provider account, region, persistence, and access controls under the owner. Do not use an anonymous temporary database. There is no Supabase or additional auth subscription.

Uploaded photos live inside the catalog, so backups include their bytes. They are limited to small raster files; local public assets use Next image optimization. Inline uploaded images bypass the optimizer, so compress them before uploading. The whole-catalog 4 MB limit is intentionally small; splitting catalog rows and moving images to object storage will be needed for a much larger catalog. Dynamic pages fetch current content for correctness; do not claim real-user Core Web Vitals until measured on the deployment.

## Backups and restore

Git protects source and shipped media only. It does not back up business data.

**Catalog only:** use “Download content backup” in the dashboard. To recover, choose “Restore backup”, review the loaded draft, then publish. This restores product/category/home/review content and uploaded photos. The current version is preserved until publish, and publication advances it so stale tabs cannot overwrite it.

**Complete production snapshot:** in a private developer terminal with owner-provided server environment variables:

```sh
node --env-file=.env.local scripts/backup.mjs export /private/path/pookie-backup.json
```

This reads catalog plus customer requests atomically from Redis and creates a private file without overwriting existing backups. Store it in owner-controlled encrypted storage. The file contains customer contact details and must not be committed or publicly shared. Enable provider-managed backups if the chosen plan supports them. Agree a schedule and retention period with the owner; no automated backup schedule has been provisioned.

To restore a complete snapshot, first export the current state to a different private file. Then:

```sh
node --env-file=.env.local scripts/backup.mjs restore /private/path/pookie-backup.json
```

Type `RESTORE` only after confirming the destination database and backup. This atomically replaces both the catalog and the request inbox, advances the catalog version, and preserves the saved request ordering. Use only trusted backups produced by this project. Reload the dashboard and verify product pages, images, homepage selections, and the request inbox. Protect backups with the same care as live contact data.

For development, stop the server and copy the entire ignored `.data/` directory to private storage. Restore that directory while the server is stopped. Development files are single-machine storage and must never be relied on inside a serverless production deployment.

For a failed code deployment, roll back the Vercel deployment using the owner account. Code rollback does not undo content changes; restore content separately from a backup when necessary.

## Deployment sequence

1. Use the existing repository and Vercel project. Verify the owner has account/repository access and a plan suitable for commercial use. No production deployment or custom domain has been performed in this task.
2. Configure a **separate preview Redis database** and owner credentials/contact values in Vercel Preview environment variables. Set `NEXT_PUBLIC_SITE_URL` to the real preview URL for testing share links, then redeploy. Do not connect preview writes to production data.
3. Run `npm run lint`, `npm test`, and `npm run build`. Build command: `npm run build`; framework: Next.js. Public contact variables require a rebuild after changes.
4. Review on 375/390 px phones, tablets, and desktop, using the actual preview. Check all photos, category/filter combinations, product options, sold-out behavior, custom-request storage, login/permissions, and owner editing. Send only owner-approved test messages when checking WhatsApp/Instagram.
5. Run Lighthouse on the preview/production build, inspect keyboard operation, contrast, focus, image sizes, and layout shift. These remain launch checks, not performance guarantees.
6. Ask the owner to approve product facts, contact details, legal/business wording, and the preview. Record that approval before publishing production changes.
7. Configure production Redis/account variables and a baseline backup. Use the production URL in `NEXT_PUBLIC_SITE_URL`. Publish the approved code, verify HTTPS, robots/sitemap, product social previews, requests, and admin authorization.
8. The owner registers an available domain in their own account. Follow Vercel’s domain-specific DNS instructions, choose one canonical hostname, redirect the alternate, and update/redeploy `NEXT_PUBLIC_SITE_URL`. Set renewal reminders in the owner account. The example domains in the specification are not assumed available.
9. Add the verified domain to Search Console when the owner grants access; submit `/sitemap.xml`. Search indexing cannot be guaranteed.

## Decisions still required for launch

- Owner’s real WhatsApp number, business email, business identity/contact details, verified Instagram handle, final product facts and photos.
- Owner-controlled production Redis account/plan, region, credentials, persistence, backup schedule/retention, privacy retention schedule, and password-manager recovery access.
- Available custom domain, registration and service budget. See README for provider pricing references; no purchases were made.
- Genuine customer feedback and permission. The review section stays hidden until permitted reviews are published.
- Advance amount/percentage, payment deadline/proof process, practical damaged-item reporting/replacement steps, and final approved policy wording. No unconfirmed deadlines or refund guarantees were invented.
- Policy approval and relevant business disclosures. Reference material checked: [Consumer Affairs rules](https://consumeraffairs.gov.in/pages/consumer-protection-acts), [consumer rights](https://consumeraffairs.gov.in/pages/consumer-rights), and [MeitY data protection rules](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025). These pages do not by themselves establish this store’s compliance.
- Preview review, production database integration test, full mobile/tablet/desktop QA, measured performance/accessibility checks, and approval to deploy.

## Validation record

Automated local verification covers enquiry selection/encoding/validation, restock wording, invalid custom-form fields, server persistence, owner-only reads/deletes, authentication/cookie settings, anonymous/cross-origin rejection, category-integrity checks, content publishing, concurrent-version rejection, private-review filtering, product structured data, sitemap/domain construction, public routes, and disabled checkout APIs.

The browser preview was inspected at desktop and narrow viewports. The reference storefront’s right-hand cart interaction was checked, then the local drawer was verified for opening over the current page, adding a selection, Escape/backdrop/continue-browsing dismissal, focus restoration, and message preview inside the drawer. The mobile menu exposed all seven categories, a category link produced the correct filtered products, and an unmatched search produced reset/custom-request actions. This is not a claim of exhaustive real-device, Lighthouse, Redis-provider, or production testing.

The local preview is a review artifact. No live URL, owner approval, custom-domain verification, or production launch is claimed.
