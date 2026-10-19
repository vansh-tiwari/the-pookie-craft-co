# Storefront design and ordering plan

Date: 20 October 2026  
Branch: `codex/storefront-design-plan`  
Status: design plan for the next implementation; storefront code is unchanged in this planning pass.

## 1. Design judgement

The current site has a working catalog and a useful cart drawer, but its visual identity and purchase language are underdeveloped. The repeated cream sections, arched photographs, pill buttons, small labels, and decorative hearts make it resemble a familiar gift-store template. A stronger site needs a recognisable composition, coherent product imagery, and direct commercial language. Animation should reinforce those decisions.

The proposed direction is **a contemporary Indian craft and gift studio**: tactile materials, confident typography, rich colour accents, precise shopping controls, and a small number of expressive motion moments. Keep the Pookie name and existing logo. Let the character come from chenille textures, flowers, personalisation, and the actual products.

The reference [Crochet Cult](https://www.crochetcult.app/) remains useful for shopping behavior: contextual cart access, a right-hand drawer, visible product details, and continued browsing. Pookie should develop its own art direction around its different materials and product range.

## 2. Findings from the current site

These findings combine direct browser inspection of Home and Shop with review of the product, drawer, and catalog implementations. They are a design audit, not conversion or usability-study results.

| Priority | Finding | Customer impact | Planned response |
| --- | --- | --- | --- |
| P0 | “Enquiry” appears throughout purchase actions and messages. | Buying feels provisional and unnecessarily complicated. | Use Bag, Add to Bag, Product Total, and Order on WhatsApp consistently. |
| P0 | Starting prices, optional extras, and the total need a clearer relationship. | Customers cannot easily understand what their chosen configuration costs. | Explicit product price types and structured option prices; one Product Total with a short charges note. |
| P1 | Home uses an arch, sticker, pastel strip, repeated section labels, and similar grids. | The store lacks a distinctive visual signature and reading rhythm. | A composed product-led hero, stronger type, varied editorial/shopping sections, and a material-based motif. |
| P1 | Category shortcuts reuse the same bouquet image for several different categories. | Categories look unfinished and are harder to distinguish. | Representative approved images, or deliberate text-led category tiles until those images exist. |
| P1 | Sharp product photography sits beside low-resolution social crops containing text and interface fragments. | The product range feels inconsistent and less trustworthy. | Establish a photography standard; separate catalog photographs from social content. |
| P1 | Featured and best-seller areas repeat several of the same products. | More scrolling provides little additional discovery. | One strong curated product section, then different category, process, and customization content. |
| P1 | Shop gives substantial vertical space to its introduction and six-field filter block. | Products appear too late in the first viewport. | Compact shop heading, category tabs, and a concise search/filter/sort toolbar. |
| P1 | Product names are long, body copy is repetitive, and the mobile gallery precedes a long selection form. | Customers must work to find price, options, and the order action. | Short display names, concise specifications, a tighter gallery, and a mobile action bar. |
| P1 | “Little,” “happy,” and “heart” recur across navigation, buttons, headings, and helper text. | The voice becomes repetitive and less confident. | Clear shopping labels; warmth in selected brand moments rather than every control. |
| P2 | Most movement is hover styling and a drawer entrance. | The interface has little sense of continuity or crafted character. | A coordinated motion system for discovery, selection, bag updates, and one signature studio moment. |

## 3. Art direction

### Brand expression

Working creative idea: **Made to be kept.**

The site should feel like a thoughtfully art-directed gift studio: expressive in product presentation and dependable in shopping behavior.

Proposed hero copy:

> Made to be kept.  
> Handcrafted flowers, personalised keepsakes, and gifts. Made in India.  
> **Shop Gifts** · **Create a Custom Gift**

Keep the established brand name, logo, and handmade positioning. Use approved facts and images. Existing prices, availability, and product claims need owner confirmation before launch.

### Visual system

| Element | Proposed treatment |
| --- | --- |
| Main canvas | Warm paper `#F6F0E6`; texture restricted to selected large editorial backgrounds. |
| Main text | Deep ink `#252923`, including strong readable prices. |
| Brand accent | Mulberry `#682B43` for primary actions and selected states. |
| Supporting accent | Marigold `#E6B94A` for restrained highlights; lilac `#C8BED8` for occasional collection backgrounds. |
| Display typography | Prototype Fraunces in medium/semibold weights for expressive, readable headlines. |
| Interface typography | Prototype Manrope for navigation, product information, forms, and totals. Self-host selected font files when implementing. |
| Shape | Rectangular compositions and 6–10 px control corners; rounded forms where they have a purpose, such as colour swatches. |
| Layout | A 12-column desktop structure, approximately 1320–1440 px content width, and 20 px mobile gutters. |
| Type scale | Approximately 80–112 px hero display on wide screens, 42–56 px on mobile; body 16 px; controls 14–16 px. Test actual text fit. |
| Graphic signature | A restrained chenille-wire line that curves through selected editorial compositions and resolves into a petal or loop. Create this as an original SVG/code asset. |
| Shadows | Reserved for overlays, lifted imagery, and active layers. |

These colours and type sizes are prototype starting values. Contrast, real product imagery, and phone testing determine the final tokens.

### Photography

1. Create an asset inventory for all nine current products, category covers, hero, detail views, packaging, and making-process images.
2. Use a consistent product angle, background family, white balance, and scale for catalog covers. Keep a 4:5 card crop and permit landscape compositions in editorial sections.
3. Capture or obtain clean originals for the low-resolution social crops. Keep text-bearing social images in the Instagram gallery rather than as default catalog covers.
4. Show material texture, scale in a hand, and packaging where approved photographs are available.
5. Give each category a distinct image. Empty categories can use a deliberate text/graphic tile and a custom-order action; they should not borrow a misleading product photo.
6. Preserve the actual product’s appearance. Do not fabricate sale products or present invented imagery as stock photography of an item for purchase.

Photography is a design dependency. Layout and motion cannot compensate for inconsistent source assets.

## 4. Homepage composition

Use a clear progression from product desire to shopping, then proof of craft:

1. **Compact header:** logo, Shop dropdown, Custom Orders, Our Story, search, and bag. Put contact and policy detail in appropriate secondary locations. On mobile, keep search and bag easy to reach.
2. **One product-led hero:** a confident headline with a large asymmetric product composition and one small material-detail inset. Replace the generic arch/sticker treatment. Keep the primary CTA immediately visible. An optional manually selected collection switch can change the hero product and destination; timed changes must not interrupt reading.
3. **Concise category navigation:** clear product types, balanced representative imagery, and direct labels. All seven categories remain reachable. Custom Orders leads to the custom brief rather than an empty listing.
4. **Curated products:** one balanced selection of flowers, keepsakes, lamps, and gifts, controlled by the owner. Product name, price, availability, and purchase action remain visible. Best-seller flags are owner-managed.
5. **Studio/process feature:** approved macro and making images with a short material story. This is the signature editorial moment, with optional motion.
6. **Personalisation feature:** show what can be customised using actual available options; link into a product or custom-order brief.
7. **Approved customer feedback and studio gallery:** keep genuine, permitted reviews. Show a smaller, intentional social selection.
8. **Useful footer:** contacts, delivery/replacement information, privacy/terms, and owner access.

Avoid consecutive product sections containing the same selections. Preserve owner management of homepage content and selections.

## 5. Shopping flow

### Browse and choose

**Home / Shop → quick product selection → Add to Bag → cart drawer → Order on WhatsApp.**

- Shop starts with products, not a large form block. Use category tabs, visible search, result count, and Filter / Sort controls.
- Put advanced filters in a contextual panel on desktop and a bottom sheet on mobile. Preserve category, price, colour, availability, and sorting, including a best-seller sort.
- Keep filters and search in the URL so Back, shared links, and closing an overlay preserve the browsing state.
- Product cards use concise display names, clear prices, and restrained availability/best-seller labels. Add a separate display-name field rather than changing established product URLs.
- Ready products without required selections can have direct Add to Bag. Products requiring choices use **Choose Options**, opening a quick-view dialog on desktop and a sheet on mobile.
- Reuse the same product-option form in quick view and the full product page. The full page remains available through the product name, image, and “View full details.” Direct product URLs continue to work.
- Restore a secondary image reveal on desktop and a clearly controlled image gallery on touch devices. Required actions must remain visible without hovering.

### Product page

- Show product name, price, availability, a concise description, and required selections as one coherent purchase block.
- Make the gallery easy to swipe on mobile and offer image enlargement. Keep key product information close to the first image.
- Use labelled colour swatches, clear option prices, a personalization field where relevant, and useful size/material information.
- Give available products **Add to Bag** as the primary action and **Order on WhatsApp** as the direct single-product action.
- Add a mobile sticky bar showing the selected price and Add to Bag. It uses the same validation and focuses the first incomplete required field.
- Put care, materials, delivery, and replacement details in compact accordions. Keep them readable and keyboard-accessible.
- Sold-out products retain a clear status and **Ask About Restock** action. Made-to-order products retain their preparation information.

### Cart drawer

Preserve the right-hand drawer from the reference and the existing multi-item functionality.

- Header: **Your Bag**, item count, close control.
- Scrollable items: photo, concise product name, selected colour/options/personalisation, editable quantity, line total, remove, and an option-edit action.
- Edit Options opens within the same drawer context, using the shared product form. Identical configurations merge quantities; distinct configurations remain separate.
- A stable footer shows **Product Total**, one charges note, and the primary **Order on WhatsApp** button.
- Price breakdown and the Instagram alternative remain secondary and expandable.
- Close via X, Escape, backdrop, and Continue Shopping. Preserve page, scroll, filters, and selections.
- Keep native modal accessibility, focus containment/restoration, scroll locking, browser persistence, and stale-product/option checks.
- The message preview stays within the drawer, with a clear Back to Bag action.

### WhatsApp handoff

1. Customer selects products and reviews the bag.
2. **Order on WhatsApp** immediately opens the official click-to-chat link containing all selected products, options, personalisation, quantities, links, and Product Total.
3. Customer sends the prepared message in WhatsApp.
4. The owner confirms availability, customisation, shipping, final amount, preparation time, and advance-payment details.

Keep the bag after opening WhatsApp. Offer Reopen WhatsApp and Copy Order Details if the app does not open. Do not show a paid or confirmed-order success state merely because a link was opened. Website language should be direct and commercial without adding an unrequested payment checkout or order-tracking system.

## 6. Exact wording and price rules

Apply this across visible text, screen-reader labels, messages, empty states, errors, and relevant documentation—not just one button.

| Current wording | Planned wording |
| --- | --- |
| Estimated product subtotal | **Product Total** |
| Product subtotal | **Product Total** |
| Your enquiry bag | **Your Bag** |
| Add to enquiry bag | **Add to Bag** |
| Enquire on WhatsApp | **Order on WhatsApp** |
| Preview enquiry message | **View Order Details** |
| Copy summary for Instagram | **Copy Order Details** |
| Continue browsing | **Continue Shopping** |
| Choose your details | **Choose Options** |
| Find your happy | **Shop Gifts** or **Search products**, depending on context |
| A little favourite | **Bestseller**, only when flagged by the owner |
| Custom enquiry / consultation form | **Custom Order Request** |

Fixed-price example:

> Product Total — ₹597  
> Delivery charges confirmed on WhatsApp.  
> **Order on WhatsApp**

Variable-price example:

> Product Total — From ₹597  
> Customisation and delivery charges confirmed on WhatsApp.  
> **Order on WhatsApp**

Rules:

- The label is always **Product Total**. Put “From” with the amount when a quote is required.
- Explicitly distinguish fixed products from custom starting prices in owner data. Do not infer that every product with a variant must have a starting price.
- Model known option charges as structured numeric price adjustments. A displayed “+₹250” option must change its line total and Product Total. Do not parse marketing labels as the source of prices.
- Unknown bespoke costs remain clearly indicated starting amounts. Shipping is not silently added, assumed free, or displayed as zero.
- Product Total includes all selected quantities. Preserve accurate currency arithmetic and quantity validation.
- Use a concise order message such as “Hi, I’d like to place an order with The Pookie Craft Co.” followed by the item details and Product Total. Close with “Please confirm delivery charges and the final amount.”
- Keep the owner’s real WhatsApp number in central configuration. The current sample number remains unsuitable for launch; the business number is required to test the real handoff.

## 7. Motion direction

Use the existing **framer-motion** dependency for component animation. First establish a strong static composition; the motion prototype then adds continuity and tactile character.

| Moment | Motion proposal | Purpose / constraint |
| --- | --- | --- |
| Hero | Headline lines reveal over roughly 450–600 ms; product and material detail settle through a small translation/rotation. | Introduce the product without delaying its visibility or primary CTA. Avoid an entrance loader. |
| Studio motif | One original wire-to-petal SVG gesture, with a restrained scroll-linked transformation if useful. | Create a recognisable craft signature. |
| Product interaction | Small image zoom/secondary-image transition, 160–220 ms; modest button press feedback. | Make exploration tactile while keeping the grid stable. |
| Quick view / filters | Backdrop fade with a short panel transition; approximately 220–300 ms. | Preserve where the customer is shopping. |
| Add to Bag | Brief button confirmation, bag-count update, then drawer entrance. | One coherent confirmation rather than several competing effects. |
| Cart drawer | Approximately 280–340 ms controlled spring entrance and 180–240 ms exit. | Keep the modal and focus lock active until exit completes. |
| Quantity / removal | Short price crossfade and 140–180 ms list reflow. | Show exactly what changed without a distracting counter animation. |
| Section entrance | Occasional 12–20 px reveals, once per section. | Establish pacing; avoid making every line animate. |

Implementation notes:

- Use Motion variants, layout animation, AnimatePresence, and reduced-motion support through the installed compatible API. Verify actual installed APIs rather than copying an incompatible new-package example.
- Keep home/catalog data server-rendered and put animation in small client components.
- Prefer transforms and opacity. Keep essential content visible if animation is unavailable.
- Respect reduced-motion settings. Provide equivalent tap/focus behavior to hover effects.
- Use GSAP/ScrollTrigger only if the studio-process prototype genuinely needs a coordinated scroll timeline that is awkward in the existing Motion implementation. Add it for that isolated section after measuring cost and need; do not install it merely to increase animation volume.
- Preserve normal scrolling, immediate shopping controls, and browser Back behavior. Avoid scroll hijacking, custom cursors, perpetual card movement, and animations that hide order information.

Primary references: [Motion animation](https://motion.dev/docs/react-animation), [Motion accessibility](https://motion.dev/docs/react-accessibility), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## 8. Delivery plan

| Stage | Work | Reviewable output / exit condition |
| --- | --- | --- |
| 1. Direction and content | Confirm visual tokens, headline/CTA system, photography inventory, product display names, and price rules. | A desktop/mobile art-direction board and copy/pricing specification using actual products. |
| 2. Core shopping prototype | Design one hero, one product card, quick-view/option form, full product purchase block, and cart drawer. | A reviewable flow from product discovery to a prepared WhatsApp order, including fixed and variable prices. |
| 3. Storefront implementation | Apply the approved system to Home, Shop, product pages, navigation, filters, drawer, and custom orders. | Complete responsive shopping flow; existing owner/admin/catalog capabilities preserved. |
| 4. Motion | Implement the interaction transitions and one signature studio moment; decide whether GSAP is necessary. | Motion review on mobile and desktop, including reduced-motion behavior. |
| 5. Verification and polish | Validate copy, prices/options, keyboard operation, drawer lifecycle, image quality, search/filter state, and the WhatsApp handoff. | Tested preview and documented remaining launch dependencies before any production deployment. |

Build the product/card/drawer prototype before redesigning every supporting page. That establishes the shopping language and visual system before they are repeated across the site.

### Code touchpoints

- `src/app/page.tsx`: homepage composition and narrative hierarchy.
- `src/app/globals.css`: replace the accumulated presentation overrides with deliberate tokens and component styles during implementation.
- `src/components/layout/Navbar.tsx`, `Footer.tsx`: concise navigation, search, shopping language, and utility hierarchy.
- `src/components/shop/ProductCard.tsx`, `ShopCatalog.tsx`: image quality, direct actions, compact discovery, and URL-backed filters.
- Shared product option form and a new contextual quick-view component; preserve `src/app/product/[slug]` canonical pages.
- `src/components/bag/BagDrawer.tsx`, `BagContents.tsx`: retained drawer behavior, clear totals/actions, option editing, and coordinated enter/exit transitions.
- `src/lib/bag.ts`, `enquiry.ts`: compatible pricing calculations and order-message language. Internal filenames can be migrated separately when useful; customer-facing wording is the first priority.
- `src/types/index.ts`, catalog validation, owner product editor: explicit price modes and structured option charges.
- `src/app/custom-orders/page.tsx` and supporting pages: consistent typography and direct ordering language while preserving secure submissions and business policies.

## 9. Acceptance criteria

- Existing multi-item bag, selection identity, quantities, persistence, availability checks, catalog filters, owner administration, custom requests, and policy links continue to work.
- The primary shopping flow uses a drawer/quick view and does not introduce a separate cart checkout page.
- No customer-facing “enquiry” labels or “Estimated product subtotal” remain in the shopping flow. The visible total label is exactly **Product Total**.
- Fixed and variable-price products produce correct item totals and Product Total. Known selected extras affect the displayed and WhatsApp amounts identically.
- Order on WhatsApp opens one complete, correctly encoded order message with the selected options and current product links. It does not claim the owner has already confirmed the order.
- The shop’s first viewport includes a visible product row at representative desktop sizes and starts showing actual products without a large filter form dominating a phone screen.
- Product actions, prices, and availability remain readable without hover. Mobile sticky controls do not obscure inputs or browser-safe areas.
- Check at 360/390 px, tablet, and wide desktop sizes; keyboard and touch interactions, zoom, long product names, empty results, and missing/changed products are covered.
- Drawer close, Escape, backdrop, focus restoration, preview, option editing, and animation exit lifecycle pass regression checks.
- Motion preserves reduced-motion behavior and does not make buying dependent on an animation finishing.
- Measure Lighthouse and layout stability against the current implementation, then improve bottlenecks. Use the original specification’s Core Web Vitals targets as launch goals rather than claiming unmeasured performance.
- No fabricated testimonials, stock information, delivery promises, discounts, or payment confirmations are introduced.

## 10. Branch and scope note

The branch was created from the current `main` checkout with its existing uncommitted implementation preserved. This planning pass adds this document only; it does not stage or commit the earlier application edits, install animation dependencies, change current customer wording, or deploy anything. The Product Total / Order on WhatsApp changes are explicit requirements for the redesign implementation.
