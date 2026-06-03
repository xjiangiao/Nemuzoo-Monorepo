import { create } from "zustand";
import medusaClient from "@/lib/medusa-client";
import type { Customer } from "@/types";

/**
 * Retrieves the currently authenticated customer from the storefront, optionally using a provided bearer token.
 *
 * @param token - Optional bearer token to include as `Authorization: Bearer <token>` when fetching the customer
 * @returns The retrieved `Customer`, or `null` if the response contains no customer
 */
async function getCurrentCustomer(token?: string): Promise<Customer | null> {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const { customer } = await medusaClient.store.customer.retrieve(
    undefined,
    headers
  );

  return customer as unknown as Customer;
}

/**
 * Authenticate a customer using their email and password against the Medusa auth endpoint.
 *
 * Performs a login with the "emailpass" strategy and updates the Medusa client session; any errors from the API propagate to the caller.
 */
async function authenticateCustomer(email: string, password: string) {
  await medusaClient.auth.login("customer", "emailpass", { email, password });
}

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    newsletterOptIn?: boolean
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  isAuthenticated: false,
  isLoading: true,
  hydrated: false,
  error: null,

  hydrate: async () => {
    try {
      const customer = await getCurrentCustomer();
      if (customer) {
        set({
          customer,
          isAuthenticated: true,
          isLoading: false,
          hydrated: true,
        });
        return;
      }
    } catch {
      // No active session
    }
    set({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
      hydrated: true,
    });
  },

  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      await authenticateCustomer(email, password);
      const customer = await getCurrentCustomer();
      set({
        customer,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch {
      set({ isLoading: false, error: "Invalid email or password." });
      return false;
    }
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    newsletterOptIn = false
  ): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const token = await medusaClient.auth.register("customer", "emailpass", {
        email,
        password,
      });

      const { customer } = await medusaClient.store.customer.create(
        {
          email,
          first_name: firstName,
          last_name: lastName,
        },
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      await authenticateCustomer(email, password);

      set({
        customer: customer as unknown as Customer,
        isAuthenticated: true,
        isLoading: false,
      });

      // Sync to Resend Registered Users segment (fire-and-forget)
      fetch("/api/resend/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newsletterOptIn }),
      }).catch(() => {});

      return true;
    } catch {
      set({
        isLoading: false,
        error: "Could not create account. This email may already be registered.",
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await medusaClient.auth.logout();
    } catch {
      // Proceed with local logout even if API call fails
    }
    set({
      customer: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
