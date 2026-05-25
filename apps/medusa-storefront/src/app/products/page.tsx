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
    prices?: Array<{ amount: number; currency_code: string }>;
  }>;
  metadata?: Record<string, string>;
}

export default function ProductsPage() {
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      medusaClient.products
        .list()
        .then((res) => (res.products as Product[]) || []),
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
