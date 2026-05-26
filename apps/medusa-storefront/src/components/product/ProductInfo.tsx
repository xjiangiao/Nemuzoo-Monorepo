"use client";

import { useState, useRef, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/ui/QuantitySelector";
import StarDecoration from "@/components/ui/StarDecoration";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart/store";

interface ProductInfoProps {
  product: {
    id: string;
    title: string;
    description?: string | null;
    variants?: Array<{
      id: string;
      title: string | null;
      calculated_price?: {
        calculated_amount?: number | null;
        currency_code?: string | null;
      } | null;
      prices?: Array<{ amount: number; currency_code: string }>;
    }> | null;
    metadata?: Record<string, unknown> | null;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addError, setAddError] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => clearTimeout(addedTimeoutRef.current);
  }, []);

  const variants = product.variants || [];
  const selectedVariant = variants[selectedVariantIndex];
  const calculatedPrice = selectedVariant?.calculated_price;
  const price =
    typeof calculatedPrice?.calculated_amount === "number" &&
    calculatedPrice.currency_code
      ? {
          amount: calculatedPrice.calculated_amount,
          currency_code: calculatedPrice.currency_code,
        }
      : selectedVariant?.prices?.[0];
  const personality =
    typeof product.metadata?.personality === "string"
      ? product.metadata.personality
      : null;
  const story =
    typeof product.metadata?.story === "string" ? product.metadata.story : null;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setAddError(false);
    try {
      await addToCart(selectedVariant.id, quantity);
      setAddedToCart(true);
      setQuantity(1);
      addedTimeoutRef.current = setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      setAddError(true);
    }
  };

  return (
    <div className="space-y-6">
      {personality && (
        <Badge variant="warm" size="md">
          {personality}
        </Badge>
      )}

      <h1
        className="text-3xl lg:text-4xl font-bold text-text-primary font-heading"
      >
        {product.title}
      </h1>

      {price && (
        <p className="text-xl font-medium text-text-primary">
          {formatPrice(price.amount, price.currency_code)}
        </p>
      )}

      {product.description && (
        <p className="text-base text-text-secondary leading-relaxed"
           style={{ fontWeight: 300 }}>
          {product.description}
        </p>
      )}

      {story && (
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            <StarDecoration size="sm" />
            The Story
          </summary>
          <p className="mt-3 pl-6 text-sm text-text-secondary leading-relaxed"
             style={{ fontWeight: 300 }}>
            {story}
          </p>
        </details>
      )}

      <div className="border-t border-border-primary pt-6 space-y-4">
        {variants.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Variant
            </label>
            <div className="flex flex-wrap gap-2">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantIndex(i)}
                  className={`px-5 py-2.5 md:px-4 md:py-2 text-sm rounded-lg border transition-colors ${
                    i === selectedVariantIndex
                      ? "border-accent text-accent bg-accent-subtle"
                      : "border-border-primary text-text-secondary hover:border-accent hover:text-text-primary"
                  }`}
                >
                  {v.title || "Default"}
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
            disabled={!selectedVariant}
            className="flex-1 sm:flex-none"
          >
            {addedToCart ? "Added!" : "Add to Cart"}
          </Button>
        </div>

        {addError && (
          <p className="text-sm text-error">
            Could not add to cart. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
