"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CheckoutAddressStep from "@/components/checkout/CheckoutAddressStep";
import CheckoutBillingStep from "@/components/checkout/CheckoutBillingStep";
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
  const isSubmitting = useCheckoutStore((s) => s.isSubmitting);
  const isRefreshingOptions = useCheckoutStore((s) => s.isRefreshingOptions);
  const error = useCheckoutStore((s) => s.error);
  const shippingOptions = useCheckoutStore((s) => s.shippingOptions);
  const selectedShippingOptionId = useCheckoutStore(
    (s) => s.selectedShippingOptionId,
  );
  const [addressValues, setAddressValues] =
    useState<AddressFormValues>(emptyAddressValues);
  const [billingAddressValues, setBillingAddressValues] =
    useState<AddressFormValues>(emptyAddressValues);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
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
    setBillingAddressValues(result.addressValues);
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

  async function handlePlaceOrder(
    shippingValues: AddressFormValues,
    billingValues?: AddressFormValues
  ) {
    const validationError = validateAddressValues(shippingValues);

    if (validationError) {
      useCheckoutStore.setState({ error: validationError });
      return;
    }

    const finalBillingValues = billingSameAsShipping
      ? shippingValues
      : billingValues || billingAddressValues;
    const billingValidationError = billingSameAsShipping
      ? null
      : validateAddressValues(finalBillingValues);

    if (billingValidationError) {
      useCheckoutStore.setState({ error: billingValidationError });
      return;
    }

    const orderId = await placeOrder(shippingValues, email, finalBillingValues);

    if (orderId) {
      router.push(`/checkout/success?order_id=${orderId}`);
    }
  }

  function submitAddressForm(formId: string) {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    form?.requestSubmit();
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
          description="Add a Nemuzoo object to your cart before checking out."
          action={
            <Button variant="warm" href="/products">
              Browse Products
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
                onSubmit={(values) => {
                  setAddressValues(values);

                  if (billingSameAsShipping) {
                    void handlePlaceOrder(values, values);
                    return;
                  }

                  submitAddressForm("checkout-billing-address-form");
                }}
              />
              <CheckoutBillingStep
                countries={countries}
                defaultValues={billingAddressValues}
                sameAsShipping={billingSameAsShipping}
                isDisabled={isRefreshingOptions}
                onSameAsShippingChange={(sameAsShipping) => {
                  setBillingSameAsShipping(sameAsShipping);

                  if (sameAsShipping) {
                    setBillingAddressValues(addressValues);
                  }
                }}
                onSubmit={(values) => {
                  setBillingAddressValues(values);
                  void handlePlaceOrder(addressValues, values);
                }}
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
          isSubmitting={isSubmitting}
          isSubmitDisabled={
            isRefreshingOptions || mode === "choose" || mode === "login"
          }
        />
      </div>
    </Container>
  );
}
