import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import StarDecoration from "@/components/ui/StarDecoration";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Nemuzoo shipping information and return policy — worldwide shipping with easy 30-day returns.",
};

export default function ShippingPage() {
  return (
    <Container className="py-16 lg:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <StarDecoration variant="warm" size="sm" />
          <span className="text-sm text-warm tracking-widest uppercase font-heading">
            Shipping & Returns
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-10 font-heading">
          Shipping & Returns
        </h1>

        <div className="space-y-10 text-text-secondary leading-relaxed">
          {/* Shipping */}
          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-3">
              Shipping
            </h2>
            <div className="space-y-3" style={{ fontWeight: 300 }}>
              <p>
                Every Nemuzoo doll is made with care. Please allow{" "}
                <strong>3–5 business days</strong> for processing before your
                order ships.
              </p>
              <p>
                We ship worldwide. Shipping costs and estimated delivery times
                are calculated at checkout based on your destination.
              </p>
              <p>
                Once shipped, you will receive a tracking number via email.
                International deliveries typically take 7–14 business days
                depending on customs processing and local postal service.
              </p>
              <p>
                Please note that import duties, customs fees, or taxes may apply
                upon arrival in your country. These are the responsibility of the
                buyer and are not included in our shipping charges.
              </p>
            </div>
          </section>

          {/* Returns */}
          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-3">
              Returns & Exchanges
            </h2>
            <div className="space-y-3" style={{ fontWeight: 300 }}>
              <p>
                We want you to love your companion. If you are not completely
                satisfied, you may return or exchange your item within{" "}
                <strong>30 days of delivery</strong>.
              </p>
              <p>To be eligible for a return:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Items must be unused and in the same condition as received
                </li>
                <li>
                  The original packaging (soft cotton bag) must be included
                </li>
                <li>
                  A proof of purchase or order number is required
                </li>
              </ul>
              <p className="mt-3">
                The buyer is responsible for return shipping costs. Original
                shipping fees are non-refundable.
              </p>
              <p>
                To start a return, email us at{" "}
                <a
                  href="mailto:support@nemuzoo.com"
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  support@nemuzoo.com
                </a>{" "}
                with your order number and reason for return. We will guide you
                through the process.
              </p>
            </div>
          </section>

          {/* Damaged or Lost */}
          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-3">
              Damaged or Lost Items
            </h2>
            <p style={{ fontWeight: 300 }}>
              If your order arrives damaged or does not arrive at all, please
              contact us within 7 days of the estimated delivery date. We will
              make it right — either with a replacement or a full refund
              including shipping costs.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
