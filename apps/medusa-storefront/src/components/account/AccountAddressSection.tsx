"use client";

import { useEffect, useMemo, useState } from "react";

import AddressForm from "@/components/address/AddressForm";
import { Spinner } from "@/components/ui/spinner";
import {
  savedAddressToFormValues,
  type AddressFormValues,
  type SavedAddressFormValues,
} from "@/lib/address";
import { useAddressStore } from "@/lib/address/store";
import type { Customer } from "@/types";

type AccountAddressSectionProps = {
  customer: Customer | null;
};

export default function AccountAddressSection({
  customer,
}: AccountAddressSectionProps) {
  const countries = useAddressStore((s) => s.countries);
  const isLoadingCountries = useAddressStore((s) => s.isLoadingCountries);
  const isLoadingAddresses = useAddressStore((s) => s.isLoadingAddresses);
  const loadCountries = useAddressStore((s) => s.loadCountries);
  const loadCustomerAddresses = useAddressStore((s) => s.loadCustomerAddresses);
  const saveCustomerAddress = useAddressStore((s) => s.saveCustomerAddress);
  const [shippingValues, setShippingValues] =
    useState<SavedAddressFormValues>();
  const [billingValues, setBillingValues] = useState<SavedAddressFormValues>();
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const [savingKind, setSavingKind] = useState<"shipping" | "billing" | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoading = isLoadingCountries || isLoadingAddresses;
  const fallbackName = useMemo(
    () => ({
      firstName: customer?.first_name || "",
      lastName: customer?.last_name || "",
    }),
    [customer]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAddresses() {
      try {
        const [, addresses] = await Promise.all([
          loadCountries(),
          loadCustomerAddresses(),
        ]);

        if (cancelled) return;

        const defaultShipping =
          addresses.find((address) => address.is_default_shipping) ||
          addresses[0];
        const defaultBilling = addresses.find(
          (address) => address.is_default_billing
        );

        setShippingValues(
          savedAddressToFormValues(defaultShipping, fallbackName)
        );
        setBillingValues(savedAddressToFormValues(defaultBilling, fallbackName));
      } catch (e) {
        if (cancelled) return;

        setError(
          e instanceof Error ? e.message : "Could not load your saved addresses."
        );
        setShippingValues(savedAddressToFormValues(undefined, fallbackName));
        setBillingValues(savedAddressToFormValues(undefined, fallbackName));
      }
    }

    void loadAddresses();

    return () => {
      cancelled = true;
    };
  }, [fallbackName, loadCountries, loadCustomerAddresses]);

  async function handleSave(
    kind: "shipping" | "billing",
    values: AddressFormValues
  ) {
    const currentValues = kind === "shipping" ? shippingValues : billingValues;

    setSavingKind(kind);
    setMessage(null);
    setError(null);

    try {
      const savedAddress = await saveCustomerAddress(
        kind,
        values,
        currentValues?.id
      );

      if (kind === "shipping") {
        setShippingValues({
          id: savedAddress?.id || currentValues?.id || "",
          ...values,
        });
      } else {
        setBillingValues({
          id: savedAddress?.id || currentValues?.id || "",
          ...values,
        });
      }

      setMessage(
        kind === "shipping"
          ? "Shipping address saved."
          : "Billing address saved."
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this address.");
    } finally {
      setSavingKind(null);
    }
  }

  if (isLoading || !shippingValues || !billingValues) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Spinner data-icon="inline-start" />
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-error">{error}</p>}
      {message && <p className="text-sm text-success">{message}</p>}

      <AddressForm
        id="account-shipping-address"
        title="Shipping Address"
        countries={countries}
        defaultValues={shippingValues}
        submitLabel="Save Shipping"
        isSubmitting={savingKind === "shipping"}
        onSubmit={(values) => handleSave("shipping", values)}
      />

      <AddressForm
        id="account-billing-address"
        title="Billing Address"
        countries={countries}
        defaultValues={billingSameAsShipping ? shippingValues : billingValues}
        submitLabel="Save Billing"
        isSubmitting={savingKind === "billing"}
        fieldsDisabled={billingSameAsShipping}
        footer={
          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg border border-border-primary bg-surface-primary p-4 text-sm">
            <input
              type="checkbox"
              checked={billingSameAsShipping}
              onChange={(event) => {
                const isChecked = event.target.checked;
                setBillingSameAsShipping(isChecked);

                if (isChecked) {
                  setBillingValues({
                    ...shippingValues,
                    id: billingValues.id,
                  });
                }
              }}
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
        }
        onSubmit={(values) => handleSave("billing", values)}
      />
    </div>
  );
}
