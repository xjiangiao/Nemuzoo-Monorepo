"use client";

import AddressForm from "@/components/address/AddressForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type AddressFormValues } from "@/lib/address";
import { useAddressStore } from "@/lib/address/store";
import { useCheckoutStore } from "@/lib/checkout/store";

type CheckoutAddressStepProps = {
  email: string;
  defaultValues: AddressFormValues;
  isAuthenticated: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (values: AddressFormValues) => void | Promise<void>;
};

export default function CheckoutAddressStep({
  email,
  defaultValues,
  isAuthenticated,
  onEmailChange,
  onSubmit,
}: CheckoutAddressStepProps) {
  const countries = useAddressStore((s) => s.countries);
  const selectCountry = useCheckoutStore((s) => s.selectCountry);
  const isSubmitting = useCheckoutStore((s) => s.isSubmitting);
  const isRefreshingOptions = useCheckoutStore((s) => s.isRefreshingOptions);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Contact
        </h2>
        <div className="space-y-2">
          <Label htmlFor="checkout-email">Email</Label>
          <Input
            id="checkout-email"
            type="email"
            form="checkout-address-form"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={isAuthenticated}
            required
          />
        </div>
      </section>

      <AddressForm
        id="checkout-address-form"
        title="Shipping Address"
        countries={countries}
        defaultValues={defaultValues}
        submitLabel="Place Order"
        submittingLabel="Placing order..."
        isSubmitting={isSubmitting}
        disabled={isRefreshingOptions}
        onCountryChange={selectCountry}
        onSubmit={onSubmit}
      />
    </div>
  );
}
