import { create } from "zustand";
import medusaClient from "@/lib/medusa-client";

export const cartFields =
  "*items,*items.variant,*items.variant.product,*region";

export const checkoutCartFields =
  "*items,*items.variant,*items.variant.product,*region,*shipping_methods,*payment_collection";

export type CartAddressPayload = {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
};

export interface CheckoutCart {
  id: string;
  email?: string | null;
  currency_code: string;
  region_id?: string | null;
  subtotal?: number;
  item_subtotal?: number;
  shipping_total?: number;
  tax_total?: number;
  total?: number;
  shipping_address?: CartAddressPayload | null;
  items?: Array<{
    id: string;
    title: string;
    quantity: number;
    total?: number;
  }>;
  shipping_methods?: unknown[];
}

export interface CartItem {
  id: string;
  quantity: number;
  title: string;
  handle: string;
  thumbnail?: string;
  variant?: { title: string };
  unit_price: number;
  currency_code: string;
}

interface CartState {
  cartId: string | null;
  cart: CheckoutCart | null;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  setCartId: (id: string) => void;
  setItems: (items: CartItem[]) => void;
  retrieveCart: (fields?: string) => Promise<CheckoutCart | null>;
  transferCart: (fields?: string) => Promise<CheckoutCart | null>;
  updateCartRegion: (
    regionId: string,
    fields?: string
  ) => Promise<CheckoutCart | null>;
  updateCartAddress: (
    email: string,
    shippingAddress: CartAddressPayload,
    regionId?: string,
    billingAddress?: CartAddressPayload,
    fields?: string
  ) => Promise<CheckoutCart | null>;
  setCartFromResponse: (cart: any) => void;
  hydrate: () => Promise<void>;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "nemuzoo_cart_id";

function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_STORAGE_KEY);
}

function storeCartId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, id);
}

/**
 * Removes the persisted cart ID from localStorage.
 *
 * This is a no-op when executed outside a browser environment (for example, during SSR).
 */
function clearStoredCartId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

/**
 * Map Medusa cart line items into the local CartItem shape.
 *
 * @param cart - Medusa cart object; `cart.region.currency_code` is used to determine the `currency_code` fallback.
 * @param items - Optional array of Medusa cart line item objects. Each item may include `id`, `quantity`, `title`, `variant` (with `variant.product.handle`), `thumbnail`, and `unit_price`.
 * @returns An array of `CartItem` objects with fields `id`, `quantity` (defaults to `0`), `title` (defaults to `"Item"`), `handle` (from `variant.product.handle` or `""`), `thumbnail`, `variant`, `unit_price` (defaults to `0`), and `currency_code` (from `cart.region.currency_code` or `"USD"`).
 */
function mapItems(cart: any, items?: any[]): CartItem[] {
  return (items || []).map((item: any) => ({
    id: item.id,
    quantity: item.quantity || 0,
    title: item.title || "Item",
    handle: item.variant?.product?.handle || "",
    thumbnail: item.thumbnail,
    variant: item.variant,
    unit_price: item.unit_price || 0,
    currency_code: cart.region?.currency_code || "USD",
  }));
}

