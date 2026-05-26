"use client";

import Link from "next/link";
import Image from "next/image";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    quantity: number;
    unit_price: number;
    currency_code: string;
    variant?: { title: string };
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

/**
 * Render a cart line item with thumbnail, product link, variant (if any), line total, quantity controls, and a remove action.
 *
 * @param item - Cart line item containing identifiers (`id`, `handle`), display data (`title`, optional `thumbnail`, optional `variant.title`), and pricing/quantity (`quantity`, `unit_price`, `currency_code`).
 * @param onUpdateQuantity - Called with `(id, quantity)` when the item's quantity changes.
 * @param onRemove - Called with `(id)` when the item is removed.
 * @returns The React element representing the cart line item.
 */
export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 py-6 border-b border-border-primary">
      <Link
        href={`/products/${item.handle}`}
        className="shrink-0 w-24 h-24 bg-surface-secondary rounded-lg overflow-hidden relative"
      >
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
            No Image
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <Link
              href={`/products/${item.handle}`}
              className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
            >
              {item.title}
            </Link>
            {item.variant && (
              <p className="text-xs text-text-muted mt-0.5">
                {item.variant?.title}
              </p>
            )}
          </div>
          <p className="text-sm font-medium text-text-primary ml-4">
            {formatPrice(item.unit_price * item.quantity, item.currency_code)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => onUpdateQuantity(item.id, qty)}
          />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-xs text-text-muted hover:text-error transition-colors ml-4 py-1"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
