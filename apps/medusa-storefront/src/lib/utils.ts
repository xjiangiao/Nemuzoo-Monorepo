import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Compose and normalize multiple class value inputs into a single Tailwind-compatible class string.
 *
 * @param inputs - Class values (strings, arrays, objects) to be combined
 * @returns The resulting class string with duplicate or conflicting Tailwind utilities merged
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a cent-based amount as a localized currency string for en-US.
 *
 * @param amount - The monetary amount in cents; falsy values are treated as 0.
 * @param currency - The ISO 4217 currency code to use; if falsy, `"USD"` is used.
 * @returns The formatted currency string (en-US), e.g. `"$1.00"`.
 */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format((amount || 0) / 100);
}

/**
 * Selects the product's thumbnail URL.
 *
 * Prefers `product.thumbnail` when present; otherwise uses the first image URL from `product.images`.
 *
 * @param product - Product-like object to extract the thumbnail from.
 * @returns The thumbnail URL as a string if available, `undefined` otherwise.
 */
export function getProductThumbnail(product: {
  thumbnail?: string;
  images?: Array<{ url: string }>;
}): string | undefined {
  return product.thumbnail || product.images?.[0]?.url;
}

/**
 * Selects a price for the product from its first variant, preferring a valid calculated price.
 *
 * @param product - Product object whose first variant will be inspected for pricing information
 * @returns `{ amount: number; currency_code: string }` if a price is found, `null` otherwise
 */
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

/**
 * Format a Date or date string as "Month day, year" using US English.
 *
 * @param date - A Date object or a string parseable by the JavaScript Date constructor
 * @returns The formatted date string, e.g. "January 1, 2020"
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
