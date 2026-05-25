"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/ui/QuantitySelector";
import StarDecoration from "@/components/ui/StarDecoration";
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: {
    title: string;
    description?: string;
    variants?: Array<{
      id: string;
      title: string;
      prices?: Array<{ amount: number; currency_code: string }>;
    }>;
    metadata?: Record<string, string>;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const personality = product.metadata?.personality;
  const story = product.metadata?.story;
  const price = product.variants?.[0]?.prices?.[0];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="space-y-6">
      {personality && (
        <Badge variant="warm" size="md">
          {personality}
        </Badge>
      )}

      <h1
        className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {product.title}
      </h1>

      {price && (
        <p className="text-xl font-medium text-[var(--color-text-primary)]">
          {formatPrice(price.amount, price.currency_code)}
        </p>
      )}

      {product.description && (
        <p className="text-base text-[var(--color-text-secondary)] leading-relaxed"
           style={{ fontWeight: 300 }}>
          {product.description}
        </p>
      )}

      {story && (
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">
            <StarDecoration size="sm" />
            The Story
          </summary>
          <p className="mt-3 pl-6 text-sm text-[var(--color-text-secondary)] leading-relaxed"
             style={{ fontWeight: 300 }}>
            {story}
          </p>
        </details>
      )}

      <div className="border-t border-[var(--color-border-primary)] pt-6 space-y-4">
        {product.variants && product.variants.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Variant
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <Button
            variant="accent"
            size="lg"
            onClick={handleAddToCart}
            className="flex-1 sm:flex-none"
          >
            {addedToCart ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
