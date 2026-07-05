"use client";

import { useQuery } from "@tanstack/react-query";
import medusaClient from "@/lib/medusa-client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SkeletonCard from "@/components/ui/SkeletonCard";
import Button from "@/components/ui/Button";

/**
 * Render a product detail page for the current route `handle`.
 *
 * Displays a loading skeleton while the product is being fetched, a centered "Not Found" view when no product exists for the handle, or the product detail layout (gallery and product info) on success.
 *
 * @returns A React element containing the product page UI (loading skeleton, not-found view, or product detail layout).
 */
export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const { products } = await medusaClient.store.product.list({
        handle,
      });
      return products[0] || null;
    },
  });

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <SkeletonCard className="md:col-span-1" />
          <div className="space-y-4">
            <div className="h-8 bg-surface-secondary animate-pulse rounded w-3/4" />
            <div className="h-6 bg-surface-secondary animate-pulse rounded w-1/4" />
            <div className="h-24 bg-surface-secondary animate-pulse rounded" />
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-24 text-center">
        <h1
          className="text-2xl font-bold text-text-primary mb-4 font-heading"
        >
          Not Found
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          This product is not in the catalog right now. Let us help you find another one.
        </p>
        <Button variant="warm" href="/products">
          Browse All Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <Link
        href="/products"
        className="inline-block text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
      >
        &larr; All Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery
          images={
            product.images?.length
              ? product.images.map((img: { url: string }) => ({
                  url: img.url,
                  alt: product.title,
                }))
              : product.thumbnail
              ? [{ url: product.thumbnail, alt: product.title }]
              : []
          }
          title={product.title}
        />

        <ProductInfo product={product} />
      </div>
    </Container>
  );
}
