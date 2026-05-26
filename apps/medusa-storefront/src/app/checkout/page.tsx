"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import medusaClient from "@/lib/medusa-client";
import {
  buildCountryOptions,
  DEFAULT_COUNTRY_CODE,
  getStateOptions,
  type CountryOption,
  type RegionWithCountries,
} from "@/lib/address";
import { useAuthStore } from "@/lib/auth/store";
import { useCartStore } from "@/lib/cart/store";
import { formatPrice } from "@/lib/utils";

const checkoutFields =
  "*items,*items.variant,*items.variant.product,*region,*shipping_methods,*payment_collection";

type CheckoutMode = "choose" | "guest" | "login" | "customer";

type CheckoutAddress = {
  id?: string;
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

type CheckoutCart = {
  id: string;
  email?: string | null;
  currency_code: string;
  region_id?: string | null;
  subtotal?: number;
  item_subtotal?: number;
  shipping_total?: number;
  tax_total?: number;
  total?: number;
  shipping_address?: CheckoutAddress | null;
  items?: Array<{
    id: string;
    title: string;
    quantity: number;
    total?: number;
  }>;
  shipping_methods?: unknown[];
};

type ShippingOption = {
  id: string;
  name: string;
  amount?: number;
  calculated_price?: {
    calculated_amount?: number | null;
  } | null;
  type?: {
    description?: string | null;
  } | null;
};

type PaymentProvider = {
  id: string;
};

type CheckoutForm = {
  email: string;
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

type LoginForm = {
  email: string;
  password: string;
};

const initialForm: CheckoutForm = {
  email: "",
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

const initialLoginForm: LoginForm = {
  email: "",
  password: "",
};

function getShippingOptionAmount(option: ShippingOption): number {
  return option.calculated_price?.calculated_amount ?? option.amount ?? 0;
}

function addressToForm(address?: CheckoutAddress | null): Partial<CheckoutForm> {
  if (!address) return {};

  return {
    firstName: address.first_name || "",
    lastName: address.last_name || "",
    address1: address.address_1 || "",
    address2: address.address_2 || "",
    city: address.city || "",
    province: address.province?.toLowerCase() || "",
    postalCode: address.postal_code || "",
    countryCode: address.country_code || "",
    phone: address.phone || "",
  };
}

function formToAddress(form: CheckoutForm) {
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
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartId = useCartStore((s) => s.cartId);
  const setCartId = useCartStore((s) => s.setCartId);
  const clearCart = useCartStore((s) => s.clearCart);
  const customer = useAuthStore((s) => s.customer);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const authLoading = useAuthStore((s) => s.isLoading);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const login = useAuthStore((s) => s.login);
  const [mode, setMode] = useState<CheckoutMode>("choose");
  const [cart, setCart] = useState<CheckoutCart | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [customerAddresses, setCustomerAddresses] = useState<CheckoutAddress[]>(
    []
  );
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>(
    []
  );
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState("");
  const [selectedPaymentProviderId, setSelectedPaymentProviderId] =
    useState("");
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingOptions, setIsRefreshingOptions] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCountry = useMemo(
    () => countries.find((country) => country.code === form.countryCode),
    [countries, form.countryCode]
  );
  const stateOptions = useMemo(
    () => getStateOptions(form.countryCode),
    [form.countryCode]
  );

  const loadCartOptions = useCallback(async (currentCart: CheckoutCart) => {
    const [{ shipping_options }, { payment_providers }] = await Promise.all([
      medusaClient.store.fulfillment.listCartOptions({
        cart_id: currentCart.id,
      }),
      currentCart.region_id
        ? medusaClient.store.payment.listPaymentProviders({
            region_id: currentCart.region_id,
          })
        : Promise.resolve({ payment_providers: [] }),
    ]);

    setShippingOptions((shipping_options || []) as ShippingOption[]);
    setPaymentProviders((payment_providers || []) as PaymentProvider[]);
    setSelectedShippingOptionId(shipping_options?.[0]?.id || "");
    setSelectedPaymentProviderId(payment_providers?.[0]?.id || "");
  }, []);

  const loadCheckout = useCallback(async () => {
    if (!cartId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [{ regions }, { cart: loadedCart }] = await Promise.all([
        medusaClient.store.region.list({
          fields: "id,currency_code,*countries",
        }),
        medusaClient.store.cart.retrieve(cartId, {
          fields: checkoutFields,
        }),
      ]);
      const countryOptions = buildCountryOptions(
        regions as RegionWithCountries[]
      );
      const currentCountry =
        loadedCart.shipping_address?.country_code?.toLowerCase() ||
        countryOptions.find((country) => country.regionId === loadedCart.region_id)
          ?.code ||
        countryOptions[0]?.code ||
        DEFAULT_COUNTRY_CODE;
      const currentCountryOption = countryOptions.find(
        (country) => country.code === currentCountry
      );
      let nextCart = loadedCart as CheckoutCart;

      if (
        currentCountryOption?.regionId &&
        currentCountryOption.regionId !== loadedCart.region_id
      ) {
        const { cart: updatedCart } = await medusaClient.store.cart.update(
          loadedCart.id,
          {
            region_id: currentCountryOption.regionId,
          },
          { fields: checkoutFields }
        );
        nextCart = updatedCart as CheckoutCart;
      }

      setCountries(countryOptions);
      setCart(nextCart);
      setForm((current) => ({
        ...current,
        email: nextCart.email || customer?.email || current.email,
        firstName: customer?.first_name || current.firstName,
        lastName: customer?.last_name || current.lastName,
        countryCode: currentCountry,
        ...addressToForm(nextCart.shipping_address),
      }));

      await loadCartOptions(nextCart);
    } catch {
      setError("Could not load checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [cartId, customer, loadCartOptions]);

  useEffect(() => {
    if (!authHydrated && !authLoading) {
      void hydrateAuth();
    }
  }, [authHydrated, authLoading, hydrateAuth]);

  useEffect(() => {
    if (authHydrated && isAuthenticated) {
      setMode("customer");
    }
  }, [authHydrated, isAuthenticated]);

  useEffect(() => {
    void loadCheckout();
  }, [loadCheckout]);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomerAddresses() {
      if (!isAuthenticated) {
        setCustomerAddresses([]);
        setSelectedAddressId("");
        return;
      }

      try {
        const { addresses } = await medusaClient.store.customer.listAddress({
          fields:
            "id,first_name,last_name,address_1,address_2,city,province,postal_code,country_code,phone",
        });

        if (cancelled) return;

        const addressList = (addresses || []) as CheckoutAddress[];
        const preferredAddress =
          addressList.find(
            (address) =>
              address.country_code?.toLowerCase() === form.countryCode
          ) || addressList[0];

        setCustomerAddresses(addressList);

        if (preferredAddress) {
          setSelectedAddressId(preferredAddress.id || "");
          setForm((current) => ({
            ...current,
            ...addressToForm(preferredAddress),
            email: customer?.email || current.email,
          }));
        } else {
          setForm((current) => ({
            ...current,
            email: customer?.email || current.email,
            firstName: customer?.first_name || current.firstName,
            lastName: customer?.last_name || current.lastName,
          }));
        }
      } catch {
        if (!cancelled) {
          setCustomerAddresses([]);
        }
      }
    }

    void loadCustomerAddresses();

    return () => {
      cancelled = true;
    };
  }, [customer, isAuthenticated]);

  const selectedShippingOption = useMemo(
    () =>
      shippingOptions.find((option) => option.id === selectedShippingOptionId),
    [selectedShippingOptionId, shippingOptions]
  );

  const shippingPreview = selectedShippingOption
    ? getShippingOptionAmount(selectedShippingOption)
    : cart?.shipping_total || 0;
  const subtotal = cart?.subtotal ?? cart?.item_subtotal ?? 0;
  const taxTotal = cart?.tax_total ?? 0;
  const total =
    cart?.shipping_methods?.length
      ? cart.total ?? subtotal + shippingPreview
      : subtotal + shippingPreview + taxTotal;
  const currencyCode =
    selectedCountry?.currencyCode || cart?.currency_code || "usd";
  const isUsAddress = form.countryCode === "us";

  function updateField(name: keyof CheckoutForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCountryChange(countryCode: string) {
    setForm((current) => ({
      ...current,
      countryCode,
      province: current.countryCode === countryCode ? current.province : "",
    }));
    setError(null);

    if (!cart) return;

    const nextCountry = countries.find((country) => country.code === countryCode);

    if (!nextCountry) {
      setError("This destination is not available for checkout.");
      return;
    }

    if (nextCountry.regionId === cart.region_id) return;

    setIsRefreshingOptions(true);

    try {
      const { cart: updatedCart } = await medusaClient.store.cart.update(
        cart.id,
        {
          region_id: nextCountry.regionId,
        },
        { fields: checkoutFields }
      );

      const nextCart = updatedCart as CheckoutCart;
      setCart(nextCart);
      await loadCartOptions(nextCart);
    } catch {
      setError("Could not update the checkout destination.");
    } finally {
      setIsRefreshingOptions(false);
    }
  }

  function handleSavedAddressChange(addressId: string) {
    setSelectedAddressId(addressId);

    const address = customerAddresses.find((item) => item.id === addressId);

    if (address) {
      setForm((current) => ({
        ...current,
        ...addressToForm(address),
      }));
    }
  }

  async function handleCheckoutLogin() {
    if (!cartId) return;

    setIsLoggingIn(true);
    setError(null);

    try {
      const didLogin = await login(loginForm.email, loginForm.password);

      if (!didLogin) {
        setError("Invalid email or password.");
        return;
      }

      const { cart: transferredCart } = await medusaClient.store.cart.transferCart(
        cartId,
        { fields: checkoutFields }
      );
      setCartId(transferredCart.id);
      setCart(transferredCart as CheckoutCart);
      setMode("customer");
      await loadCartOptions(transferredCart as CheckoutCart);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not sign in for checkout. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function syncCustomerAddress(address: ReturnType<typeof formToAddress>) {
    if (!isAuthenticated) return;

    const currentAddress =
      customerAddresses.find((item) => item.id === selectedAddressId) ||
      customerAddresses[0];

    await medusaClient.store.customer.update({
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone || undefined,
    });

    if (currentAddress?.id) {
      await medusaClient.store.customer.updateAddress(currentAddress.id, {
        ...address,
        is_default_shipping: true,
        is_default_billing: true,
      });
      return;
    }

    await medusaClient.store.customer.createAddress({
      ...address,
      is_default_shipping: true,
      is_default_billing: true,
    });
  }

  function validateForm() {
    if (!cart) return "Your cart is not ready yet.";
    if (mode === "choose" || mode === "login") {
      return "Choose guest checkout or sign in before placing your order.";
    }
    if (!form.email.trim()) return "Enter your email address.";
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return "Enter your first and last name.";
    }
    if (!form.address1.trim() || !form.city.trim() || !form.postalCode.trim()) {
      return "Enter a complete shipping address.";
    }
    if (isUsAddress && !form.province.trim()) return "Enter your state.";
    if (!selectedCountry) return "Choose a supported shipping country.";
    if (!selectedShippingOptionId) return "Please choose a shipping method.";
    if (!selectedPaymentProviderId) {
      return "No payment method is available for this region.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!cart || !selectedCountry) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const address = formToAddress(form);
      let workingCart = cart;

      if (isAuthenticated) {
        const { cart: transferredCart } =
          await medusaClient.store.cart.transferCart(workingCart.id, {
            fields: checkoutFields,
          });
        workingCart = transferredCart as CheckoutCart;
      }

      const { cart: cartWithAddress } = await medusaClient.store.cart.update(
        workingCart.id,
        {
          email: form.email,
          region_id: selectedCountry.regionId,
          shipping_address: address,
          billing_address: address,
        },
        { fields: checkoutFields }
      );

      await syncCustomerAddress(address);

      const { cart: cartWithShipping } =
        await medusaClient.store.cart.addShippingMethod(
          cartWithAddress.id,
          {
            option_id: selectedShippingOptionId,
          },
          { fields: checkoutFields }
        );

      await medusaClient.store.payment.initiatePaymentSession(
        cartWithShipping,
        {
          provider_id: selectedPaymentProviderId,
        }
      );

      const result = await medusaClient.store.cart.complete(cartWithShipping.id);

      if (result.type === "cart") {
        setCart(result.cart as CheckoutCart);
        setError(result.error.message || "Could not place the order.");
        return;
      }

      clearCart();
      router.push(`/checkout/success?order_id=${result.order.id}`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not place the order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !authHydrated) {
    return (
      <Container className="py-16 lg:py-20">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Spinner data-icon="inline-start" />
          Loading checkout...
        </div>
      </Container>
    );
  }

  if (!cartId || !cart || !cart.items?.length) {
    return (
      <Container className="py-16 lg:py-20">
        <EmptyState
          title="Your cart is empty"
          description="Add a companion to your cart before checking out."
          action={
            <Button variant="warm" href="/products">
              Browse Dolls
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-16 lg:py-20">
      <SectionHeading title="Checkout" alignment="left" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]"
      >
        <div className="space-y-8">
          {!isAuthenticated && (
            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-text-primary">
                Checkout Options
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-lg border p-4 text-left text-sm transition-colors ${
                    mode === "login"
                      ? "border-accent bg-accent/10"
                      : "border-border-primary"
                  }`}
                >
                  <span className="block font-medium text-text-primary">
                    Sign in and checkout
                  </span>
                  <span className="mt-1 block text-text-secondary">
                    Use your saved customer details.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("guest");
                    setError(null);
                  }}
                  className={`rounded-lg border p-4 text-left text-sm transition-colors ${
                    mode === "guest"
                      ? "border-accent bg-accent/10"
                      : "border-border-primary"
                  }`}
                >
                  <span className="block font-medium text-text-primary">
                    Checkout as guest
                  </span>
                  <span className="mt-1 block text-text-secondary">
                    Place this order without creating an account.
                  </span>
                </button>
              </div>

              {mode === "login" && (
                <div className="space-y-4 rounded-lg border border-border-primary p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="checkout-login-email">Email</Label>
                      <Input
                        id="checkout-login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(event) =>
                          setLoginForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        required={mode === "login"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkout-login-password">Password</Label>
                      <Input
                        id="checkout-login-password"
                        type="password"
                        value={loginForm.password}
                        onChange={(event) =>
                          setLoginForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                        required={mode === "login"}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="accent"
                    disabled={isLoggingIn}
                    onClick={() => void handleCheckoutLogin()}
                  >
                    {isLoggingIn ? (
                      <>
                        <Spinner data-icon="inline-start" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              )}
            </section>
          )}

          {isAuthenticated && (
            <section className="space-y-2 rounded-lg border border-border-primary p-4 text-sm">
              <h2 className="font-heading text-xl font-semibold text-text-primary">
                Account
              </h2>
              <p className="text-text-secondary">
                Checking out as {customer?.email || form.email}.
              </p>
            </section>
          )}

          {(mode === "guest" || mode === "customer") && (
            <>
              <section className="space-y-4">
                <h2 className="font-heading text-xl font-semibold text-text-primary">
                  Contact
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="checkout-email">Email</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    disabled={isAuthenticated}
                    required
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-xl font-semibold text-text-primary">
                  Shipping Address
                </h2>

                {isAuthenticated && customerAddresses.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="checkout-saved-address">Saved Address</Label>
                    <select
                      id="checkout-saved-address"
                      value={selectedAddressId}
                      onChange={(event) =>
                        handleSavedAddressChange(event.target.value)
                      }
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {customerAddresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {[address.address_1, address.city, address.province]
                            .filter(Boolean)
                            .join(", ")}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-first-name">First Name</Label>
                    <Input
                      id="checkout-first-name"
                      value={form.firstName}
                      onChange={(event) =>
                        updateField("firstName", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-last-name">Last Name</Label>
                    <Input
                      id="checkout-last-name"
                      value={form.lastName}
                      onChange={(event) =>
                        updateField("lastName", event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkout-address-1">Address</Label>
                  <Input
                    id="checkout-address-1"
                    value={form.address1}
                    onChange={(event) =>
                      updateField("address1", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkout-address-2">
                    Apartment, Suite, etc.
                  </Label>
                  <Input
                    id="checkout-address-2"
                    value={form.address2}
                    onChange={(event) =>
                      updateField("address2", event.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-city">City</Label>
                    <Input
                      id="checkout-city"
                      value={form.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-province">
                      {isUsAddress ? "State" : "State / Province"}
                    </Label>
                    {stateOptions.length ? (
                      <select
                        id="checkout-province"
                        value={form.province}
                        onChange={(event) =>
                          updateField("province", event.target.value)
                        }
                        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        required={isUsAddress}
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
                        id="checkout-province"
                        value={form.province}
                        onChange={(event) =>
                          updateField("province", event.target.value)
                        }
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-postal-code">
                      {isUsAddress ? "ZIP Code" : "Postal Code"}
                    </Label>
                    <Input
                      id="checkout-postal-code"
                      value={form.postalCode}
                      onChange={(event) =>
                        updateField("postalCode", event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-country">Country</Label>
                    <select
                      id="checkout-country"
                      value={form.countryCode}
                      onChange={(event) =>
                        void handleCountryChange(event.target.value)
                      }
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
                    <Label htmlFor="checkout-phone">Phone</Label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

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
                          {formatPrice(
                            getShippingOptionAmount(option),
                            currencyCode
                          )}
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
            </>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-border-primary bg-surface-elevated p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
            Order Summary
          </h2>
          <div className="space-y-4">
            {cart.items?.map((item) => (
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

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="mt-6 w-full"
            disabled={
              isSubmitting ||
              isRefreshingOptions ||
              mode === "choose" ||
              mode === "login"
            }
          >
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                Placing order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </aside>
      </form>
    </Container>
  );
}
