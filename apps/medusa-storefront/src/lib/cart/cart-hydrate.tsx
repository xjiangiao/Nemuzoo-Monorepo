"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";

export function CartHydrate({ children }: { children: React.ReactNode }) {
  const hydrate = useCartStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
