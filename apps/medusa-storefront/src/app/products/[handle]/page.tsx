"use client";

import { useQuery } from "@tanstack/react-query";
import medusaClient from "@/lib/medusa-client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const { products } = await medusaClient.products.list({
        handle,
      });
      return products[0] || null;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-zinc-100 animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-zinc-100 animate-pulse rounded w-3/4" />
            <div className="h-6 bg-zinc-100 animate-pulse rounded w-1/4" />
            <div className="h-24 bg-zinc-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">
          Product Not Found
        </h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const variant = product.variants?.[0];
  const price = variant?.prices?.[0];
  const formattedPrice = price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency_code || "USD",
      }).format((price.amount || 0) / 100)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900 mb-8 inline-block"
      >
        &larr; Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-zinc-900">
            {product.title}
          </h1>
          {formattedPrice && (
            <p className="text-2xl text-zinc-900">{formattedPrice}</p>
          )}
          {product.description && (
            <p className="text-zinc-600 leading-relaxed">
              {product.description}
            </p>
          )}
          <button
            onClick={() => {
              setAddedToCart(true);
              setTimeout(() => setAddedToCart(false), 2000);
            }}
            className="w-full bg-zinc-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            {addedToCart ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
