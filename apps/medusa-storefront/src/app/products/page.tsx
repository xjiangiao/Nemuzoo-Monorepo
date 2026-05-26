"use client";

import { useQuery } from "@tanstack/react-query";
import medusaClient from "@/lib/medusa-client";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string;
  images?: Array<{ url: string; alt?: string }>;
  variants?: Array<{
    calculated_price?: {
      calculated_amount?: number | null;
      currency_code?: string | null;
    } | null;
    prices?: Array<{ amount: number; currency_code: string }>;
  }> | null;
  metadata?: Record<string, unknown> | null;
}

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
      <SectionHeading
        title="All Dolls"
        subtitle="Every Nemuzoo companion is waiting for a home. Find yours."
      />

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
