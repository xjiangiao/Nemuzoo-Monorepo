"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CartIcon from "@/components/cart/CartIcon";
import AccountIcon from "@/components/auth/AccountIcon";
import { Menu, X } from "lucide-react";

/**
 * Renders a responsive, sticky top navigation header with a brand link, desktop navigation links, account and cart icons, and a toggleable mobile menu.
 *
 * The component maintains internal `menuOpen` state to control the mobile menu visibility. On medium and larger screens the desktop navigation is shown; on smaller screens a toggle button opens a mobile menu containing the same navigation links. Mobile menu links close the menu when clicked. ARIA attributes on the toggle reflect the menu state.
 *
 * @returns The header element containing navigation links, account and cart icons, and a conditionally rendered mobile menu.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-border-primary bg-surface-primary/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Nemuzoo home"
        >
          <Image
            src="/nemuzoo-wordmark.svg"
            alt="nemuzoo"
            width={188}
            height={28}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Story
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Care
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <AccountIcon />
          <CartIcon />
          <button
            type="button"
            className="rounded-full border border-border-primary bg-surface-elevated p-2 text-text-secondary transition-colors hover:text-text-primary md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-nav"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-10 md:hidden">
          <nav
            id="mobile-site-nav"
            className="mobile-menu-panel mx-4 mt-3 space-y-1 rounded-[2rem] border border-border-primary bg-surface-primary/95 p-3 shadow-xl backdrop-blur-xl"
          >
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            >
              Shop
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            >
              Story
            </Link>
            <Link
              href="/faq"
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            >
              Care
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
