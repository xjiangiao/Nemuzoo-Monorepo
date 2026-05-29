import type { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Care & FAQ",
  description:
    "Care, shipping, gifting, and returns for Nemuzoo plush companions.",
};

const faqs = [
  {
    q: "Who are nemuzoo plush made for?",
    a: "For anyone who likes soft objects with a collectible feel: young design shoppers, gift buyers, kids who want a calm bedtime companion, and adults who want a quiet desk or sofa friend.",
  },
  {
    q: "How should I clean a plush?",
    a: "Spot clean with a mild soap and cool water, then air dry fully. Avoid bleach, high heat, and machine drying to protect the shape and surface texture.",
  },
  {
    q: "Do you offer gift packaging?",
    a: "Gift-ready styles are marked in the shop. Boxed sets include soft wrap and a note card area, so the order feels intentional without extra clutter.",
  },
  {
    q: "What is the return policy?",
    a: "Unused items can be returned or exchanged within 30 days of delivery. Please keep the original packaging and order number when possible so support can help quickly. Buyers are responsible for return shipping costs, and original shipping fees are non-refundable.",
  },
  {
    q: "When will my order ship?",
    a: "In-stock plush typically ship within 2-4 business days. Preorder and first-drop items show their estimated ship window on the product page.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide. Shipping costs and estimated delivery times are calculated at checkout based on your destination. International deliveries may be affected by customs processing and local postal service timing.",
  },
  {
    q: "Will I receive tracking?",
    a: "Yes. Once your order ships, you will receive a tracking number by email. Import duties, customs fees, or local taxes may apply on arrival and are the buyer's responsibility.",
  },
  {
    q: "What if my order arrives damaged or is lost?",
    a: "Contact us within 7 days of the estimated delivery date if an order arrives damaged or does not arrive. We will help with a replacement or refund depending on the situation.",
  },
];

export default function FAQPage() {
  return (
    <Container
      as="main"
      className="grid gap-10 py-14 lg:grid-cols-[0.55fr_1fr] lg:py-16"
    >
      <aside>
        <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-text-muted">
          care & support
        </p>
        <h1 className="mt-4 font-heading text-5xl font-black leading-tight text-text-primary sm:text-6xl">
          Shipping, cleaning, gifting, and returns.
        </h1>
        <div className="mt-8 rounded-[2rem] bg-white/55 p-6">
          <p className="text-sm leading-7 text-text-secondary">
            Made for US shoppers: clear delivery expectations, simple care
            language, and gift-friendly policies before checkout.
          </p>
        </div>
      </aside>

      <section className="space-y-4" aria-label="Frequently asked questions">
        {faqs.map((faq, index) => (
          <details
            key={faq.q}
            open={index === 0}
            className="group rounded-[2rem] bg-surface-elevated p-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-heading text-2xl font-black leading-tight text-text-primary">
              <span>{faq.q}</span>
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-subtle text-xl leading-none text-text-primary"
                aria-hidden="true"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:block">-</span>
              </span>
            </summary>
            <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
              {faq.a}
            </p>
          </details>
        ))}
      </section>
    </Container>
  );
}
