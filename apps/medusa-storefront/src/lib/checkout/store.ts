import { create } from "zustand";

import {
  addressFormToPayload,
  addressToFormValues,
  DEFAULT_COUNTRY_CODE,
  type AddressFormValues,
} from "@/lib/address";
import { useAddressStore } from "@/lib/address/store";
import { useAuthStore } from "@/lib/auth/store";
import {
  checkoutCartFields,
  type CheckoutCart,
  useCartStore,
} from "@/lib/cart/store";
import medusaClient from "@/lib/medusa-client";

export type CheckoutMode = "choose" | "guest" | "login" | "customer";

export type ShippingOption = {
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

export type PaymentProvider = {
  id: string;
};

type LoginValues = {
  email: string;
  password: string;
};

interface CheckoutState {
  mode: CheckoutMode;
  shippingOptions: ShippingOption[];
  paymentProviders: PaymentProvider[];
  selectedShippingOptionId: string;
  selectedPaymentProviderId: string;
  isLoading: boolean;
  isRefreshingOptions: boolean;
  isLoggingIn: boolean;
  isSubmitting: boolean;
  error: string | null;
  loginError: string | null;

  setMode: (mode: CheckoutMode) => void;
  setSelectedShippingOptionId: (id: string) => void;
  setSelectedPaymentProviderId: (id: string) => void;
  loadCartOptions: (cart: CheckoutCart) => Promise<void>;
  loadCheckout: () => Promise<{
    cart: CheckoutCart | null;
    addressValues: AddressFormValues;
  }>;
  selectCountry: (countryCode: string) => Promise<void>;
  loginAndTransferCart: (values: LoginValues) => Promise<boolean>;
  placeOrder: (
    shippingValues: AddressFormValues,
    email: string,
    billingValues?: AddressFormValues
  ) => Promise<string | null>;
  clearError: () => void;
  reset: () => void;
}

function getShippingOptionAmount(option: ShippingOption): number {
  return option.calculated_price?.calculated_amount ?? option.amount ?? 0;
}

function resolveCheckoutCountry(cart: CheckoutCart | null) {
  const { countries } = useAddressStore.getState();

  return (
    cart?.shipping_address?.country_code?.toLowerCase() ||
    countries.find((country) => country.regionId === cart?.region_id)?.code ||
    countries[0]?.code ||
    DEFAULT_COUNTRY_CODE
  );
}

function getSelectedCountry(countryCode: string) {
  return useAddressStore
    .getState()
    .countries.find((country) => country.code === countryCode);
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  mode: "choose",
  shippingOptions: [],
  paymentProviders: [],
  selectedShippingOptionId: "",
  selectedPaymentProviderId: "",
  isLoading: false,
  isRefreshingOptions: false,
  isLoggingIn: false,
  isSubmitting: false,
  error: null,
  loginError: null,

  setMode: (mode) => set({ mode, error: null, loginError: null }),
  setSelectedShippingOptionId: (id) => set({ selectedShippingOptionId: id }),
  setSelectedPaymentProviderId: (id) => set({ selectedPaymentProviderId: id }),

  loadCartOptions: async (cart: CheckoutCart) => {
    const [{ shipping_options }, { payment_providers }] = await Promise.all([
      medusaClient.store.fulfillment.listCartOptions({
        cart_id: cart.id,
      }),
      cart.region_id
        ? medusaClient.store.payment.listPaymentProviders({
            region_id: cart.region_id,
          })
        : Promise.resolve({ payment_providers: [] }),
    ]);

    set({
      shippingOptions: (shipping_options || []) as ShippingOption[],
      paymentProviders: (payment_providers || []) as PaymentProvider[],
      selectedShippingOptionId: shipping_options?.[0]?.id || "",
      selectedPaymentProviderId: payment_providers?.[0]?.id || "",
    });
  },

  loadCheckout: async () => {
    set({ isLoading: true, error: null });

    try {
      const countries = await useAddressStore.getState().loadCountries();
      const cart = await useCartStore.getState().retrieveCart(checkoutCartFields);
      const customer = useAuthStore.getState().customer;

      if (!cart) {
        set({ isLoading: false });
        return {
          cart: null,
          addressValues: addressToFormValues(null, {
            firstName: customer?.first_name || "",
            lastName: customer?.last_name || "",
          }),
        };
      }

      const countryCode = resolveCheckoutCountry(cart);
      const country =
        countries.find((item) => item.code === countryCode) ||
        getSelectedCountry(countryCode);
      let nextCart = cart;

      if (country?.regionId && country.regionId !== cart.region_id) {
        nextCart =
          (await useCartStore
            .getState()
            .updateCartRegion(country.regionId, checkoutCartFields)) || cart;
      }

      await get().loadCartOptions(nextCart);

      const isAuthenticated = useAuthStore.getState().isAuthenticated;

      if (isAuthenticated) {
        const addresses = await useAddressStore
          .getState()
          .loadCustomerAddresses();
        const preferredAddress =
          addresses.find(
            (address) => address.country_code?.toLowerCase() === countryCode
          ) || addresses.find((address) => address.is_default_shipping);

        set({ mode: "customer" });
        set({ isLoading: false });
        return {
          cart: nextCart,
          addressValues: addressToFormValues(
            preferredAddress || nextCart.shipping_address,
            {
              firstName: customer?.first_name || "",
              lastName: customer?.last_name || "",
            }
          ),
        };
      }

      set({ isLoading: false });
      return {
        cart: nextCart,
        addressValues: {
          ...addressToFormValues(nextCart.shipping_address, {
            firstName: customer?.first_name || "",
            lastName: customer?.last_name || "",
          }),
          countryCode,
        },
      };
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : "Could not load checkout.",
      });
      return {
        cart: null,
        addressValues: addressToFormValues(null),
      };
    }
  },

  selectCountry: async (countryCode: string) => {
    const country = getSelectedCountry(countryCode);
    const cart = useCartStore.getState().cart;

    if (!country) {
      set({ error: "This destination is not available for checkout." });
      return;
    }

    if (!cart || country.regionId === cart.region_id) return;

    set({ isRefreshingOptions: true, error: null });

    try {
      const nextCart = await useCartStore
        .getState()
        .updateCartRegion(country.regionId, checkoutCartFields);

      if (nextCart) {
        await get().loadCartOptions(nextCart);
      }
    } catch (e) {
      set({
        error:
          e instanceof Error
            ? e.message
            : "Could not update the checkout destination.",
      });
    } finally {
      set({ isRefreshingOptions: false });
    }
  },

  loginAndTransferCart: async ({ email, password }) => {
    set({ isLoggingIn: true, loginError: null });

    try {
      const didLogin = await useAuthStore.getState().login(email, password);

      if (!didLogin) {
        set({
          loginError: "Invalid email or password.",
          isLoggingIn: false,
        });
        return false;
      }

      const cart = await useCartStore
        .getState()
        .transferCart(checkoutCartFields);

      if (cart) {
        await get().loadCartOptions(cart);
      }

      set({ mode: "customer", isLoggingIn: false });
      return true;
    } catch (e) {
      set({
        isLoggingIn: false,
        loginError:
          e instanceof Error
            ? e.message
            : "Could not sign in for checkout. Please try again.",
      });
      return false;
    }
  },

  placeOrder: async (shippingValues, email, billingValues) => {
    const {
      mode,
      selectedPaymentProviderId,
      selectedShippingOptionId,
    } = get();
    const cart = useCartStore.getState().cart;
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const customer = useAuthStore.getState().customer;
    const country = getSelectedCountry(shippingValues.countryCode);

    if (!cart) {
      set({ error: "Your cart is not ready yet." });
      return null;
    }

    if (mode === "choose" || mode === "login") {
      set({
        error: "Choose guest checkout or sign in before placing your order.",
      });
      return null;
    }

    if (!email.trim()) {
      set({ error: "Enter your email address." });
      return null;
    }

    if (!country) {
      set({ error: "Choose a supported shipping country." });
      return null;
    }

    if (!selectedShippingOptionId) {
      set({ error: "Please choose a shipping method." });
      return null;
    }

    if (!selectedPaymentProviderId) {
      set({ error: "No payment method is available for this region." });
      return null;
    }

    set({ isSubmitting: true, error: null });

    try {
      let workingCart = cart;

      if (isAuthenticated) {
        workingCart =
          (await useCartStore
            .getState()
            .transferCart(checkoutCartFields)) || cart;
      }

      const shippingAddress = addressFormToPayload(shippingValues);
      const billingAddress = addressFormToPayload(
        billingValues || shippingValues
      );
      const cartWithAddress = await useCartStore
        .getState()
        .updateCartAddress(
          email,
          shippingAddress,
          country.regionId,
          billingAddress,
          checkoutCartFields
        );

      if (!cartWithAddress) {
        throw new Error("Cart address update failed.");
      }

      if (isAuthenticated) {
        await useAddressStore
          .getState()
          .syncCheckoutAddress(shippingValues, customer, undefined);
      }

      const { cart: cartWithShipping } =
        await medusaClient.store.cart.addShippingMethod(
          cartWithAddress.id || workingCart.id,
          {
            option_id: selectedShippingOptionId,
          },
          { fields: checkoutCartFields }
        );

      useCartStore.getState().setCartFromResponse(cartWithShipping);

      await medusaClient.store.payment.initiatePaymentSession(
        cartWithShipping,
        {
          provider_id: selectedPaymentProviderId,
        }
      );

      const result = await medusaClient.store.cart.complete(
        cartWithShipping.id
      );

      if (result.type === "cart") {
        useCartStore.getState().setCartFromResponse(result.cart);
        set({
          isSubmitting: false,
          error: result.error.message || "Could not place the order.",
        });
        return null;
      }

      useCartStore.getState().clearCart();
      set({ isSubmitting: false });
      return result.order.id;
    } catch (e) {
      set({
        isSubmitting: false,
        error:
          e instanceof Error
            ? e.message
            : "Could not place the order. Please try again.",
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      mode: "choose",
      shippingOptions: [],
      paymentProviders: [],
      selectedShippingOptionId: "",
      selectedPaymentProviderId: "",
      isLoading: false,
      isRefreshingOptions: false,
      isLoggingIn: false,
      isSubmitting: false,
      error: null,
      loginError: null,
    }),
}));

export { getShippingOptionAmount };
