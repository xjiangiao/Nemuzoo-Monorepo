import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import StarDecoration from "@/components/ui/StarDecoration";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Nemuzoo terms of service — conditions for using our website and purchasing our products.",
};

/**
 * Render the Terms of Service page for Nemuzoo.
 *
 * Renders a styled, responsive page containing the Terms of Service content,
 * including sections for Acceptance of Terms, Products, Pricing & Payment,
 * Orders, Shipping & Delivery, Returns & Refunds, Intellectual Property,
 * Limitation of Liability, Governing Law, Changes to Terms, and Contact.
 *
 * @returns The Terms of Service page as a React element.
 */
export default function TermsPage() {
  return (
    <Container className="py-16 lg:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <StarDecoration variant="warm" size="sm" />
          <span className="text-sm text-warm tracking-widest uppercase font-heading">
            Terms of Service
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
          Terms of Service
        </h1>
        <p className="text-sm text-text-muted mb-10">
          Last updated: May 26, 2026
        </p>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Acceptance of Terms
            </h2>
            <p style={{ fontWeight: 300 }}>
              By accessing or purchasing from Nemuzoo ("we," "our," or "us"), you
              agree to be bound by these Terms of Service. If you do not agree,
              please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Products
            </h2>
            <div className="space-y-2" style={{ fontWeight: 300 }}>
              <p>
                All Nemuzoo dolls are hand-knitted, which means each piece is
                unique. Slight variations in size, texture, and color are natural
                characteristics of handmade goods and are not considered defects.
              </p>
              <p>
                Product images are for illustration purposes. Actual colors may
                vary slightly due to yarn dye lots, lighting, and screen
                settings.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
                Pricing & Payment
            </h2>
            <div className="space-y-2" style={{ fontWeight: 300 }}>
              <p>
                All prices are listed in US Dollars (USD) and are subject to
                change without notice. The price at the time of purchase is the
                price you pay.
              </p>
              <p>
                We accept major credit cards and payment methods as displayed at
                checkout. Payment is processed securely through Stripe. We do not
                store your full payment details.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Orders
            </h2>
            <div className="space-y-2" style={{ fontWeight: 300 }}>
              <p>
                By placing an order, you agree to provide accurate and complete
                information. We reserve the right to cancel or refuse any order
                at our discretion.
              </p>
              <p>
                If your order is cancelled after payment, you will receive a full
                refund.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Shipping & Delivery
            </h2>
            <p style={{ fontWeight: 300 }}>
              Shipping times are estimates and not guaranteed. We are not
              responsible for delays caused by customs, postal services, or
              events outside our control. Risk of loss passes to you upon
              delivery to the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Returns & Refunds
            </h2>
            <p style={{ fontWeight: 300 }}>
              Returns are accepted within 30 days of delivery as outlined in our
              Shipping & Returns policy. Refunds are processed to the original
              payment method within 5–10 business days after we receive the
              returned item.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Intellectual Property
            </h2>
            <p style={{ fontWeight: 300 }}>
              All content on this website — including product designs, images,
              text, logos, and brand name — is the property of Nemuzoo and is
              protected by applicable intellectual property laws. You may not
              reproduce, distribute, or use our content without written
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Limitation of Liability
            </h2>
            <p style={{ fontWeight: 300 }}>
              Nemuzoo shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our products or
              website. Our total liability is limited to the purchase price of
              the product in question.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Governing Law
            </h2>
            <p style={{ fontWeight: 300 }}>
              These terms are governed by the laws of the jurisdiction in which
              Nemuzoo operates. Any disputes shall be resolved through
              good-faith negotiation before seeking legal recourse.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Changes to Terms
            </h2>
            <p style={{ fontWeight: 300 }}>
              We reserve the right to update these terms at any time. Changes
              take effect immediately upon posting. Continued use of our website
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Contact
            </h2>
            <p style={{ fontWeight: 300 }}>
              For questions about these terms, reach out at{" "}
              <a
                href="mailto:support@nemuzoo.com"
                className="text-accent hover:text-accent-hover transition-colors"
              >
                support@nemuzoo.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
