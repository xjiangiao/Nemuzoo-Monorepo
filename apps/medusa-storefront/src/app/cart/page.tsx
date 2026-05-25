"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import StarDecoration from "@/components/ui/StarDecoration";

// Mock cart state — real implementation connects to Medusa cart API
interface CartLineItem {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string;
  quantity: number;
  unit_price: number;
  currency_code: string;
  variant?: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartLineItem[]>([]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

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
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <div>
          <CartSummary
            subtotal={subtotal}
            total={subtotal}
            currency_code={items[0]?.currency_code || "USD"}
          />
        </div>
      </div>
    </Container>
  );
}
