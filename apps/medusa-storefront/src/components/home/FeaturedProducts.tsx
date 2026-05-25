"use client";

import { useQuery } from "@tanstack/react-query";
import medusaClient from "@/lib/medusa-client";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import SkeletonCard from "@/components/ui/SkeletonCard";
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

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      medusaClient.products.list().then((res) => (res.products as Product[]) || []),
  });

  const featured = products?.slice(0, 4) || [];

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="Meet Your Nighttime Companions"
          subtitle="Each doll has a name, a personality, and a quiet story waiting for you."
        />

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!isLoading && featured.length > 0 && (
          <ProductGrid products={featured} columns={4} />
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" href="/products">
            View All Dolls &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
