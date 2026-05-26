"use client";

import Link from "next/link";
import CartIcon from "@/components/cart/CartIcon";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-surface-primary/80 border-b border-border-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-bold text-text-primary font-heading"
        >
          Nemuzoo
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
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
