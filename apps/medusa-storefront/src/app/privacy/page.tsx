import type { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Nemuzoo privacy policy: how we collect, use, and protect your personal information.",
};

const sections = [
  {
    title: "Introduction",
    body: [
      'Nemuzoo ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or subscribe to our newsletter.',
    ],
  },
  {
    title: "Information we collect",
    body: [
      "Email address: when you subscribe to our newsletter, we collect your email address with your explicit consent.",
      "Order information: when you make a purchase, we collect your name, shipping address, email, and payment details necessary to fulfill your order.",
      "Usage data: we collect anonymous browsing information, such as pages visited and time spent, to improve our site.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "To send newsletter updates you have subscribed to.",
      "To process and fulfill your orders.",
      "To communicate with you about your orders.",
      "To improve our website and product offerings.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "Resend manages our newsletter email delivery. Your email is stored securely on Resend's servers in accordance with their privacy policy.",
      "Cloudflare hosts and serves our website, providing security and performance optimization.",
      "Stripe processes payment transactions. We never store your full payment details.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You may unsubscribe from emails, request a copy of the personal data we hold about you, ask us to delete your data, or correct inaccurate personal information.",
      "To exercise these rights, contact us at support@nemuzoo.com.",
    ],
  },
  {
    title: "Cookies and retention",
    body: [
      "We use essential cookies required for cart management and session handling. We do not use tracking cookies or third-party advertising cookies.",
      "We retain personal data only as long as necessary to provide our services or as required by law. Newsletter data is retained until you unsubscribe, and order data is retained for accounting purposes.",
    ],
  },
  {
    title: "Changes and contact",
    body: [
      'We may update this Privacy Policy from time to time by posting the new policy on this page and updating the "Last updated" date.',
      "If you have questions about this Privacy Policy, reach out to support@nemuzoo.com.",
    ],
  },
];

export default function PrivacyPage() {
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
          Privacy, data, and quiet boundaries.
        </h1>
        <div className="mt-8 rounded-[2rem] bg-white/55 p-6">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
            last updated
          </p>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            May 26, 2026. We collect only what is needed to run the shop, fulfill
            orders, and send updates you ask for.
          </p>
        </div>
      </aside>

      <section className="space-y-4" aria-label="Privacy policy sections">
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
