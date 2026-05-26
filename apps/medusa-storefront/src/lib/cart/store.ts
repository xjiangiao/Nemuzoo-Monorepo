import { create } from "zustand";
import medusaClient from "@/lib/medusa-client";

const cartFields =
  "*items,*items.variant,*items.variant.product,*region";

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
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  setCartId: (id: string) => void;
  setItems: (items: CartItem[]) => void;
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

function clearStoredCartId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

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
  items: [],
  isLoading: true,
  error: null,

  setCartId: (id: string) => {
    storeCartId(id);
    set({ cartId: id });
  },

  setItems: (items: CartItem[]) => set({ items }),

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
        items: mapItems(cart, cart.items),
        isLoading: false,
      });
    } catch {
      // Cart expired or invalid
      clearStoredCartId();
      set({ cartId: null, items: [], isLoading: false });
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
      set({ items: mapItems(cart, cart.items), error: null });
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

      set({ items: mapItems(cart, cart.items), error: null });
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

      set({ items: mapItems(cart, cart.items), error: null });
    } catch {
      set({ error: "Failed to remove item from cart." });
    }
  },

  clearCart: () => {
    clearStoredCartId();
    set({ cartId: null, items: [], isLoading: false, error: null });
  },
}));
