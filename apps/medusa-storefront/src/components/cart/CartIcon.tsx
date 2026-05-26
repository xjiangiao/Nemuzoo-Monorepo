"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/context";

export default function CartIcon({ className = "" }: { className?: string }) {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors ${className}`}
      aria-label={`View cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center bg-[var(--color-warm)] text-[var(--color-text-inverse)] text-[10px] font-bold rounded-full">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
