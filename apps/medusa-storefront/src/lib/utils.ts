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
  variants?: Array<{ prices?: Array<{ amount: number; currency_code: string }> }>;
}): { amount: number; currency_code: string } | null {
  const price = product.variants?.[0]?.prices?.[0];
  return price || null;
}
