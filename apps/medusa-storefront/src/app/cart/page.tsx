"use client";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import StarDecoration from "@/components/ui/StarDecoration";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { useCartStore } from "@/lib/cart/store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (isLoading) {
    return (
      <Container className="py-16 lg:py-20">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="flex-row" />
          ))}
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-16 lg:py-20">
        <EmptyState
          icon={<StarDecoration variant="muted" size="lg" />}
          title="Your cart is ready for a companion"
          description="Browse our collection and find the doll that speaks to you."
          action={
            <Button variant="warm" href="/products">
              Browse Dolls
            </Button>
          }
        />
      </Container>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  return (
    <Container className="py-16 lg:py-20">
      <SectionHeading
        title="Your Cart"
        alignment="left"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
              onRemove={(id) => removeItem(id)}
            />
          ))}
        </div>

        <div>
          <CartSummary
            subtotal={subtotal}
            total={subtotal}
            currency_code={items[0]?.currency_code || "USD"}
            checkoutHref="/checkout"
          />
        </div>
      </div>
    </Container>
  );
}
