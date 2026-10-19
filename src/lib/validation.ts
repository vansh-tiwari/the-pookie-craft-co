import type { Catalog } from "./catalog-types";
export function validImage(value: string) {
  return (
    typeof value === "string" &&
    ((/^\/images\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes("..")) ||
      /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value))
  );
}
export function validateCatalog(c: Catalog) {
  if (
    !c ||
    !Number.isSafeInteger(c.version) ||
    c.version < 0 ||
    !Array.isArray(c.products) ||
    !Array.isArray(c.categories) ||
    !Array.isArray(c.reviews) ||
    !c.home
  )
    throw new Error("Invalid catalog.");
  if (
    c.products.length > 200 ||
    c.categories.length > 40 ||
    c.reviews.length > 100
  )
    throw new Error("Catalog limit exceeded.");
  const required = (s: unknown, max = 500) =>
    typeof s === "string" && !!s.trim() && s.length <= max;
  if (
    !required(c.home.title, 200) ||
    !required(c.home.subtitle, 1000) ||
    !required(c.home.story, 3000) ||
    !validImage(c.home.image)
  )
    throw new Error("Complete homepage text and choose an image.");
  const ids = new Set<string>(),
    names = new Set<string>();
  for (const cat of c.categories) {
    if (
      !required(cat.id) ||
      ids.has(cat.id) ||
      !required(cat.name, 80) ||
      names.has(cat.name) ||
      !validImage(cat.image) ||
      typeof cat.description !== "string" ||
      cat.description.length > 1000
    )
      throw new Error("Categories need unique names, IDs, and valid images.");
    ids.add(cat.id);
    names.add(cat.name);
  }
  const slugs = new Set<string>();
  ids.clear();
  for (const p of c.products) {
    if (
      !required(p.id) ||
      ids.has(p.id) ||
      !required(p.name, 200) ||
      !required(p.description, 5000) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) ||
      p.slug.length > 150 ||
      slugs.has(p.slug) ||
      !Number.isFinite(p.price) ||
      p.price < 0 ||
      p.price > 1000000 ||
      !names.has(p.category) ||
      !Array.isArray(p.images) ||
      !p.images.length ||
      p.images.length > 8 ||
      !p.images.every(validImage) ||
      !validImage(p.image_url) ||
      !["Available", "Sold Out", "Made to Order"].includes(
        p.availability || "Available",
      )
    )
      throw new Error(
        "Products need unique URLs, valid prices, categories, availability, and 1–8 images.",
      );
    for (const flag of [
      p.startingPrice,
      p.featured,
      p.bestseller,
      p.personalizationRequired,
      p.in_stock,
    ])
      if (flag !== undefined && typeof flag !== "boolean")
        throw new Error("Invalid product setting.");
    if (
      p.categories &&
      (!Array.isArray(p.categories) || !p.categories.every((x) => names.has(x)))
    )
      throw new Error("Unknown product category.");
    if (
      p.colors &&
      (!Array.isArray(p.colors) ||
        p.colors.length > 30 ||
        !p.colors.every(
          (x) => required(x.name, 80) && /^#[0-9a-fA-F]{6}$/.test(x.hex),
        ))
    )
      throw new Error("Invalid color options.");
    if (
      p.variants &&
      (!Array.isArray(p.variants) ||
        p.variants.length > 10 ||
        !p.variants.every(
          (v) =>
            required(v.name, 100) &&
            Array.isArray(v.options) &&
            v.options.length > 0 &&
            v.options.length < 30 &&
            v.options.every((o) => required(o, 200)),
        ))
    )
      throw new Error("Invalid product options.");
    for (const field of [p.dimensions, p.material, p.leadTime])
      if (field !== undefined && !required(field, 500))
        throw new Error("Product details must be under 500 characters.");
    slugs.add(p.slug);
    ids.add(p.id);
  }
  ids.clear();
  for (const r of c.reviews) {
    if (
      !required(r.id) ||
      ids.has(r.id) ||
      !required(r.author, 100) ||
      !required(r.quote, 2000) ||
      typeof r.published !== "boolean" ||
      typeof r.permission !== "boolean" ||
      (r.published && !r.permission)
    )
      throw new Error(
        "Published reviews require permission and completed author and quote fields.",
      );
    ids.add(r.id);
  }
}
