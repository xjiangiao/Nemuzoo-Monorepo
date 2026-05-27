"use client";

import AddressForm from "@/components/address/AddressForm";
import {
  type AddressFormValues,
  type CountryOption,
} from "@/lib/address";

type CheckoutBillingStepProps = {
  countries: CountryOption[];
  defaultValues: AddressFormValues;
  sameAsShipping: boolean;
  isDisabled?: boolean;
  onSameAsShippingChange: (sameAsShipping: boolean) => void;
  onSubmit: (values: AddressFormValues) => void | Promise<void>;
};

export default function CheckoutBillingStep({
  countries,
  defaultValues,
  sameAsShipping,
  isDisabled,
  onSameAsShippingChange,
  onSubmit,
}: CheckoutBillingStepProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border-primary bg-surface-elevated p-6">
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Billing Address
        </h2>
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-border-primary bg-surface-primary p-4 text-sm">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={(event) => onSameAsShippingChange(event.target.checked)}
            className="size-4"
          />
          <span>
            <span className="block font-medium text-text-primary">
              Same as shipping address
            </span>
            <span className="text-xs text-text-secondary">
              Use the shipping details above for billing.
            </span>
          </span>
        </label>
      </div>

      {!sameAsShipping && (
        <AddressForm
          id="checkout-billing-address-form"
          title="Billing Details"
          countries={countries}
          defaultValues={defaultValues}
          submitLabel="Continue"
          hideSubmit
          disabled={isDisabled}
          onSubmit={onSubmit}
        />
      )}
    </section>
  );
}
