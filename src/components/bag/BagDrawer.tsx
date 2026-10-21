"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "@/types";
import { useBag } from "@/context/BagContext";
import { BagContents } from "./BagContents";

export function BagDrawer({ initialProducts }: { initialProducts: Product[] }) {
  const { isOpen, closeBag, count, ready } = useBag();
  const [products, setProducts] = useState(initialProducts);
  const [catalogReady, setCatalogReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBag();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeBag]);

  // Refresh prices and availability on drawer open
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

  return (
    <>
      <div id="enquiry-bag-dialog" className="sr-only" aria-hidden="true" />
      <AnimatePresence>
        {isOpen && (
          <div
            id="bag-drawer-dialog"
            className="fixed inset-0 z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-drawer-title"
          >
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeBag}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            />

            {/* Right Slide-Over Panel with Swipe-to-Dismiss Gesture */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                drag="x"
                dragConstraints={{ left: 0 }}
                dragElastic={{ right: 0.3 }}
                onDragEnd={(_e, { offset, velocity }) => {
                  if (offset.x > 80 || velocity.x > 400) closeBag();
                }}
                className="w-screen max-w-md bg-[#FCFBF9] border-l border-[#E8E2D8] shadow-2xl flex flex-col justify-between h-full overflow-hidden"
              >
                {/* Header (Fixed Top) */}
                <div className="p-4 sm:p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF7F2] flex-shrink-0">
                  <div>
                    <span className="eyebrow !mb-0 text-[9.5px]">Studio Atelier</span>
                    <h2
                      id="bag-drawer-title"
                      className="font-serif text-2xl font-normal text-[#1C281F]"
                    >
                      Your Bag
                    </h2>
                    <p className="text-[11px] text-[#667264] font-sans">
                      {ready && count
                        ? `${count} ${count === 1 ? "piece" : "pieces"} selected`
                        : "Handcrafted pieces ready to order"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeBag}
                    className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-[#1C281F] hover:bg-[#FAF7F2] flex items-center justify-center transition-colors shadow-xs"
                    aria-label="Close bag"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Status Message */}
                <div className="px-5 pt-2 empty:hidden flex-shrink-0" aria-live="polite">
                  {error ? (
                    <p
                      className="text-xs text-rose-700 bg-rose-50 p-2 rounded-[2px]"
                      role="alert"
                    >
                      {error}{" "}
                      <button
                        type="button"
                        onClick={() => setAttempt((n) => n + 1)}
                        className="underline font-semibold ml-1"
                      >
                        Try again
                      </button>
                    </p>
                  ) : !catalogReady ? (
                    <p className="text-[10.5px] text-[#667264] font-sans">
                      Confirming studio availability…
                    </p>
                  ) : null}
                </div>

                {/* Main Content Area (Items list scrolls, summary stays pinned at bottom) */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  <BagContents
                    products={products}
                    presentation="drawer"
                    catalogReady={catalogReady}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
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
