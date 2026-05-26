"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import AuthModal from "@/components/auth/AuthModal";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  buildCountryOptions,
  DEFAULT_COUNTRY_CODE,
  getStateOptions,
  type CountryOption,
  type RegionWithCountries,
} from "@/lib/address";
import { useAuthStore } from "@/lib/auth/store";
import medusaClient from "@/lib/medusa-client";
import { formatDate } from "@/lib/utils";

type AddressKind = "shipping" | "billing";

type CustomerAddress = {
  id?: string;
  address_name?: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
};

type AddressForm = {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  phone: string;
};

const initialAddressForm: AddressForm = {
  id: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  postalCode: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  phone: "",
};

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function addressToForm(
  address: CustomerAddress | undefined,
  fallback: Pick<AddressForm, "firstName" | "lastName">
): AddressForm {
  return {
    id: address?.id || "",
    firstName: address?.first_name || fallback.firstName,
    lastName: address?.last_name || fallback.lastName,
    address1: address?.address_1 || "",
    address2: address?.address_2 || "",
    city: address?.city || "",
    province: address?.province?.toLowerCase() || "",
    postalCode: address?.postal_code || "",
    countryCode: address?.country_code || DEFAULT_COUNTRY_CODE,
    phone: address?.phone || "",
  };
}

function formToAddress(
  form: AddressForm,
  kind: AddressKind
) {
  return {
    first_name: form.firstName,
    last_name: form.lastName,
    phone: form.phone || null,
    address_1: form.address1,
    address_2: form.address2 || null,
    city: form.city,
    province: form.province || null,
    postal_code: form.postalCode,
    country_code: form.countryCode,
    address_name: kind === "shipping" ? "Shipping address" : "Billing address",
    is_default_shipping: kind === "shipping",
    is_default_billing: kind === "billing",
  };
}

function validateAddress(form: AddressForm) {
  if (!form.firstName.trim() || !form.lastName.trim()) {
    return "Enter first and last name.";
  }
  if (!form.address1.trim() || !form.city.trim() || !form.postalCode.trim()) {
    return "Enter a complete address.";
  }
  if (form.countryCode === "us" && !form.province.trim()) {
    return "Select a state.";
  }

  return null;
}

