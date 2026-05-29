"use client";

import { useQuery } from "@tanstack/react-query";
import medusaClient from "@/lib/medusa-client";
import type { Product } from "@/types";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import SkeletonCard from "@/components/ui/SkeletonCard";
import Button from "@/components/ui/Button";

/**
 * Renders a featured-products section that fetches products and displays up to four highlighted items.
 *
 * The section includes a heading, a responsive grid of loading skeletons while products are being fetched,
 * the featured product grid when items are available, and a centered "View All Dolls" button linking to `/products`.
 *
 * @returns A React element containing the featured products section with loading and empty-state behavior.
 */
export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      medusaClient.store.product
        .list()
        .then((res) => (res.products as unknown as Product[]) || []),
  });

  const featured = products?.slice(0, 4) || [];

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="The first plush drop"
          subtitle="Each companion is soft, collectible, and calm enough to live beautifully in grown-up spaces."
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
            View all plush &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
