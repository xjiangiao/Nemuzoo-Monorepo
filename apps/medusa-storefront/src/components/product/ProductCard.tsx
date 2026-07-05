import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/media/ProductImage";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { formatPrice, getProductThumbnail, getProductPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

/**
 * Renders a clickable product tile that links to the product's page and displays a square thumbnail, title, optional product note badge, and optional formatted price.
 *
 * @param product - Product data containing at least `id`, `title`, and `handle`. May include `thumbnail`, `images`, `variants`, `metadata`, and optional pricing fields; if `metadata.product_note` or legacy `metadata.personality` is a string it will be shown as a badge.
 * @returns A JSX element representing the product card linked to `/products/[handle]`.
 */
export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const thumbnail = getProductThumbnail(product);
  const price = getProductPrice(product);
  const productNote =
    typeof product.metadata?.product_note === "string"
      ? product.metadata.product_note
      : typeof product.metadata?.personality === "string"
      ? product.metadata.personality
      : null;

  return (
    <SurfaceCard
      href={`/products/${product.handle}`}
      className="group block p-4"
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-[1.5rem] bg-surface-secondary">
        {thumbnail ? (
          <ProductImage
            src={thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            transformation={[
              { width: 800, height: 800, crop: "maintain_ratio" },
              { quality: 85, format: "auto" },
            ]}
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="paper-grain flex h-full w-full items-center justify-center bg-surface-muted text-text-muted">
            No Image
          </div>
        )}
      </div>

      <div className="relative px-2 pb-1 pt-1">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="font-heading text-xl font-black text-text-primary"
          >
            {product.title}
          </h3>
          {price && (
            <p className="shrink-0 text-sm font-medium text-text-secondary">
              {formatPrice(price.amount, price.currency_code)}
            </p>
          )}
        </div>
        {productNote && (
          <div className="mt-3">
            <Badge variant="warm">{productNote}</Badge>
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}
