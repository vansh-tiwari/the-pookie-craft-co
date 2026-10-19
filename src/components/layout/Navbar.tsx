"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import { useBag } from "@/context/BagContext";
import type { Category } from "@/lib/catalog-types";
export function Navbar({ categories }: { categories: Category[] }) {
  const path = usePathname();
  const { count, ready, isOpen, openBag } = useBag();
  const [open, setOpen] = useState(false);
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    setOpen(false);
    if (details.current) details.current.open = false;
  }, [path]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <Image
            src="/images/instagram/logo.jpg"
            alt=""
            width={48}
            height={48}
            className="rounded-full"
          />
          <span>
            The Pookie
            <br />
            <small>CRAFT CO.</small>
          </span>
        </Link>
        <button
          className="mobile-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-nav"
          aria-label="Main navigation"
          className={open ? "main-nav is-open" : "main-nav"}
        >
          <Link href="/" aria-current={path === "/" ? "page" : undefined}>
            Home
          </Link>
          <details
            ref={details}
            onKeyDown={(e) => {
              if (e.key === "Escape") e.currentTarget.open = false;
            }}
          >
            <summary>
              Shop <ChevronDown size={14} />
            </summary>
            <div className="category-menu">
              <Link
                href="/shop"
                onClick={() => {
                  setOpen(false);
                  if (details.current) details.current.open = false;
                }}
              >
                All products
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${encodeURIComponent(c.name)}`}
                  onClick={() => {
                    setOpen(false);
                    if (details.current) details.current.open = false;
                  }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/story">About us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/custom-orders" className="nav-cta">
            Make it personal ↗
          </Link>
        </nav>
        <button
          type="button"
          onClick={openBag}
          className="bag-trigger"
          aria-label={`Enquiry bag, ${ready ? count : 0} pieces`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="enquiry-bag-dialog"
        >
          <ShoppingBag size={21} aria-hidden="true" />
          <span className="bag-trigger-label">Bag</span>
          <span className="bag-count" aria-hidden="true">
            {ready ? count : 0}
          </span>
        </button>
      </div>
    </header>
  );
}