export default function AccountPage() {
  const { customer, isAuthenticated, isLoading } = useAuthStore();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [shippingForm, setShippingForm] =
    useState<AddressForm>(initialAddressForm);
  const [billingForm, setBillingForm] =
    useState<AddressForm>(initialAddressForm);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [savingKind, setSavingKind] = useState<AddressKind | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null);

  const shippingStateOptions = useMemo(
    () => getStateOptions(shippingForm.countryCode),
    [shippingForm.countryCode]
  );
  const billingStateOptions = useMemo(
    () => getStateOptions(billingForm.countryCode),
    [billingForm.countryCode]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAddressData() {
      if (!isAuthenticated || !customer) return;

      setIsAddressLoading(true);
      setAddressError(null);

      try {
        const [{ regions }, { addresses }] = await Promise.all([
          medusaClient.store.region.list({
            fields: "id,currency_code,*countries",
          }),
          medusaClient.store.customer.listAddress({
            fields:
              "id,address_name,is_default_shipping,is_default_billing,first_name,last_name,address_1,address_2,city,province,postal_code,country_code,phone",
          }),
        ]);

        if (cancelled) return;

        const fallbackName = {
          firstName: customer.first_name || "",
          lastName: customer.last_name || "",
        };
        const addressList = (addresses || []) as CustomerAddress[];
        const defaultShipping =
          addressList.find((address) => address.is_default_shipping) ||
          addressList[0];
        const defaultBilling =
          addressList.find((address) => address.is_default_billing) ||
          defaultShipping;

        setCountries(buildCountryOptions(regions as RegionWithCountries[]));
        setShippingForm(addressToForm(defaultShipping, fallbackName));
        setBillingForm(addressToForm(defaultBilling, fallbackName));
      } catch {
        if (!cancelled) {
          setAddressError("Could not load your saved addresses.");
        }
      } finally {
        if (!cancelled) {
          setIsAddressLoading(false);
        }
      }
    }

    void loadAddressData();

    return () => {
      cancelled = true;
    };
  }, [customer, isAuthenticated]);

  function updateAddressField(
    kind: AddressKind,
    field: keyof AddressForm,
    value: string
  ) {
    const setForm = kind === "shipping" ? setShippingForm : setBillingForm;

    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "countryCode" ? { province: "" } : {}),
    }));
  }

  async function saveAddress(kind: AddressKind, event: FormEvent) {
    event.preventDefault();

    const form = kind === "shipping" ? shippingForm : billingForm;
    const validationError = validateAddress(form);

    if (validationError) {
      setAddressError(validationError);
      setAddressSuccess(null);
      return;
    }

    setSavingKind(kind);
    setAddressError(null);
    setAddressSuccess(null);

    try {
      const payload = formToAddress(form, kind);

      if (form.id) {
        await medusaClient.store.customer.updateAddress(form.id, payload);
      } else {
        const { customer: updatedCustomer } =
          await medusaClient.store.customer.createAddress(payload);
        const createdAddress = updatedCustomer.addresses?.find((address) =>
          kind === "shipping"
            ? address.is_default_shipping
            : address.is_default_billing
        ) as CustomerAddress | undefined;

        if (createdAddress?.id) {
          const setForm = kind === "shipping" ? setShippingForm : setBillingForm;
          setForm((current) => ({ ...current, id: createdAddress.id || "" }));
        }
      }

      setAddressSuccess(
        kind === "shipping"
          ? "Shipping address saved."
          : "Billing address saved."
      );
    } catch (e) {
      setAddressError(
        e instanceof Error ? e.message : "Could not save this address."
      );
    } finally {
      setSavingKind(null);
    }
  }

  function renderAddressForm(
    kind: AddressKind,
    form: AddressForm,
    stateOptions: ReturnType<typeof getStateOptions>
  ) {
    const title = kind === "shipping" ? "Shipping Address" : "Billing Address";
    const isSaving = savingKind === kind;

    return (
      <form
        onSubmit={(event) => void saveAddress(kind, event)}
        className="rounded-xl border border-border-primary bg-surface-elevated p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-text-primary">{title}</h2>
          {kind === "billing" && (
            <button
              type="button"
              className="text-xs font-medium text-text-secondary hover:text-text-primary"
              onClick={() =>
                setBillingForm((current) => ({
                  ...shippingForm,
                  id: current.id,
                }))
              }
            >
              Use shipping address
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${kind}-first-name`}>First Name</Label>
            <Input
              id={`${kind}-first-name`}
              value={form.firstName}
              onChange={(event) =>
                updateAddressField(kind, "firstName", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${kind}-last-name`}>Last Name</Label>
            <Input
              id={`${kind}-last-name`}
              value={form.lastName}
              onChange={(event) =>
                updateAddressField(kind, "lastName", event.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor={`${kind}-address-1`}>Address</Label>
          <Input
            id={`${kind}-address-1`}
            value={form.address1}
            onChange={(event) =>
              updateAddressField(kind, "address1", event.target.value)
            }
            required
          />
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor={`${kind}-address-2`}>Apartment, Suite, etc.</Label>
          <Input
            id={`${kind}-address-2`}
            value={form.address2}
            onChange={(event) =>
              updateAddressField(kind, "address2", event.target.value)
            }
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={`${kind}-city`}>City</Label>
            <Input
              id={`${kind}-city`}
              value={form.city}
              onChange={(event) =>
                updateAddressField(kind, "city", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${kind}-province`}>
              {form.countryCode === "us" ? "State" : "State / Province"}
            </Label>
            {stateOptions.length ? (
              <select
                id={`${kind}-province`}
                value={form.province}
                onChange={(event) =>
                  updateAddressField(kind, "province", event.target.value)
                }
                className={selectClassName}
                required={form.countryCode === "us"}
              >
                <option value="">Select state</option>
                {stateOptions.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={`${kind}-province`}
                value={form.province}
                onChange={(event) =>
                  updateAddressField(kind, "province", event.target.value)
                }
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${kind}-postal-code`}>
              {form.countryCode === "us" ? "ZIP Code" : "Postal Code"}
            </Label>
            <Input
              id={`${kind}-postal-code`}
              value={form.postalCode}
              onChange={(event) =>
                updateAddressField(kind, "postalCode", event.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${kind}-country`}>Country</Label>
            <select
              id={`${kind}-country`}
              value={form.countryCode}
              onChange={(event) =>
                updateAddressField(kind, "countryCode", event.target.value)
              }
              className={selectClassName}
              required
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${kind}-phone`}>Phone</Label>
            <Input
              id={`${kind}-phone`}
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateAddressField(kind, "phone", event.target.value)
              }
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="accent"
          className="mt-5"
          disabled={isSaving || !countries.length}
        >
          {isSaving ? (
            <>
              <Spinner data-icon="inline-start" />
              Saving...
            </>
          ) : (
            `Save ${kind === "shipping" ? "Shipping" : "Billing"}`
          )}
        </Button>
      </form>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          My Account
        </h1>
        <p className="text-sm text-text-secondary">
          Sign in to view your account details and order history.
        </p>
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-heading text-2xl font-bold text-text-primary">
        My Account
      </h1>

      <div className="rounded-xl border border-border-primary bg-surface-elevated p-6">
        <h2 className="mb-4 text-sm font-medium text-text-primary">Profile</h2>
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <span className="text-text-muted">Name</span>
            <p className="text-text-primary">
              {[customer?.first_name, customer?.last_name]
                .filter(Boolean)
                .join(" ") || "-"}
            </p>
          </div>
          <div>
            <span className="text-text-muted">Email</span>
            <p className="text-text-primary">{customer?.email}</p>
          </div>
          {customer?.created_at && (
            <div>
              <span className="text-text-muted">Member since</span>
              <p className="text-text-primary">
                {formatDate(customer.created_at)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {isAddressLoading ? (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Spinner data-icon="inline-start" />
            Loading addresses...
          </div>
        ) : (
          <>
            {addressError && <p className="text-sm text-error">{addressError}</p>}
            {addressSuccess && (
              <p className="text-sm text-success">{addressSuccess}</p>
            )}
            {renderAddressForm("shipping", shippingForm, shippingStateOptions)}
            {renderAddressForm("billing", billingForm, billingStateOptions)}
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border-primary bg-surface-elevated p-6">
        <h2 className="mb-4 text-sm font-medium text-text-primary">Orders</h2>
        <p className="text-sm text-text-muted">
          No orders yet. Start exploring our collection!
        </p>
      </div>
    </div>
  );
}
