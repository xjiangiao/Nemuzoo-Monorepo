"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CartIcon from "@/components/cart/CartIcon";
import AccountIcon from "@/components/auth/AccountIcon";
import { Menu } from "lucide-react";

/**
 * Renders a responsive, sticky top navigation header with a brand link, desktop navigation links, account and cart icons, and a mobile menu.
 *
 * @returns The header element containing navigation links, account and cart icons, and a mobile menu.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-primary bg-surface-primary/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Nemuzoo home">
          <Image
            src="/nemuzoo-wordmark.svg"
            alt="nemuzoo"
            width={188}
            height={28}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Story
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
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
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu
              size={22}
              className={`transition-transform duration-200 ease-out ${
                menuOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
        </div>
      </div>

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
