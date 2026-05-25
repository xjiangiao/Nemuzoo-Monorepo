import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  total: number;
  currency_code: string;
}

export default function CartSummary({
  subtotal,
  shipping,
  total,
  currency_code,
}: CartSummaryProps) {
  return (
    <div className="bg-[var(--color-surface-elevated)] rounded-xl p-6 border border-[var(--color-border-primary)]">
      <h3
        className="text-lg font-medium text-[var(--color-text-primary)] mb-4"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-secondary)]">Subtotal</span>
          <span className="text-[var(--color-text-primary)] font-medium">
            {formatPrice(subtotal, currency_code)}
          </span>
        </div>

        {shipping != null && (
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Shipping</span>
            <span className="text-[var(--color-text-primary)] font-medium">
              {shipping === 0 ? "Free" : formatPrice(shipping, currency_code)}
            </span>
          </div>
        )}

        <div className="border-t border-[var(--color-border-primary)] pt-3 flex justify-between">
          <span className="text-[var(--color-text-primary)] font-medium">Total</span>
          <span
            className="text-lg font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {formatPrice(total, currency_code)}
          </span>
        </div>
      </div>

      <Button variant="accent" size="lg" href="/checkout" className="w-full mt-6">
        Proceed to Checkout
      </Button>
    </div>
  );
}