export const useCartStore = create<CartState>((set, get) => ({
  cartId: null,
  cart: null,
  items: [],
  isLoading: true,
  error: null,

  setCartId: (id: string) => {
    storeCartId(id);
    set({ cartId: id });
  },

  setItems: (items: CartItem[]) => set({ items }),

  setCartFromResponse: (cart: any) => {
    if (cart?.id) {
      storeCartId(cart.id);
    }

    set({
      cartId: cart?.id || null,
      cart: (cart || null) as CheckoutCart | null,
      items: mapItems(cart || {}, cart?.items),
      error: null,
    });
  },

  retrieveCart: async (fields = checkoutCartFields) => {
    const { cartId } = get();
    if (!cartId) return null;

    const { cart } = await medusaClient.store.cart.retrieve(cartId, {
      fields,
    });

    get().setCartFromResponse(cart);
    return cart as CheckoutCart;
  },

  transferCart: async (fields = checkoutCartFields) => {
    const { cartId } = get();
    if (!cartId) return null;

    const { cart } = await medusaClient.store.cart.transferCart(cartId, {
      fields,
    });

    get().setCartFromResponse(cart);
    return cart as CheckoutCart;
  },

  updateCartRegion: async (regionId: string, fields = checkoutCartFields) => {
    const { cartId } = get();
    if (!cartId) return null;

    const { cart } = await medusaClient.store.cart.update(
      cartId,
      {
        region_id: regionId,
      },
      { fields }
    );

    get().setCartFromResponse(cart);
    return cart as CheckoutCart;
  },

  updateCartAddress: async (
    email: string,
    shippingAddress: CartAddressPayload,
    regionId?: string,
    billingAddress?: CartAddressPayload,
    fields = checkoutCartFields
  ) => {
    const { cartId } = get();
    if (!cartId) return null;

    const { cart } = await medusaClient.store.cart.update(
      cartId,
      {
        email,
        ...(regionId ? { region_id: regionId } : {}),
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
      },
      { fields }
    );

    get().setCartFromResponse(cart);
    return cart as CheckoutCart;
  },

  hydrate: async () => {
    const storedId = getStoredCartId();
    if (!storedId) {
      set({ isLoading: false });
      return;
    }

    try {
      const { cart } = await medusaClient.store.cart.retrieve(storedId, {
        fields: cartFields,
      });
      set({
        cartId: storedId,
        cart: cart as CheckoutCart,
        items: mapItems(cart, cart.items),
        isLoading: false,
      });
    } catch {
      // Cart expired or invalid
      clearStoredCartId();
      set({ cartId: null, cart: null, items: [], isLoading: false });
    }
  },

  addToCart: async (variantId: string, quantity: number) => {
    const { cartId } = get();
    let currentCartId = cartId;

    if (!currentCartId) {
      const { cart } = await medusaClient.store.cart.create(
        {},
        { fields: cartFields }
      );
      currentCartId = cart.id;
      storeCartId(cart.id);
      set({ cartId: cart.id });
    }

    try {
      const { cart } = await medusaClient.store.cart.createLineItem(
        currentCartId!,
        {
          variant_id: variantId,
          quantity,
        },
        { fields: cartFields }
      );
      set({
        cart: cart as CheckoutCart,
        items: mapItems(cart, cart.items),
        error: null,
      });
    } catch (e) {
      set({ error: "Failed to add item to cart." });
      throw e;
    }
  },

  updateQuantity: async (lineId: string, quantity: number) => {
    const { cartId } = get();
    if (!cartId) return;

    try {
      let cart;
      if (quantity <= 0) {
        const response = await medusaClient.store.cart.deleteLineItem(
          cartId,
          lineId,
          { fields: cartFields }
        );
        cart = response.parent;
      } else {
        const response = await medusaClient.store.cart.updateLineItem(
          cartId,
          lineId,
          {
            quantity,
          },
          { fields: cartFields }
        );
        cart = response.cart;
      }

      if (!cart) {
        throw new Error("Cart response missing cart.");
      }

      set({
        cart: cart as CheckoutCart,
        items: mapItems(cart, cart.items),
        error: null,
      });
    } catch {
      set({ error: "Failed to update cart." });
    }
  },

  removeItem: async (lineId: string) => {
    const { cartId } = get();
    if (!cartId) return;

    try {
      const { parent: cart } = await medusaClient.store.cart.deleteLineItem(
        cartId,
        lineId,
        { fields: cartFields }
      );

      if (!cart) {
        throw new Error("Cart response missing cart.");
      }

      set({
        cart: cart as CheckoutCart,
        items: mapItems(cart, cart.items),
        error: null,
      });
    } catch {
      set({ error: "Failed to remove item from cart." });
    }
  },

  clearCart: () => {
    clearStoredCartId();
    set({ cartId: null, cart: null, items: [], isLoading: false, error: null });
  },
}));
