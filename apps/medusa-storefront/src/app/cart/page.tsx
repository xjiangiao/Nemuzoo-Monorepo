"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Shopping Cart</h1>

      <div className="text-center py-24">
        <p className="text-zinc-500 mb-4">Your cart is empty.</p>
        <Link
          href="/"
          className="text-blue-600 hover:underline font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
