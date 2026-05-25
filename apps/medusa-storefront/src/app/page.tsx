"use client";

import { useQuery } from "@tanstack/react-query";
import medusaClient from "@/lib/medusa-client";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string;
  variants?: Array<{
    prices?: Array<{ amount: number; currency_code: string }>;
  }>;
}

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      medusaClient.products.list().then((res) => res.products as Product[]),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 mb-4">
          Nemuzoo
        </h1>
        <p className="text-lg text-zinc-500 max-w-lg mx-auto">
          Discover quality products curated just for you.
        </p>
      </section>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-zinc-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load products.</p>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No products available yet.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((product: Product) => {
            const price =
              product.variants?.[0]?.prices?.[0];
            const formattedPrice = price
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: price.currency_code || "USD",
                }).format((price.amount || 0) / 100)
              : null;

            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group"
              >
                <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden mb-3">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-zinc-900">
                  {product.title}
                </h3>
                {formattedPrice && (
                  <p className="text-sm text-zinc-500 mt-1">{formattedPrice}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
