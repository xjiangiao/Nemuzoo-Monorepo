"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/store";

/**
 * Ensures the authentication store is hydrated when the component mounts and renders its children.
 *
 * @param children - Elements to render once hydration is triggered
 * @returns The given `children` unchanged
 */
export function AuthHydrate({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
