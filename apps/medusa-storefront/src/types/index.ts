export interface Price {
  amount: number;
  currency_code: string;
}

export interface Variant {
  id: string;
  title: string;
  prices?: Price[];
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string;
  description?: string;
  images?: Array<{ url: string; alt?: string }>;
  variants?: Variant[];
  metadata?: Record<string, string>;
}

export interface CartItemData {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string;
  quantity: number;
  unit_price: number;
  variant?: string;
}

export interface CartSummaryData {
  subtotal: number;
  shipping?: number;
  tax?: number;
  total: number;
  currency_code: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  has_account: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
}
