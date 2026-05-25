import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { formatPrice, getProductThumbnail, getProductPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    images?: Array<{ url: string; alt?: string }>;
    variants?: Array<{
      prices?: Array<{ amount: number; currency_code: string }>;
    }>;
    metadata?: Record<string, string>;
  };
  priority?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const thumbnail = getProductThumbnail(product);
  const price = getProductPrice(product);
  const personality = product.metadata?.personality;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div className="aspect-square bg-[var(--color-surface-secondary)] rounded-xl overflow-hidden mb-4 relative">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3
            className="text-base lg:text-lg font-medium text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.title}
          </h3>
          {personality && (
            <Badge variant="warm">{personality}</Badge>
          )}
        </div>
        {price && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {formatPrice(price.amount, price.currency_code)}
          </p>
        )}
      </div>
    </Link>
  );
}
