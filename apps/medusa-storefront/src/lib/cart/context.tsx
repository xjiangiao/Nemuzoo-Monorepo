"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import medusaClient from "@/lib/medusa-client";

interface CartItem {
  id: string;
  quantity: number;
  title: string;
  handle: string;
  thumbnail?: string;
  variant?: { title: string };
  unit_price: number;
  currency_code: string;
}

interface CartContextValue {
  cartId: string | null;
  itemCount: number;
  items: CartItem[];
  isLoading: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "nemuzoo_cart_id";

function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_STORAGE_KEY);
}

function storeCartId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, id);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate cart ID from localStorage on mount
  useEffect(() => {
    const stored = getStoredCartId();
    if (stored) {
      setCartId(stored);
    }
    setIsLoading(false);
  }, []);

  // Fetch/refresh cart items whenever cartId changes
  useEffect(() => {
    if (!cartId) {
      setItems([]);
      return;
    }

    medusaClient.carts
      .retrieve(cartId)
      .then(({ cart }) => {
        setItems(
          (cart.items || []).map((item: any) => ({
            id: item.id,
            quantity: item.quantity || 0,
            title: item.title || "Item",
            handle: item.variant?.product?.handle || "",
            thumbnail: item.thumbnail,
            variant: item.variant,
            unit_price: item.unit_price || 0,
            currency_code: cart.region?.currency_code || "USD",
          }))
        );
      })
      .catch(() => {
        // Cart may have expired — clear it
        setCartId(null);
        localStorage.removeItem(CART_STORAGE_KEY);
        setItems([]);
      });
  }, [cartId]);

  const addToCart = useCallback(
    async (variantId: string, quantity: number) => {
      let currentCartId = cartId;

      // Create cart if none exists
      if (!currentCartId) {
        const { cart } = await medusaClient.carts.create();
        currentCartId = cart.id;
        storeCartId(cart.id);
        setCartId(cart.id);
      }

      await medusaClient.carts.lineItems.create(currentCartId!, {
        variant_id: variantId,
        quantity,
      });

      // Refresh cart items
      const { cart } = await medusaClient.carts.retrieve(currentCartId!);
      setItems(
        (cart.items || []).map((item: any) => ({
          id: item.id,
          quantity: item.quantity || 0,
          title: item.title || "Item",
          handle: item.variant?.product?.handle || "",
          thumbnail: item.thumbnail,
          variant: item.variant,
          unit_price: item.unit_price || 0,
          currency_code: cart.region?.currency_code || "USD",
        }))
      );
    },
    [cartId]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return;

      if (quantity <= 0) {
        await removeItem(lineId);
        return;
      }

      await medusaClient.carts.lineItems.update(cartId, lineId, {
        quantity,
      });

      const { cart } = await medusaClient.carts.retrieve(cartId);
      setItems(
        (cart.items || []).map((item: any) => ({
          id: item.id,
          quantity: item.quantity || 0,
          title: item.title || "Item",
          handle: item.variant?.product?.handle || "",
          thumbnail: item.thumbnail,
          variant: item.variant,
          unit_price: item.unit_price || 0,
          currency_code: cart.region?.currency_code || "USD",
        }))
      );
    },
    [cartId]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cartId) return;

      await medusaClient.carts.lineItems.delete(cartId, lineId);

      const { cart } = await medusaClient.carts.retrieve(cartId);
      setItems(
        (cart.items || []).map((item: any) => ({
          id: item.id,
          quantity: item.quantity || 0,
          title: item.title || "Item",
          handle: item.variant?.product?.handle || "",
          thumbnail: item.thumbnail,
          variant: item.variant,
          unit_price: item.unit_price || 0,
          currency_code: cart.region?.currency_code || "USD",
        }))
      );
    },
    [cartId]
  );

  return (
    <CartContext.Provider
      value={{
        cartId,
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        items,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
