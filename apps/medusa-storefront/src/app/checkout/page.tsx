"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CheckoutAddressStep from "@/components/checkout/CheckoutAddressStep";
import CheckoutIdentityStep from "@/components/checkout/CheckoutIdentityStep";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import CheckoutPaymentStep from "@/components/checkout/CheckoutPaymentStep";
import CheckoutShippingStep from "@/components/checkout/CheckoutShippingStep";
import Container from "@/components/layout/Container";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { Spinner } from "@/components/ui/spinner";
import {
  emptyAddressValues,
  validateAddressValues,
  type AddressFormValues,
} from "@/lib/address";
import { useAddressStore } from "@/lib/address/store";
import { useAuthStore } from "@/lib/auth/store";
import { useCartStore } from "@/lib/cart/store";
import { useCheckoutStore } from "@/lib/checkout/store";

export default function CheckoutPage() {
  const router = useRouter();
  const cartId = useCartStore((s) => s.cartId);
  const cart = useCartStore((s) => s.cart);
  const customer = useAuthStore((s) => s.customer);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const authLoading = useAuthStore((s) => s.isLoading);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const countries = useAddressStore((s) => s.countries);
  const mode = useCheckoutStore((s) => s.mode);
  const setMode = useCheckoutStore((s) => s.setMode);
  const loadCheckout = useCheckoutStore((s) => s.loadCheckout);
  const placeOrder = useCheckoutStore((s) => s.placeOrder);
  const isLoading = useCheckoutStore((s) => s.isLoading);
  const error = useCheckoutStore((s) => s.error);
  const shippingOptions = useCheckoutStore((s) => s.shippingOptions);
  const selectedShippingOptionId = useCheckoutStore(
    (s) => s.selectedShippingOptionId,
  );
  const [addressValues, setAddressValues] =
    useState<AddressFormValues>(emptyAddressValues);
  const [email, setEmail] = useState("");

  const selectedCountry = useMemo(
    () =>
      countries.find((country) => country.code === addressValues.countryCode),
    [addressValues.countryCode, countries],
  );
  const selectedShippingOption = useMemo(
    () =>
      shippingOptions.find((option) => option.id === selectedShippingOptionId),
    [selectedShippingOptionId, shippingOptions],
  );
  const currencyCode =
    selectedCountry?.currencyCode || cart?.currency_code || "usd";
  const subtotal = cart?.subtotal ?? cart?.item_subtotal ?? 0;
  const taxTotal = cart?.tax_total ?? 0;

  const refreshCheckout = useCallback(async (isCancelled?: () => boolean) => {
    const result = await loadCheckout();

    if (isCancelled?.()) return;

    setAddressValues(result.addressValues);
    setEmail(result.cart?.email || customer?.email || "");
  }, [customer, loadCheckout]);

  useEffect(() => {
    if (!authHydrated && !authLoading) {
      void hydrateAuth();
    }
  }, [authHydrated, authLoading, hydrateAuth]);

  useEffect(() => {
    if (!authHydrated) return;

    let cancelled = false;

    async function loadHydratedCheckout() {
      if (isAuthenticated) {
        setMode("customer");
      }

      try {
        await refreshCheckout(() => cancelled);
      } catch {
        // Checkout store owns the user-facing error state.
      }
    }

    loadHydratedCheckout();

    return () => {
      cancelled = true;
    };
  }, [authHydrated, isAuthenticated, refreshCheckout, setMode]);

  async function handleAddressSubmit(values: AddressFormValues) {
    const validationError = validateAddressValues(values);

    if (validationError) {
      useCheckoutStore.setState({ error: validationError });
      return;
    }

    const orderId = await placeOrder(values, email);

    if (orderId) {
      router.push(`/checkout/success?order_id=${orderId}`);
    }
  }

  if (isLoading || !authHydrated || (cartId && !cart)) {
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

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <CheckoutIdentityStep
            isAuthenticated={isAuthenticated}
            customerEmail={customer?.email || email}
            onLoginSuccess={refreshCheckout}
          />

          {(mode === "guest" || mode === "customer") && (
            <>
              <CheckoutAddressStep
                email={email}
                defaultValues={addressValues}
                isAuthenticated={isAuthenticated}
                onEmailChange={setEmail}
                onSubmit={handleAddressSubmit}
              />
              <CheckoutShippingStep currencyCode={currencyCode} />
              <CheckoutPaymentStep />
            </>
          )}
        </div>

        <CheckoutOrderSummary
          items={cart.items || []}
          subtotal={subtotal}
          taxTotal={taxTotal}
          cartTotal={cart.total}
          hasShippingMethod={!!cart.shipping_methods?.length}
          selectedShippingOption={selectedShippingOption}
          shippingTotal={cart.shipping_total || 0}
          currencyCode={currencyCode}
          error={error}
        />
      </div>
    </Container>
  );
}
