import type { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Nemuzoo terms of service: conditions for using our website and purchasing our products.",
};

const sections = [
  {
    title: "Acceptance of terms",
    body: [
      'By accessing or purchasing from Nemuzoo ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services.',
    ],
  },
  {
    title: "Products",
    body: [
      "All Nemuzoo dolls are hand-knitted, which means each piece is unique. Slight variations in size, texture, and color are natural characteristics of handmade goods and are not considered defects.",
      "Product images are for illustration purposes. Actual colors may vary slightly due to yarn dye lots, lighting, and screen settings.",
    ],
  },
  {
    title: "Pricing and payment",
    body: [
      "All prices are listed in US Dollars (USD) and are subject to change without notice. The price at the time of purchase is the price you pay.",
      "We accept major credit cards and payment methods shown at checkout. Payment is processed securely through Stripe. We do not store your full payment details.",
    ],
  },
  {
    title: "Orders",
    body: [
      "By placing an order, you agree to provide accurate and complete information. We reserve the right to cancel or refuse any order at our discretion.",
      "If your order is cancelled after payment, you will receive a full refund.",
    ],
  },
  {
    title: "Shipping and returns",
    body: [
      "Shipping times are estimates and not guaranteed. We are not responsible for delays caused by customs, postal services, or events outside our control.",
      "Returns are accepted within 30 days of delivery as outlined in Care & FAQ. Refunds are processed to the original payment method within 5 to 10 business days after we receive the returned item.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "All content on this website, including product designs, images, text, logos, and brand name, is the property of Nemuzoo and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, or use our content without written permission.",
    ],
  },
  {
    title: "Liability and governing law",
    body: [
      "Nemuzoo shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability is limited to the purchase price of the product in question.",
      "These terms are governed by the laws of the jurisdiction in which Nemuzoo operates. Any disputes shall be resolved through good-faith negotiation before seeking legal recourse.",
    ],
  },
  {
    title: "Changes and contact",
    body: [
      "We reserve the right to update these terms at any time. Changes take effect immediately upon posting. Continued use of our website after changes constitutes acceptance of the new terms.",
      "For questions about these terms, reach out at support@nemuzoo.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <Container
      as="main"
      className="grid gap-10 py-14 lg:grid-cols-[0.55fr_1fr] lg:py-16"
    >
      <aside>
        <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-text-muted">
          policies
        </p>
        <h1 className="mt-4 font-heading text-5xl font-black leading-tight text-text-primary sm:text-6xl">
          Terms for a clear, soft checkout.
        </h1>
        <div className="mt-8 rounded-[2rem] bg-white/55 p-6">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
            last updated
          </p>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            May 26, 2026. These terms cover using the site, buying plush
            companions, payments, shipping, returns, and brand content.
          </p>
        </div>
      </aside>

      <section className="space-y-4" aria-label="Terms of service sections">
        {sections.map((section, index) => (
          <article
            key={section.title}
            className="rounded-[2rem] bg-surface-elevated p-6"
          >
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-3 font-heading text-2xl font-black text-text-primary">
              {section.title}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-text-secondary">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </Container>
  );
}
