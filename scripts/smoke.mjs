import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const password = randomBytes(24).toString("hex");
const salt = randomBytes(16).toString("hex");
const dir = await mkdtemp(join(tmpdir(), "pookie-test-"));
const base = "http://localhost:3101";
let output = "";
let passed = 0;
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "-p", "3101"],
  {
    cwd: resolve("."),
    env: {
      ...process.env,
      POOKIE_DATA_DIR: dir,
      NEXT_BUILD_DIR: ".next-test",
      CONTENT_REDIS_URL: "",
      CONTENT_REDIS_TOKEN: "",
      ADMIN_EMAIL: "owner@example.test",
      ADMIN_PASSWORD_HASH: `${salt}:${scryptSync(password, salt, 64).toString("hex")}`,
      ADMIN_SESSION_SECRET: randomBytes(32).toString("hex"),
      NEXT_PUBLIC_SITE_URL: base,
      NEXT_PUBLIC_WHATSAPP_NUMBER: "919999999999",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
child.stdout.on("data", (b) => {
  output = (output + b.toString()).slice(-12000);
});
child.stderr.on("data", (b) => {
  output = (output + b.toString()).slice(-12000);
});
let cookie = "";
async function request(
  path,
  method = "GET",
  data,
  authenticated = false,
  origin = base,
) {
  const response = await fetch(base + path, {
    method,
    headers: {
      ...(method !== "GET"
        ? { "Content-Type": "application/json", Origin: origin }
        : {}),
      ...(authenticated ? { Cookie: cookie } : {}),
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const body = await response.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {}
  return { response, body, json };
}
function check(name, fn) {
  fn();
  passed++;
  console.log(`✓ ${name}`);
}
async function loadTs(file, modules = {}) {
  const source = await readFile(file, "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", code)(
    (name) => {
      if (name in modules) return modules[name];
      throw new Error(`Unexpected module ${name}`);
    },
    module,
    module.exports,
  );
  return module.exports;
}
try {
  let ready = false;
  for (let n = 0; n < 40; n++) {
    if (child.exitCode !== null) break;
    try {
      const r = await fetch(base + "/api/admin/session", {
        signal: AbortSignal.timeout(1500),
      });
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  assert.ok(ready, "Test server did not start");
  const types = await loadTs("src/lib/catalog-types.ts");
  const config = {
    siteConfig: { siteUrl: base },
    whatsappLink: (message) =>
      `https://wa.me/919999999999?text=${encodeURIComponent(message)}`,
  };
  const enquiry = await loadTs("src/lib/enquiry.ts", {
    "./catalog-types": types,
    "@/config/site": config,
  });
  const sample = {
    id: "test",
    slug: "tiny-flower",
    name: "Tiny & lovely flower",
    price: 179,
    startingPrice: true,
    availability: "Available",
    colors: [{ name: "Pink", hex: "#eeaabb" }],
    variants: [{ name: "Arrangement", options: ["Single", "Trio"] }],
    personalizationRequired: true,
  };
  const choices = {
    color: "Pink",
    variants: { Arrangement: "Trio" },
    personalization: "Happy Birthday & ♡",
    quantity: 2,
  };
  const bag = await loadTs("src/lib/bag.ts", {
    "./enquiry": enquiry,
    "./catalog-types": types,
    "@/config/site": config,
  });
  const firstSelection = bag.createBagItem(sample, choices);
  const firstBag = bag.addBagItem([], firstSelection);
  const combinedBag = bag.addBagItem(firstBag, firstSelection);
  check(
    "Identical bag selections combine quantities without changing product choices",
    () => {
      assert.equal(combinedBag.length, 1);
      assert.equal(combinedBag[0].choices.quantity, 4);
      assert.equal(firstBag[0].choices.quantity, 2);
    },
  );
  const secondSelection = bag.createBagItem(sample, {
    ...choices,
    personalization: "A different little message",
  });
  const mixedSelections = bag.addBagItem(combinedBag, secondSelection);
  check(
    "Different personalization and options stay as separate bag lines",
    () => {
      assert.equal(mixedSelections.length, 2);
      const changedOption = bag.createBagItem(sample, {
        ...choices,
        variants: { Arrangement: "Single" },
      });
      assert.equal(bag.addBagItem(mixedSelections, changedOption).length, 3);
    },
  );
  check(
    "Adding to the bag validates required options and quantity limits",
    () => {
      assert.throws(() => bag.createBagItem(sample, { ...choices, color: "" }));
      assert.throws(() =>
        bag.createBagItem(sample, { ...choices, quantity: 0 }),
      );
      const full = bag.createBagItem(sample, { ...choices, quantity: 99 });
      assert.throws(() => bag.addBagItem([full], firstSelection));
    },
  );
  const fixedProduct = {
    ...sample,
    id: "fixed-product",
    slug: "fixed-gift",
    name: "Fixed-price gift",
    price: 100.25,
    startingPrice: false,
    personalizationRequired: false,
  };
  const fixedSelection = bag.createBagItem(fixedProduct, {
    ...choices,
    quantity: 3,
    personalization: "",
  });
  const subtotalBag = bag.addBagItem(firstBag, fixedSelection);
  const totals = bag.bagTotals(subtotalBag, [sample, fixedProduct]);
  check(
    "Bag separates fixed prices from starting-price estimates without adding shipping",
    () => {
      assert.equal(totals.fixed, 300.75);
      assert.equal(totals.estimated, 358);
      assert.equal(totals.subtotal, 658.75);
      assert.equal(totals.needsQuote, true);
      assert.equal(totals.canEnquire, true);
    },
  );
  check(
    "Personalization on an otherwise fixed-price item is marked for a final quote",
    () => {
      const personalized = bag.createBagItem(fixedProduct, choices);
      assert.equal(
        bag.bagTotals([personalized], [fixedProduct]).needsQuote,
        true,
      );
    },
  );
  check(
    "Combined enquiry includes every selection, quantity, links, subtotal, and shipping caveat",
    () => {
      const message = bag.bagEnquiry(subtotalBag, [sample, fixedProduct]);
      for (const text of [
        sample.name,
        fixedProduct.name,
        "Quantity: 2",
        "Quantity: 3",
        "Happy Birthday & ♡",
        "₹658.75",
        "Shipping: to be confirmed",
        "/product/fixed-gift",
        "not a confirmed order",
      ])
        assert.ok(message.includes(text), text);
      assert.ok(
        bag
          .bagEnquiry(
            subtotalBag,
            [sample, fixedProduct],
            "https://preview.example.test",
          )
          .includes("https://preview.example.test/product/fixed-gift"),
      );
    },
  );
  check(
    "Bag restoration preserves selections and rejects malformed browser storage",
    () => {
      assert.deepEqual(
        bag.readBag(JSON.parse(JSON.stringify(subtotalBag))),
        subtotalBag,
      );
      assert.deepEqual(
        bag.readBag([
          { productId: "test", choices: { ...choices, quantity: -1 } },
        ]),
        [],
      );
      assert.deepEqual(bag.readBag({ items: [] }), []);
    },
  );
  check(
    "Deleted products or changed options block the combined enquiry",
    () => {
      assert.equal(bag.bagTotals(firstBag, []).canEnquire, false);
      assert.throws(() => bag.bagEnquiry(firstBag, []));
      assert.throws(() =>
        bag.bagEnquiry(firstBag, [
          { ...sample, colors: [{ name: "Blue", hex: "#0000ff" }] },
        ]),
      );
      assert.throws(() => bag.bagEnquiry([], [sample]));
    },
  );
  check("Sold-out bag selections explicitly request restocking", () => {
    assert.match(
      bag.bagEnquiry(firstBag, [{ ...sample, availability: "Sold Out" }]),
      /Sold Out — please confirm restocking/,
    );
  });
  check(
    "Bag subtotals use current catalog prices rather than persisted prices",
    () => {
      assert.equal(
        bag.bagTotals(firstBag, [{ ...sample, price: 200 }]).subtotal,
        400,
      );
    },
  );
  check(
    "Enquiry uses selected options, quantity, starting price, product URL, and encoding",
    () => {
      const url = enquiry.productEnquiryUrl(sample, choices);
      const message = new URL(url).searchParams.get("text");
      for (const value of [
        "Tiny & lovely flower",
        "From ₹179",
        "Pink",
        "Arrangement: Trio",
        "Happy Birthday & ♡",
        "Quantity: 2",
        `${base}/product/tiny-flower`,
      ])
        assert.ok(message.includes(value));
    },
  );
  check(
    "Enquiry rejects missing required colour, personalization, options, and invalid quantity",
    () => {
      for (const patch of [
        { color: "" },
        { personalization: " " },
        { variants: {} },
        { quantity: 0 },
        { quantity: 1.5 },
      ])
        assert.throws(() =>
          enquiry.productEnquiry(sample, { ...choices, ...patch }),
        );
    },
  );
  check("Sold-out enquiry asks about restocking", () =>
    assert.match(
      enquiry.productEnquiry({ ...sample, availability: "Sold Out" }, choices),
      /restocking or made-to-order/,
    ),
  );
  const unauth = await request("/api/admin/content", "PUT", {}, false);
  check("Anonymous writes are denied", () =>
    assert.equal(unauth.response.status, 401),
  );
  const privateInbox = await request("/api/admin/requests");
  check("Anonymous request reads are denied", () =>
    assert.equal(privateInbox.response.status, 401),
  );
  const cross = await request(
    "/api/admin/session",
    "POST",
    { email: "owner@example.test", password },
    false,
    "https://unrelated.example",
  );
  check("Cross-origin login is denied", () =>
    assert.equal(cross.response.status, 403),
  );
  const wrong = await request("/api/admin/session", "POST", {
    email: "owner@example.test",
    password: "wrong",
  });
  check("Wrong owner password is denied", () =>
    assert.equal(wrong.response.status, 401),
  );
  const login = await request("/api/admin/session", "POST", {
    email: "owner@example.test",
    password,
  });
  check("Owner can sign in with an HttpOnly SameSite cookie", () => {
    assert.equal(login.response.status, 200);
    const c = login.response.headers.get("set-cookie");
    assert.match(c, /HttpOnly/i);
    assert.match(c, /SameSite=strict/i);
    cookie = c.split(";")[0];
  });
  const content = await request("/api/admin/content", "GET", undefined, true);
  const catalog = content.json;
  check(
    "All seven categories and unpublished-review defaults are present",
    () => {
      assert.equal(catalog.categories.length, 7);
      assert.equal(catalog.reviews.length, 0);
      assert.equal(catalog.products.length, 9);
    },
  );
  const invalid = await request(
    "/api/admin/content",
    "PUT",
    { ...catalog, categories: [] },
    true,
  );
  check("Deleting an in-use category is rejected server-side", () =>
    assert.equal(invalid.response.status, 400),
  );
  const payload = {
    name: "Smoke Test Customer",
    contact: "customer@example.test",
    idea: "A custom flower",
    colors: "Lilac",
    budget: "₹500–700",
    personalization: "Best day ever",
    website: "",
  };
  const missing = await request("/api/custom-requests", "POST", {
    ...payload,
    budget: "",
  });
  check("Incomplete custom requests are rejected", () =>
    assert.equal(missing.response.status, 400),
  );
  const bot = await request("/api/custom-requests", "POST", {
    ...payload,
    website: "spam",
  });
  check("Honeypot submissions are rejected", () =>
    assert.equal(bot.response.status, 400),
  );
  const stored = await request("/api/custom-requests", "POST", payload);
  check("Valid custom request is saved before success is returned", () => {
    assert.equal(stored.response.status, 201);
    assert.ok(stored.json.id);
  });
  const inbox = await request("/api/admin/requests", "GET", undefined, true);
  check("Stored request is visible to the authenticated owner", () => {
    assert.equal(inbox.json.length, 1);
    assert.equal(inbox.json[0].contact, payload.contact);
  });
  const first = catalog.products[0];
  const next = {
    ...catalog,
    products: catalog.products.map((p, i) =>
      i ? p : { ...p, availability: "Sold Out", featured: false },
    ),
    reviews: [
      {
        id: "private-review",
        author: "Private Test Name",
        quote: "Unapproved private feedback",
        permission: false,
        published: false,
      },
    ],
  };
  const publish = await request("/api/admin/content", "PUT", next, true);
  check(
    "Authenticated publishing saves availability and homepage flags",
    () => {
      assert.equal(publish.response.status, 200);
      assert.equal(publish.json.version, 1);
    },
  );
  const stale = await request("/api/admin/content", "PUT", next, true);
  check("Stale edits cannot overwrite published changes", () => {
    assert.equal(stale.response.status, 400);
    assert.match(stale.json.error, /another tab/);
  });
  const fixture = {
    ...first,
    id: "test-product",
    slug: "test-only-custom-flower",
    name: "Test-only custom flower",
    category: "Test category",
    categories: [catalog.categories[0].name],
    images: [first.image_url, "/images/products/sunflower_bouquet.jpg"],
    availability: "Made to Order",
  };
  const created = await request(
    "/api/admin/content",
    "PUT",
    {
      ...publish.json,
      categories: [
        ...publish.json.categories,
        {
          id: "test-category",
          name: "Test category",
          description: "Test only",
          image: first.image_url,
        },
      ],
      products: [...publish.json.products, fixture],
    },
    true,
  );
  check(
    "Owner can create a category and a product with multiple photos and categories",
    () => {
      assert.equal(created.response.status, 200);
      assert.equal(created.json.products.at(-1).images.length, 2);
    },
  );
  const newPage = await request(`/product/${fixture.slug}`);
  check("Newly published product has a working shareable page", () => {
    assert.equal(newPage.response.status, 200);
    assert.ok(newPage.body.includes("Made to Order"));
  });
  const duplicate = await request(
    "/api/admin/content",
    "PUT",
    {
      ...created.json,
      products: [...created.json.products, { ...fixture, id: "different-id" }],
    },
    true,
  );
  check("Duplicate product URLs are rejected", () =>
    assert.equal(duplicate.response.status, 400),
  );
  const badReview = await request(
    "/api/admin/content",
    "PUT",
    {
      ...created.json,
      reviews: [
        {
          id: "test-review",
          author: "Test-only customer",
          quote: "Test-only feedback",
          permission: false,
          published: true,
        },
      ],
    },
    true,
  );
  check("Reviews cannot publish without recorded permission", () =>
    assert.equal(badReview.response.status, 400),
  );
  const edited = await request(
    "/api/admin/content",
    "PUT",
    {
      ...created.json,
      categories: created.json.categories.map((c) =>
        c.id === "test-category" ? { ...c, name: "Renamed test category" } : c,
      ),
      products: created.json.products.map((p) =>
        p.id === fixture.id
          ? { ...p, category: "Renamed test category", price: 345 }
          : p,
      ),
      reviews: [
        ...created.json.reviews,
        {
          id: "test-review",
          author: "Test-only customer",
          quote: "Test-only feedback",
          permission: true,
          published: true,
        },
      ],
    },
    true,
  );
  check("Owner can edit product pricing and category assignments", () => {
    assert.equal(edited.response.status, 200);
    assert.equal(edited.json.products.at(-1).price, 345);
    assert.equal(edited.json.products.at(-1).category, "Renamed test category");
  });
  const visibleReview = await request("/");
  check("Permission-approved published reviews appear on the homepage", () =>
    assert.ok(visibleReview.body.includes("Test-only feedback")),
  );
  const updatedSitemap = await request("/sitemap.xml");
  check("Sitemap updates after publishing new products", () =>
    assert.ok(updatedSitemap.body.includes(fixture.slug)),
  );
  const removedContent = await request(
    "/api/admin/content",
    "PUT",
    { ...publish.json, version: edited.json.version },
    true,
  );
  const removedPage = await request(`/product/${fixture.slug}`);
  check("Owner can delete products, unused categories, and reviews", () => {
    assert.equal(removedContent.response.status, 200);
    assert.equal(removedPage.response.status, 404);
    assert.ok(
      !removedContent.json.categories.some((c) => c.id === "test-category"),
    );
  });
  const crossWrite = await request(
    "/api/admin/content",
    "PUT",
    publish.json,
    true,
    "https://unrelated.example",
  );
  check("Cross-origin authenticated writes are denied", () =>
    assert.equal(crossWrite.response.status, 401),
  );
  const publicCatalog = await request("/api/catalog");
  check(
    "Public catalog does not reveal unpublished reviews or request contacts",
    () => {
      assert.ok(!publicCatalog.body.includes("Private Test Name"));
      assert.ok(!publicCatalog.body.includes(payload.contact));
    },
  );
  const detail = await request(`/product/${first.slug}`);
  check(
    "Product route reflects published availability and structured product data",
    () => {
      assert.equal(detail.response.status, 200);
      assert.ok(detail.body.includes("Sold Out"));
      assert.ok(detail.body.includes("application/ld+json"));
    },
  );
  const sitemap = await request("/sitemap.xml");
  check("Sitemap uses configured domain and current product slugs", () =>
    assert.ok(sitemap.body.includes(`${base}/product/${first.slug}`)),
  );
  for (const path of [
    "/",
    "/shop",
    "/bag",
    "/story",
    "/contact",
    "/custom-orders",
    "/faq",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    "/robots.txt",
  ]) {
    const result = await request(path);
    assert.equal(result.response.status, 200, path);
  }
  check("Every required public page responds successfully", () => {});
  const legacyBag = await request("/bag");
  check(
    "Old bag URLs open the shop drawer instead of a separate bag page",
    () => {
      assert.equal(legacyBag.response.url, `${base}/shop?bag=open`);
    },
  );
  const storefront = await request("/");
  check(
    "Storefront exposes a modal bag trigger and drawer without a bag-page link",
    () => {
      assert.ok(storefront.body.includes('id="enquiry-bag-dialog"'));
      assert.ok(storefront.body.includes('aria-haspopup="dialog"'));
      assert.ok(!storefront.body.includes('href="/bag"'));
    },
  );
  const checkout = await request("/api/create-order", "POST", {});
  check("Legacy online checkout is disabled", () =>
    assert.equal(checkout.response.status, 410),
  );
  const remove = await request(
    "/api/admin/requests",
    "DELETE",
    { id: stored.json.id },
    true,
  );
  check("Owner can delete stored request data", () =>
    assert.equal(remove.response.status, 200),
  );
  const remaining = await request(
    "/api/admin/requests",
    "GET",
    undefined,
    true,
  );
  assert.equal(remaining.json.length, 0);
  await request("/api/admin/session", "DELETE", undefined, true);
  cookie = "";
  const denied = await request("/api/admin/content");
  check("Logout returns protected reads to anonymous denial", () =>
    assert.equal(denied.response.status, 401),
  );
  console.log(
    `\n${passed} checks passed. Temporary request data is removed on exit.`,
  );
} catch (e) {
  console.error(e);
  console.error(output.replaceAll(password, "[redacted]"));
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
  await new Promise((resolve) => {
    child.once("exit", resolve);
    setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 5000).unref();
  });
  await rm(dir, { recursive: true, force: true });
}
