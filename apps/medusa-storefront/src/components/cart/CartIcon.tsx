"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";

export default function CartIcon({ className = "" }: { className?: string }) {
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <Link
      href="/cart"
      className={`relative inline-flex h-10 w-10 items-center justify-center text-text-secondary transition-colors hover:text-text-primary ${className}`}
      aria-label={`View cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
    >
      <ShoppingBag size={20} />

      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center bg-warm text-text-inverse text-[10px] font-bold rounded-full">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
