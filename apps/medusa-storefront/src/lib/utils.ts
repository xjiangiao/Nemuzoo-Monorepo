import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format((amount || 0) / 100);
}

export function getProductThumbnail(product: {
  thumbnail?: string;
  images?: Array<{ url: string }>;
}): string | undefined {
  return product.thumbnail || product.images?.[0]?.url;
}

export function getProductPrice(product: {
  variants?: Array<{
    calculated_price?: {
      calculated_amount?: number | null;
      currency_code?: string | null;
    } | null;
    prices?: Array<{ amount: number; currency_code: string }>;
  }> | null;
}): { amount: number; currency_code: string } | null {
  const variant = product.variants?.[0];
  const calculatedPrice = variant?.calculated_price;

  if (
    typeof calculatedPrice?.calculated_amount === "number" &&
    calculatedPrice.currency_code
  ) {
    return {
      amount: calculatedPrice.calculated_amount,
      currency_code: calculatedPrice.currency_code,
    };
  }

  return variant?.prices?.[0] || null;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
