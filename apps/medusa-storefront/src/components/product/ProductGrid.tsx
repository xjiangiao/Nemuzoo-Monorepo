import ProductCard from "@/components/product/ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    images?: Array<{ url: string; alt?: string }>;
    variants?: Array<{
      calculated_price?: {
        calculated_amount?: number | null;
        currency_code?: string | null;
      } | null;
      prices?: Array<{ amount: number; currency_code: string }>;
    }> | null;
    metadata?: Record<string, unknown> | null;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2 gap-6",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8",
};

export default function ProductGrid({
  products,
  columns = 3,
  className = "",
}: ProductGridProps) {
  return (
    <div className={`grid ${columnClasses[columns]} ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
