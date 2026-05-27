"use client";

import { useCheckoutStore } from "@/lib/checkout/store";

export default function CheckoutPaymentStep() {
  const paymentProviders = useCheckoutStore((s) => s.paymentProviders);
  const selectedPaymentProviderId = useCheckoutStore(
    (s) => s.selectedPaymentProviderId
  );
  const setSelectedPaymentProviderId = useCheckoutStore(
    (s) => s.setSelectedPaymentProviderId
  );

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-text-primary">
        Payment
      </h2>
      {paymentProviders.length ? (
        <div className="space-y-3">
          {paymentProviders.map((provider) => (
            <label
              key={provider.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-primary p-4 text-sm"
            >
              <input
                type="radio"
                name="payment-provider"
                value={provider.id}
                checked={selectedPaymentProviderId === provider.id}
                onChange={(event) =>
                  setSelectedPaymentProviderId(event.target.value)
                }
              />
              <span className="font-medium text-text-primary">
                {provider.id === "pp_system_default"
                  ? "Test payment"
                  : provider.id}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-sm text-error">
          No payment provider is available for this cart region.
        </p>
      )}
    </section>
  );
}
