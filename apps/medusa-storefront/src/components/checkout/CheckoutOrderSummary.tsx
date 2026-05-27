import {
  getShippingOptionAmount,
  type ShippingOption,
} from "@/lib/checkout/store";
import { formatPrice } from "@/lib/utils";

type CheckoutOrderSummaryProps = {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    total?: number;
  }>;
  subtotal: number;
  taxTotal: number;
  cartTotal?: number;
  hasShippingMethod: boolean;
  selectedShippingOption?: ShippingOption;
  shippingTotal: number;
  currencyCode: string;
  error?: string | null;
};

export default function CheckoutOrderSummary({
  items,
  subtotal,
  taxTotal,
  cartTotal,
  hasShippingMethod,
  selectedShippingOption,
  shippingTotal,
  currencyCode,
  error,
}: CheckoutOrderSummaryProps) {
  const shippingPreview = selectedShippingOption
    ? getShippingOptionAmount(selectedShippingOption)
    : shippingTotal;
  const total = hasShippingMethod
    ? cartTotal ?? subtotal + shippingPreview + taxTotal
    : subtotal + shippingPreview + taxTotal;

  return (
    <aside className="h-fit rounded-xl border border-border-primary bg-surface-elevated p-6">
      <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
        Order Summary
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 text-sm">
            <span className="text-text-secondary">
              {item.title} x {item.quantity}
            </span>
            <span className="font-medium text-text-primary">
              {formatPrice(item.total || 0, currencyCode)}
            </span>
          </div>
        ))}
        <div className="space-y-2 border-t border-border-primary pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Subtotal</span>
            <span>{formatPrice(subtotal, currencyCode)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Shipping</span>
            <span>{formatPrice(shippingPreview, currencyCode)}</span>
          </div>
          {!!taxTotal && (
            <div className="flex justify-between">
              <span className="text-text-secondary">Tax</span>
              <span>{formatPrice(taxTotal, currencyCode)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border-primary pt-3 text-base font-semibold text-text-primary">
            <span>Total</span>
            <span>{formatPrice(total, currencyCode)}</span>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}
    </aside>
  );
}
