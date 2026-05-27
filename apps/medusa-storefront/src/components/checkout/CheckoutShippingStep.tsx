"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  getShippingOptionAmount,
  useCheckoutStore,
} from "@/lib/checkout/store";
import { formatPrice } from "@/lib/utils";

type CheckoutShippingStepProps = {
  currencyCode: string;
};

export default function CheckoutShippingStep({
  currencyCode,
}: CheckoutShippingStepProps) {
  const shippingOptions = useCheckoutStore((s) => s.shippingOptions);
  const selectedShippingOptionId = useCheckoutStore(
    (s) => s.selectedShippingOptionId
  );
  const setSelectedShippingOptionId = useCheckoutStore(
    (s) => s.setSelectedShippingOptionId
  );
  const isRefreshingOptions = useCheckoutStore((s) => s.isRefreshingOptions);

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-text-primary">
        Shipping Method
      </h2>
      {isRefreshingOptions ? (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Spinner data-icon="inline-start" />
          Updating shipping methods...
        </div>
      ) : shippingOptions.length ? (
        <div className="space-y-3">
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-border-primary p-4 text-sm"
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping-option"
                  value={option.id}
                  checked={selectedShippingOptionId === option.id}
                  onChange={(event) =>
                    setSelectedShippingOptionId(event.target.value)
                  }
                />
                <span>
                  <span className="block font-medium text-text-primary">
                    {option.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    {option.type?.description}
                  </span>
                </span>
              </span>
              <span className="font-medium text-text-primary">
                {formatPrice(getShippingOptionAmount(option), currencyCode)}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-sm text-error">
          No shipping options are available for this destination.
        </p>
      )}
    </section>
  );
}
