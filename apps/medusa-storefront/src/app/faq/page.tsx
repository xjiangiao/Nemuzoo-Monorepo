import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import FAQAccordion from "@/components/faq/FAQAccordion";

export const metadata: Metadata = {
  title: "Use & FAQ",
  description:
    "Use, shipping, gifting, and returns for Nemuzoo everyday cultural goods.",
};

const faqs = [
  {
    q: "Who are Nemuzoo products made for?",
    a: "For people who like simple, useful objects: readers, students, desk workers, gift buyers, and anyone who prefers quiet materials over loud decoration.",
  },
  {
    q: "What is the first edition?",
    a: "The first edition begins with a book annotation kit: page markers, note cards, clips, and compact writing tools. Final contents are listed on each product page before checkout.",
  },
  {
    q: "Do you offer gift packaging?",
    a: "Gift-ready products are marked in the shop. Boxed sets include considered wrap and a note card area, so the order feels intentional without extra clutter.",
  },
  {
    q: "What is the return policy?",
    a: "Unused items can be returned or exchanged within 30 days of delivery. Please keep the original packaging and order number when possible so support can help quickly. Buyers are responsible for return shipping costs, and original shipping fees are non-refundable.",
  },
  {
    q: "When will my order ship?",
    a: "In-stock stationery typically ships within 2-4 business days. Preorder and first-edition items show their estimated ship window on the product page.",
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
          use & support
        </p>
        <h1 className="mt-4 font-heading text-5xl font-black leading-tight text-text-primary sm:text-6xl">
          Shipping, product details, gifting, and returns.
        </h1>
        <div className="mt-8 rounded-[2rem] bg-white/55 p-6">
          <p className="text-sm leading-7 text-text-secondary">
            Made for US shoppers: clear delivery expectations, plain material
            notes, and gift-friendly policies before checkout.
          </p>
        </div>
      </aside>

      <FAQAccordion items={faqs} />
    </Container>
  );
}
