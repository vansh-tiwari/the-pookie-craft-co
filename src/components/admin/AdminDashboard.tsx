"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Catalog, Category, Review } from "@/lib/catalog-types";
import { availability } from "@/lib/catalog-types";
import type { Product } from "@/types";
import type { CustomRequest } from "@/lib/requests";
import { ProductCard } from "@/components/shop/ProductCard";
import { validateCatalog } from "@/lib/validation";
const uid = () => crypto.randomUUID();
const emptyProduct = (category: string): Product => ({
  id: uid(),
  slug: "",
  name: "",
  description: "",
  price: 0,
  category,
  images: [],
  image_url: "",
  availability: "Made to Order",
  startingPrice: true,
  created_at: new Date().toISOString(),
  colors: [],
  variants: [],
});
function ImageUpload({
  onImages,
  multiple = false,
}: {
  onImages: (images: string[]) => void;
  multiple?: boolean;
}) {
  const [error, setError] = useState("");
  return (
    <div>
      <label className="upload-label">
        Upload {multiple ? "photos" : "image"} (JPG, PNG, WebP, max 350 KB each)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={async (e) => {
            setError("");
            try {
              const files = Array.from(e.target.files || []);
              if (files.length > 8) throw new Error("Choose at most 8 photos.");
              const values = await Promise.all(
                files.map(async (f) => {
                  if (
                    f.size > 350000 ||
                    !["image/jpeg", "image/png", "image/webp"].includes(f.type)
                  )
                    throw new Error(
                      "Use JPG, PNG, or WebP images under 350 KB each.",
                    );
                  return await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result));
                    reader.onerror = () =>
                      reject(new Error("Image could not be read."));
                    reader.readAsDataURL(f);
                  });
                }),
              );
              onImages(values);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Upload failed.");
            }
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
export function AdminDashboard({
  initial,
  initialRequests,
}: {
  initial: Catalog;
  initialRequests: CustomRequest[];
}) {
  const router = useRouter();
  const [catalog, setCatalog] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [tab, setTab] = useState("Products");
  const [product, setProduct] = useState<Product | null>(null);
  const [requests, setRequests] = useState(initialRequests);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const dirty = JSON.stringify(catalog) !== saved;
  const [editorDirty, setEditorDirty] = useState(false);
  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      if (dirty || editorDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [dirty, editorDirty]);
  function update(next: Catalog) {
    setCatalog(next);
    setNotice("");
  }
  function patchProduct(next: Partial<Product>) {
    setProduct((p) => (p ? { ...p, ...next } : p));
    setEditorDirty(true);
  }
  function leaveEditor() {
    if (editorDirty && !confirm("Discard this unsaved product edit?"))
      return false;
    setProduct(null);
    setEditorDirty(false);
    return true;
  }
  async function publish() {
    setBusy(true);
    setNotice("");
    try {
      const r = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catalog),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setCatalog(d);
      setSaved(JSON.stringify(d));
      setNotice("Published. Your storefront now uses these changes.");
      router.refresh();
    } catch (e) {
      setNotice(
        e instanceof Error
          ? e.message
          : "Publishing failed. Your edits remain here.",
      );
    } finally {
      setBusy(false);
    }
  }
  function move<T>(items: T[], i: number, d: number) {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= items.length) return next;
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  }
  function exportBackup() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(catalog, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `pookie-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function reload() {
    if (
      (dirty || editorDirty) &&
      !confirm("Discard all unsaved changes and load published content?")
    )
      return;
    try {
      const r = await fetch("/api/admin/content");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setCatalog(d);
      setSaved(JSON.stringify(d));
      setProduct(null);
      setEditorDirty(false);
      setNotice("Published content loaded.");
    } catch {
      setNotice("Could not reload. Your draft is unchanged.");
    }
  }
  const textField = (
    label: string,
    value: string,
    onChange: (s: string) => void,
    required = false,
  ) => (
    <label>
      {label}
      {required ? " *" : ""}
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
  return (
    <div className="section-wrap admin-wrap">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">THE POOKIE CRAFT CO. / OWNER STUDIO</p>
          <h1>A little room to create.</h1>
        </div>
        <button
          className="text-link"
          onClick={async () => {
            if (
              (dirty || editorDirty) &&
              !confirm("Sign out and discard unsaved changes?")
            )
              return;
            const r = await fetch("/api/admin/session", { method: "DELETE" });
            if (r.ok) router.refresh();
            else setNotice("Sign out failed. Please try again.");
          }}
        >
          Sign out
        </button>
      </div>
      <div className="admin-toolbar">
        <p aria-live="polite">
          {dirty || editorDirty ? "● Unsaved changes" : "✓ All changes saved"}
        </p>
        <button onClick={reload}>Reload published</button>
        <a href="/" target="_blank" rel="noreferrer">
          View storefront ↗
        </a>
        <button onClick={exportBackup}>Download content backup</button>
        <label className="import-button">
          Restore backup
          <input
            type="file"
            accept="application/json"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                if (f.size > 4 * 1024 * 1024) throw new Error();
                const data = JSON.parse(await f.text());
                validateCatalog({ ...data, version: catalog.version });
                if (
                  !Array.isArray(data.products) ||
                  !Array.isArray(data.categories) ||
                  !Array.isArray(data.reviews) ||
                  !data.home
                )
                  throw new Error();
                if (
                  !confirm(
                    "Load this backup into your draft? Review it before publishing.",
                  )
                )
                  return;
                setCatalog({ ...data, version: catalog.version });
                setProduct(null);
                setEditorDirty(false);
                setNotice(
                  "Backup loaded into draft. Review before publishing.",
                );
              } catch {
                setNotice(
                  "Invalid backup. Choose a content backup under 4 MB.",
                );
              }
              e.target.value = "";
            }}
          />
        </label>
        <button
          className="pill-button"
          disabled={!dirty || busy || editorDirty}
          onClick={publish}
        >
          {busy ? "Publishing…" : "Publish changes"}
        </button>
      </div>
      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}
      <div
        className="admin-tabs"
        role="navigation"
        aria-label="Studio sections"
      >
        {[
          "Products",
          "Categories",
          "Homepage",
          "Reviews",
          "Custom requests",
        ].map((t) => (
          <button
            aria-pressed={tab === t}
            key={t}
            onClick={() => {
              if (leaveEditor()) setTab(t);
            }}
          >
            {t}
            {t === "Custom requests" ? ` (${requests.length})` : ""}
          </button>
        ))}
      </div>
      {tab === "Products" && (
        <>
          <div className="section-heading">
            <h2>Your handmade collection</h2>
            <button
              className="pill-button"
              onClick={() => {
                if (leaveEditor()) {
                  setProduct(emptyProduct(catalog.categories[0]?.name || ""));
                  setPreview(false);
                }
              }}
            >
              + Add product
            </button>
          </div>
          <p className="small-note">
            Order here controls featured and best-seller order. Changes become
            public when you publish.
          </p>
          {product ? (
            <form
              className="editor-panel stack-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!product.images.length) {
                  setNotice("Add at least one product image.");
                  return;
                }
                if (
                  catalog.products.some(
                    (p) => p.id !== product.id && p.slug === product.slug,
                  )
                ) {
                  setNotice("Choose a unique product URL.");
                  return;
                }
                update({
                  ...catalog,
                  products: catalog.products.some((p) => p.id === product.id)
                    ? catalog.products.map((p) =>
                        p.id === product.id ? product : p,
                      )
                    : [...catalog.products, product],
                });
                setProduct(null);
                setEditorDirty(false);
              }}
            >
              <h2>
                {catalog.products.some((p) => p.id === product.id)
                  ? "Edit your little creation"
                  : "A new little creation"}
              </h2>
              <div className="form-grid">
                {textField(
                  "Product name",
                  product.name,
                  (v) => patchProduct({ name: v }),
                  true,
                )}
                <label>
                  Product URL *
                  <input
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    maxLength={150}
                    value={product.slug}
                    onChange={(e) => patchProduct({ slug: e.target.value })}
                  />
                  <small>
                    Changing this URL breaks previously shared product links.
                  </small>
                </label>
                <label>
                  Price (₹) *
                  <input
                    type="number"
                    min="0"
                    max="1000000"
                    step="0.01"
                    required
                    value={product.price}
                    onChange={(e) =>
                      patchProduct({ price: e.target.valueAsNumber })
                    }
                  />
                </label>
                <label>
                  Main category
                  <select
                    value={product.category}
                    onChange={(e) => patchProduct({ category: e.target.value })}
                  >
                    {catalog.categories.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Availability
                  <select
                    value={availability(product)}
                    onChange={(e) =>
                      patchProduct({
                        availability: e.target.value as Product["availability"],
                        in_stock: e.target.value !== "Sold Out",
                      })
                    }
                  >
                    {["Available", "Sold Out", "Made to Order"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                {textField("Size / dimensions", product.dimensions || "", (v) =>
                  patchProduct({ dimensions: v || undefined }),
                )}
                {textField("Materials", product.material || "", (v) =>
                  patchProduct({ material: v || undefined }),
                )}
              </div>
              <fieldset>
                <legend>Additional categories</legend>
                <div className="check-row">
                  {catalog.categories
                    .filter((c) => c.name !== product.category)
                    .map((c) => (
                      <label key={c.id}>
                        <input
                          type="checkbox"
                          checked={
                            product.categories?.includes(c.name) || false
                          }
                          onChange={(e) =>
                            patchProduct({
                              categories: e.target.checked
                                ? [...(product.categories || []), c.name]
                                : product.categories?.filter(
                                    (x) => x !== c.name,
                                  ),
                            })
                          }
                        />
                        {c.name}
                      </label>
                    ))}
                </div>
              </fieldset>
              <label>
                Description *
                <textarea
                  required
                  maxLength={5000}
                  rows={4}
                  value={product.description}
                  onChange={(e) =>
                    patchProduct({ description: e.target.value })
                  }
                />
              </label>
              <div className="check-row">
                {(
                  [
                    ["startingPrice", "Starting price (final quote varies)"],
                    ["featured", "Featured on homepage"],
                    ["bestseller", "Best seller"],
                    ["personalizationRequired", "Personalization is required"],
                  ] as const
                ).map(([k, label]) => (
                  <label key={k}>
                    <input
                      type="checkbox"
                      checked={!!product[k]}
                      onChange={(e) => patchProduct({ [k]: e.target.checked })}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <h3>Product photos</h3>
              <div className="admin-images">
                {product.images.map((src, i) => (
                  <div key={i}>
                    <img src={src} alt={`Product photo ${i + 1}`} />
                    <button
                      type="button"
                      onClick={() =>
                        patchProduct({
                          images: product.images.filter((_, j) => i !== j),
                          image_url:
                            product.images.filter((_, j) => i !== j)[0] || "",
                        })
                      }
                    >
                      Remove {i + 1}
                    </button>
                  </div>
                ))}
              </div>
              <p className="small-note">
                The first photo is the cover. Remove and re-add photos to change
                their order.
              </p>
              <ImageUpload
                multiple
                onImages={(images) => {
                  const all = [...product.images, ...images].slice(0, 8);
                  patchProduct({ images: all, image_url: all[0] || "" });
                }}
              />
              <fieldset>
                <legend>Available colours</legend>
                {product.colors?.map((c, i) => (
                  <div className="inline-editor" key={i}>
                    <input
                      aria-label={`Colour ${i + 1} name`}
                      required
                      value={c.name}
                      onChange={(e) =>
                        patchProduct({
                          colors: product.colors?.map((x, j) =>
                            j === i ? { ...x, name: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <input
                      aria-label={`Colour ${i + 1} swatch`}
                      type="color"
                      value={c.hex}
                      onChange={(e) =>
                        patchProduct({
                          colors: product.colors?.map((x, j) =>
                            j === i ? { ...x, hex: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        patchProduct({
                          colors: product.colors?.filter((_, j) => j !== i),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    patchProduct({
                      colors: [
                        ...(product.colors || []),
                        { name: "", hex: "#eeabc4" },
                      ],
                    })
                  }
                >
                  + Add colour
                </button>
              </fieldset>
              <fieldset>
                <legend>Product options</legend>
                {product.variants?.map((v, i) => (
                  <div key={i} className="inline-editor">
                    <input
                      required
                      aria-label="Option name"
                      placeholder="Option name, e.g. Size"
                      value={v.name}
                      onChange={(e) =>
                        patchProduct({
                          variants: product.variants?.map((x, j) =>
                            j === i ? { ...x, name: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <input
                      required
                      aria-label="Option choices, separated by commas"
                      placeholder="Choices, separated by commas"
                      value={v.options.join(",")}
                      onChange={(e) =>
                        patchProduct({
                          variants: product.variants?.map((x, j) =>
                            j === i
                              ? { ...x, options: e.target.value.split(",") }
                              : x,
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        patchProduct({
                          variants: product.variants?.filter((_, j) => j !== i),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    patchProduct({
                      variants: [
                        ...(product.variants || []),
                        { name: "", options: [] },
                      ],
                    })
                  }
                >
                  + Add option
                </button>
              </fieldset>
              <div className="button-row">
                <button className="pill-button">Save product to draft</button>
                <button type="button" onClick={() => setPreview(!preview)}>
                  Preview card
                </button>
                <button type="button" onClick={leaveEditor}>
                  Cancel
                </button>
              </div>
              {preview && product.image_url && (
                <div className="draft-preview">
                  <p>Draft preview — links open published content</p>
                  <ProductCard product={product} />
                  <p>{product.description}</p>
                </div>
              )}
            </form>
          ) : (
            <div className="admin-product-list">
              {catalog.products.map((p, i) => (
                <div key={p.id}>
                  <img src={p.image_url} alt="" />
                  <div>
                    <strong>{p.name}</strong>
                    <p>
                      {p.category} · ₹{p.price} · {availability(p)}
                    </p>
                    <small>
                      {p.featured ? "Featured · " : ""}
                      {p.bestseller ? "Best seller" : ""}
                    </small>
                  </div>
                  <button
                    aria-label={`Move ${p.name} up`}
                    disabled={i === 0}
                    onClick={() =>
                      update({
                        ...catalog,
                        products: move(catalog.products, i, -1),
                      })
                    }
                  >
                    ↑
                  </button>
                  <button
                    aria-label={`Move ${p.name} down`}
                    disabled={i === catalog.products.length - 1}
                    onClick={() =>
                      update({
                        ...catalog,
                        products: move(catalog.products, i, 1),
                      })
                    }
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => {
                      setProduct(structuredClone(p));
                      setPreview(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Delete “${p.name}”? Publish to apply this deletion.`,
                        )
                      )
                        update({
                          ...catalog,
                          products: catalog.products.filter(
                            (x) => x.id !== p.id,
                          ),
                        });
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {tab === "Categories" && (
        <div className="stack-form">
          <div className="section-heading">
            <h2>Your categories</h2>
            <button
              onClick={() =>
                update({
                  ...catalog,
                  categories: [
                    ...catalog.categories,
                    {
                      id: uid(),
                      name: "New category",
                      description: "",
                      image: "/images/products/sunflower_bouquet.jpg",
                    },
                  ],
                })
              }
            >
              + Add category
            </button>
          </div>
          {catalog.categories.map((c, i) => {
            const patch = (next: Partial<Category>) => {
              const name = next.name ?? c.name;
              update({
                ...catalog,
                categories: catalog.categories.map((x) =>
                  x.id === c.id ? { ...x, ...next } : x,
                ),
                products: catalog.products.map((p) => ({
                  ...p,
                  category: p.category === c.name ? name : p.category,
                  categories: p.categories?.map((x) =>
                    x === c.name ? name : x,
                  ),
                })),
              });
            };
            return (
              <div className="editor-panel stack-form" key={c.id}>
                {textField(
                  "Category name",
                  c.name,
                  (name) => patch({ name }),
                  true,
                )}
                {textField("Description", c.description, (description) =>
                  patch({ description }),
                )}
                <ImageUpload
                  onImages={(images) => {
                    if (images[0]) patch({ image: images[0] });
                  }}
                />
                <div className="button-row">
                  <button
                    disabled={i === 0}
                    onClick={() =>
                      update({
                        ...catalog,
                        categories: move(catalog.categories, i, -1),
                      })
                    }
                  >
                    Move up
                  </button>
                  <button
                    disabled={i === catalog.categories.length - 1}
                    onClick={() =>
                      update({
                        ...catalog,
                        categories: move(catalog.categories, i, 1),
                      })
                    }
                  >
                    Move down
                  </button>
                  <button
                    onClick={() => {
                      if (
                        catalog.products.some(
                          (p) =>
                            p.category === c.name ||
                            p.categories?.includes(c.name),
                        )
                      ) {
                        setNotice(
                          "Reassign products using this category before deleting it.",
                        );
                        return;
                      }
                      if (confirm(`Delete category “${c.name}”?`))
                        update({
                          ...catalog,
                          categories: catalog.categories.filter(
                            (x) => x.id !== c.id,
                          ),
                        });
                    }}
                  >
                    Delete category
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {tab === "Homepage" && (
        <div className="editor-panel stack-form">
          <h2>A warm little welcome</h2>
          <label>
            Hero headline
            <textarea
              value={catalog.home.title}
              onChange={(e) =>
                update({
                  ...catalog,
                  home: { ...catalog.home, title: e.target.value },
                })
              }
            />
          </label>
          <label>
            Hero introduction
            <textarea
              value={catalog.home.subtitle}
              onChange={(e) =>
                update({
                  ...catalog,
                  home: { ...catalog.home, subtitle: e.target.value },
                })
              }
            />
          </label>
          <ImageUpload
            onImages={(images) => {
              if (images[0])
                update({
                  ...catalog,
                  home: { ...catalog.home, image: images[0] },
                });
            }}
          />
          <label>
            Brand story
            <textarea
              rows={5}
              value={catalog.home.story}
              onChange={(e) =>
                update({
                  ...catalog,
                  home: { ...catalog.home, story: e.target.value },
                })
              }
            />
          </label>
          <p>
            Use Featured and Best seller checkboxes on products to select
            homepage pieces. Move products up or down to change their order. Up
            to four appear in each section; availability is always shown.
          </p>
          <div className="draft-preview">
            <p>Draft headline preview</p>
            <h2>{catalog.home.title}</h2>
            <p>{catalog.home.subtitle}</p>
            <img src={catalog.home.image} alt="Draft banner" />
          </div>
        </div>
      )}
      {tab === "Reviews" && (
        <div className="stack-form">
          <div className="section-heading">
            <h2>Kind words, with permission</h2>
            <button
              onClick={() =>
                update({
                  ...catalog,
                  reviews: [
                    ...catalog.reviews,
                    {
                      id: uid(),
                      author: "",
                      quote: "",
                      published: false,
                      permission: false,
                    },
                  ],
                })
              }
            >
              + Add review
            </button>
          </div>
          <p>
            Only add genuine customer feedback. Confirm permission before
            publishing. Reviews remain hidden unless both boxes are checked.
          </p>
          {catalog.reviews.map((r) => {
            const patch = (next: Partial<Review>) =>
              update({
                ...catalog,
                reviews: catalog.reviews.map((x) =>
                  x.id === r.id ? { ...x, ...next } : x,
                ),
              });
            return (
              <div className="editor-panel stack-form" key={r.id}>
                {textField(
                  "Customer display name",
                  r.author,
                  (author) => patch({ author }),
                  true,
                )}
                <label>
                  Customer feedback
                  <textarea
                    value={r.quote}
                    onChange={(e) => patch({ quote: e.target.value })}
                  />
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={r.permission}
                    onChange={(e) =>
                      patch({
                        permission: e.target.checked,
                        published: e.target.checked ? r.published : false,
                      })
                    }
                  />
                  The customer has given permission to publish this genuine
                  feedback.
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={r.published}
                    disabled={!r.permission}
                    onChange={(e) => patch({ published: e.target.checked })}
                  />
                  Publish on homepage
                </label>
                <button
                  onClick={() => {
                    if (confirm("Delete this review?"))
                      update({
                        ...catalog,
                        reviews: catalog.reviews.filter((x) => x.id !== r.id),
                      });
                  }}
                >
                  Delete review
                </button>
              </div>
            );
          })}
        </div>
      )}
      {tab === "Custom requests" && (
        <div className="stack-form">
          <div className="section-heading">
            <h2>Your studio inbox</h2>
            <button
              onClick={async () => {
                try {
                  const r = await fetch("/api/admin/requests");
                  const d = await r.json();
                  if (!r.ok) throw new Error();
                  setRequests(d);
                  setNotice("Inbox refreshed.");
                } catch {
                  setNotice(
                    "Could not refresh requests. Please sign in again if your session expired.",
                  );
                }
              }}
            >
              Refresh requests
            </button>
          </div>
          <p className="small-note">
            These requests were saved by customers. Contact the customer to
            confirm all details. Delete personal information when it is no
            longer needed.
          </p>
          {!requests.length && (
            <div className="empty-state">
              <h3>No little ideas yet.</h3>
              <p>Submitted custom-order forms will appear here.</p>
            </div>
          )}
          {requests.map((r) => (
            <article key={r.id} className="editor-panel">
              <p className="eyebrow">
                {new Date(r.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}{" "}
                IST
              </p>
              <h3>{r.name}</h3>
              <p>{r.contact}</p>
              <dl>
                {[
                  ["Product idea", r.idea],
                  ["Colours", r.colors],
                  ["Budget", r.budget],
                  ["Personalized text / design", r.personalization],
                  ["Reference", r.id],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd className="whitespace-pre-wrap">{v}</dd>
                  </div>
                ))}
              </dl>
              <button
                onClick={async () => {
                  if (
                    !confirm(
                      "Permanently delete this request and its contact details?",
                    )
                  )
                    return;
                  try {
                    const response = await fetch("/api/admin/requests", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: r.id }),
                    });
                    if (!response.ok) throw new Error();
                    setRequests(requests.filter((x) => x.id !== r.id));
                  } catch {
                    setNotice("Request could not be deleted. Try again.");
                  }
                }}
              >
                Delete request
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
