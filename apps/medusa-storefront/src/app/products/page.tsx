"use client";

import { useQuery } from "@tanstack/react-query";
import medusaClient from "@/lib/medusa-client";
import type { Product } from "@/types";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

/**
 * Renders the "All Dolls" products page with loading, error, empty, and populated states.
 *
 * Shows a skeleton grid while loading, an error state with a retry action when loading fails,
 * a no-results empty state when the product list is empty, and a product grid when products are available.
 *
 * @returns The page element that displays the products listing and its UI states.
 */
export default function ProductsPage() {
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      medusaClient.store.product
        .list()
        .then((res) => (res.products as unknown as Product[]) || []),
  });

  return (
    <Container className="py-16 lg:py-20">
      <div className="mb-10 grid gap-8 border-b border-border-primary pb-10 lg:grid-cols-[0.7fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
            shop
          </p>
          <h1 className="mt-4 font-heading text-5xl font-black leading-tight text-text-primary sm:text-6xl">
            Find the plush that fits your day.
          </h1>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-text-secondary lg:pt-10">
          Browse soft companions for bedtime comfort, desk company, gifting, and carry-along calm. Free US shipping on orders over $75.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          title="Failed to load dolls"
          description="Please try again later."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {!isLoading && !error && products && products.length === 0 && (
        <EmptyState
          title="No dolls available yet"
          description="Our companions are being crafted. Check back soon."
        />
      )}

      {!isLoading && !error && products && products.length > 0 && (
        <ProductGrid products={products} />
      )}
    </Container>
  );
}
