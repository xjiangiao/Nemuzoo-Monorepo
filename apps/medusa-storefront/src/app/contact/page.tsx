import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import StarDecoration from "@/components/ui/StarDecoration";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nemuzoo — we would love to hear from you.",
};

/**
 * Renders the Contact page with support and order contact details.
 *
 * Displays a centered heading and descriptive paragraph, two bordered email
 * contact cards for general support and order inquiries, and a short
 * response-time note — all wrapped in the shared `Container`.
 *
 * @returns A JSX element representing the Contact page layout
 */
export default function ContactPage() {
  return (
    <Container className="py-16 lg:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <StarDecoration variant="warm" size="sm" />
          <span className="text-sm text-warm tracking-widest uppercase font-heading">
            Contact
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
          We Would Love to Hear from You
        </h1>
        <p className="text-base text-text-secondary mb-12 max-w-md mx-auto" style={{ fontWeight: 300 }}>
          Whether you have a question about a doll, need help with an order, or
          just want to say hello — we are here for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="bg-surface-elevated rounded-xl p-6 border border-border-primary">
            <h3 className="text-sm font-medium text-text-primary font-heading mb-2">
              Email
            </h3>
            <a
              href="mailto:support@nemuzoo.com"
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              support@nemuzoo.com
            </a>
          </div>
          <div className="bg-surface-elevated rounded-xl p-6 border border-border-primary">
            <h3 className="text-sm font-medium text-text-primary font-heading mb-2">
              Order Inquiries
            </h3>
            <a
              href="mailto:orders@nemuzoo.com"
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              orders@nemuzoo.com
            </a>
          </div>
        </div>

        <p className="mt-10 text-sm text-text-muted" style={{ fontWeight: 300 }}>
          We aim to respond within 24 hours on business days.
        </p>
      </div>
    </Container>
  );
}
