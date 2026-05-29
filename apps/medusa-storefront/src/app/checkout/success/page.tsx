import Link from "next/link";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;

  return (
    <Container className="py-24 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          Thank you for your order
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Your companion is getting ready. We will send a confirmation email
          when the order has been processed.
        </p>
        {order_id && (
          <p className="mt-4 text-xs text-text-muted">
            Order ID: <span className="font-medium">{order_id}</span>
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="warm" href="/products">
            Browse More
          </Button>
          <Link
            href="/account"
            className="inline-flex h-10 items-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            View Account
          </Link>
        </div>
      </div>
    </Container>
  );
}
