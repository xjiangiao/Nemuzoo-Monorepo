"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { CartHydrate } from "@/lib/cart/cart-hydrate";
import { AuthHydrate } from "@/lib/auth/auth-hydrate";

/**
 * Wraps application content with React Query and hydration providers for auth and cart state.
 *
 * The React Query client is configured to consider queries fresh for 60 seconds and to
 * disable refetching on window focus. Renders `AuthHydrate` which contains `CartHydrate`
 * and then the provided `children`.
 *
 * @param children - React nodes to render inside the providers
 * @returns A React element that provides React Query, authentication hydration, and cart hydration to `children`
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrate>
        <CartHydrate>{children}</CartHydrate>
      </AuthHydrate>
    </QueryClientProvider>
  );
}
