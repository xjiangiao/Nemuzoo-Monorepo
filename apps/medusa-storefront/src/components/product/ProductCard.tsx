import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { formatPrice, getProductThumbnail, getProductPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

/**
 * Renders a clickable product tile that links to the product's page and displays a square thumbnail, title, optional personality badge, and optional formatted price.
 *
 * @param product - Product data containing at least `id`, `title`, and `handle`. May include `thumbnail`, `images`, `variants`, `metadata`, and optional pricing fields; if `metadata.personality` is a string it will be shown as a badge.
 * @returns A JSX element representing the product card linked to `/products/[handle]`.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const thumbnail = getProductThumbnail(product);
  const price = getProductPrice(product);
  const personality =
    typeof product.metadata?.personality === "string"
      ? product.metadata.personality
      : null;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div className="aspect-square bg-surface-secondary rounded-xl overflow-hidden mb-4 relative">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3
            className="text-base lg:text-lg font-medium text-text-primary font-heading"
          >
            {product.title}
          </h3>
          {personality && (
            <Badge variant="warm">{personality}</Badge>
          )}
        </div>
        {price && (
          <p className="text-sm text-text-secondary">
            {formatPrice(price.amount, price.currency_code)}
          </p>
        )}
      </div>
    </Link>
  );
}
