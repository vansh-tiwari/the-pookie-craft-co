"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { Product } from "@/types";
import { useBag } from "@/context/BagContext";
import { BagContents } from "./BagContents";

export function BagDrawer({ initialProducts }: { initialProducts: Product[] }) {
  const { isOpen, closeBag, count, ready } = useBag();
  const dialog = useRef<HTMLDialogElement>(null);
  const [products, setProducts] = useState(initialProducts);
  const [catalogReady, setCatalogReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    setCatalogReady(false);
    setError("");
    fetch("/api/catalog", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!Array.isArray(data.products)) throw new Error();
        if (!controller.signal.aborted) {
          setProducts(data.products);
          setCatalogReady(true);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "We couldn’t refresh current prices and availability. Try again before sending your enquiry.",
          );
      });
    return () => controller.abort();
  }, [isOpen, attempt]);
  useEffect(() => {
    const modal = dialog.current;
    if (!modal || !isOpen) return;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    return () => {
      modal.close();
      document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [isOpen]);
  return (
    <dialog
      ref={dialog}
      id="bag-drawer-dialog"
      className="bag-drawer-dialog"
      aria-labelledby="bag-drawer-title"
      onCancel={(event) => {
        event.preventDefault();
        closeBag();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeBag();
      }}
    >
      <div className="bag-drawer-panel">
        <header className="bag-drawer-header">
          <div>
            <h2 id="bag-drawer-title">Your Bag</h2>
            <p>
              {ready && count
                ? `${count} ${count === 1 ? "piece" : "pieces"} in your bag`
                : "Handcrafted pieces ready to order"}
            </p>
          </div>
          <button
            type="button"
            className="bag-drawer-close"
            onClick={closeBag}
            aria-label="Close bag"
            autoFocus
          >
            <X size={22} />
          </button>
        </header>
        {isOpen && (
          <>
            <div className="bag-drawer-status" aria-live="polite">
              {error ? (
                <p role="alert">
                  {error}{" "}
                  <button
                    type="button"
                    onClick={() => setAttempt((n) => n + 1)}
                  >
                    Try again
                  </button>
                </p>
              ) : !catalogReady ? (
                <p>Refreshing prices and availability…</p>
              ) : null}
            </div>
            <BagContents
              products={products}
              presentation="drawer"
              catalogReady={catalogReady}
            />
            <button type="button" className="bag-continue" onClick={closeBag}>
              ← Continue browsing
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}

// Old /bag bookmarks open the same drawer over the shop instead of a separate bag page.
export function BagRouteOpener() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { openBag } = useBag();
  useEffect(() => {
    if (params.get("bag") !== "open") return;
    openBag();
    const next = new URLSearchParams(params.toString());
    next.delete("bag");
    router.replace(pathname + (next.size ? `?${next}` : ""), { scroll: false });
  }, [params, pathname, router, openBag]);
  return null;
}
