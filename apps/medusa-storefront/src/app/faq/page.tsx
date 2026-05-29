import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import StarDecoration from "@/components/ui/StarDecoration";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Nemuzoo dolls — materials, care, shipping, and more.",
};

const faqs = [
  {
    q: "What are Nemuzoo dolls made of?",
    a: "Each doll is hand-knitted using carefully selected natural yarns. The filling is hypoallergenic polyester fiber, making them soft, lightweight, and safe for all ages.",
  },
  {
    q: "Are Nemuzoo dolls machine washable?",
    a: "We recommend gentle hand wash in lukewarm water with mild detergent. Gently squeeze out water — do not wring. Lay flat to dry in a shaded spot. This keeps your doll soft and shaped for years.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are processed within 3–5 business days. Shipping times vary by destination — typically 7–14 business days for international orders. You will receive a tracking number once your order ships.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide. International shipping costs are calculated at checkout. Please note that customs fees or import duties may apply depending on your country.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 30 days of delivery. Items must be unused and in original condition. The buyer is responsible for return shipping costs. See our Shipping & Returns page for full details.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "We can modify or cancel orders within 24 hours of placement. After that, the order may already be in processing. Contact us as soon as possible and we will do our best to help.",
  },
  {
    q: "Are these dolls suitable for children?",
    a: "Nemuzoo dolls are designed as emotional companions for all ages. They are made with safe, non-toxic materials. However, they are not intended as toys for infants or young children due to small parts.",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "Currently we do not offer gift wrapping, but each doll is carefully packaged in a soft cotton bag — ready to gift as is.",
  },
];

/**
 * Render the Frequently Asked Questions page with an accordion-style list of questions and answers.
 *
 * The component displays a centered header with a decorative accent and maps a list of question/answer
 * pairs to interactive `<details>` elements that reveal each answer.
 *
 * @returns The JSX element representing the FAQ page layout with accordion items.
 */
export default function FAQPage() {
  return (
    <Container className="py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <StarDecoration variant="accent" size="sm" />
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
            FAQ
          </span>
        </div>
        <h1 className="mb-10 font-heading text-5xl font-black text-text-primary lg:text-6xl">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-[2rem] border border-border-primary bg-surface-elevated p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-text-primary transition-colors hover:text-accent">
                <span>{faq.q}</span>
                <span className="text-text-muted group-open:rotate-180 transition-transform shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Container>
  );
}
