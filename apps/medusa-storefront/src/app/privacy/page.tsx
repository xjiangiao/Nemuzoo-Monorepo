import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import StarDecoration from "@/components/ui/StarDecoration";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Nemuzoo privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <Container className="py-16 lg:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <StarDecoration variant="warm" size="sm" />
          <span className="text-sm text-warm tracking-widest uppercase font-heading">
            Privacy Policy
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
          Privacy Policy
        </h1>
        <p className="text-sm text-text-muted mb-10">
          Last updated: May 26, 2026
        </p>

        <div className="prose prose-sm prose-gray max-w-none space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Introduction
            </h2>
            <p style={{ fontWeight: 300 }}>
              Nemuzoo (&quot;we,&quot; &quot;our,&quot; or &rdquo;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you visit our website or subscribe to our newsletter.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Information We Collect
            </h2>
            <div className="space-y-2" style={{ fontWeight: 300 }}>
              <p>
                <strong>Email address</strong> — When you subscribe to our
                newsletter, we collect your email address with your explicit
                consent.
              </p>
              <p>
                <strong>Order information</strong> — When you make a purchase,
                we collect your name, shipping address, email, and payment
                details necessary to fulfill your order.
              </p>
              <p>
                <strong>Usage data</strong> — We collect anonymous browsing
                information (pages visited, time spent) to improve our site.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              How We Use Your Information
            </h2>
            <ul
              className="list-disc pl-5 space-y-1"
              style={{ fontWeight: 300 }}
            >
              <li>To send you newsletter updates you have subscribed to</li>
              <li>To process and fulfill your orders</li>
              <li>To communicate with you about your orders</li>
              <li>To improve our website and product offerings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Third-Party Services
            </h2>
            <div className="space-y-3" style={{ fontWeight: 300 }}>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Resend</strong> — Manages our newsletter email
                  delivery. Your email is stored securely on Resend&apos;s
                  servers in accordance with their privacy policy.
                </li>
                <li>
                  <strong>Cloudflare</strong> — Hosts and serves our website,
                  providing security and performance optimization.
                </li>
                <li>
                  <strong>Stripe</strong> — Processes payment transactions. We
                  never store your full payment details.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Your Rights
            </h2>
            <div className="space-y-2" style={{ fontWeight: 300 }}>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Unsubscribe</strong> — Click the unsubscribe link in
                  any email, or contact us to be removed from our list.
                </li>
                <li>
                  <strong>Access</strong> — Request a copy of the personal data
                  we hold about you.
                </li>
                <li>
                  <strong>Delete</strong> — Request that we delete your personal
                  data.
                </li>
                <li>
                  <strong>Correct</strong> — Update any inaccurate personal
                  information.
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:support@nemuzoo.com"
                  className="text-accent hover:text-accent-hover"
                >
                  support@nemuzoo.com
                </a>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Cookies
            </h2>
            <p style={{ fontWeight: 300 }}>
              We use only essential cookies required for the functioning of our
              store (cart management, session handling). We do not use tracking
              cookies or third-party advertising cookies. You can configure your
              browser to refuse cookies, but this may affect your shopping
              experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Data Retention
            </h2>
            <p style={{ fontWeight: 300 }}>
              We retain your personal data only as long as necessary to provide
              our services or as required by law. Newsletter subscribers&apos;
              data is retained until you unsubscribe. Order data is retained for
              accounting purposes as required by applicable tax laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Changes to This Policy
            </h2>
            <p style={{ fontWeight: 300 }}>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-text-primary font-heading mb-2">
              Contact
            </h2>
            <p style={{ fontWeight: 300 }}>
              If you have any questions about this Privacy Policy, please reach
              out:{" "}
              <a
                href="mailto:support@nemuzoo.com"
                className="text-accent hover:text-accent-hover"
              >
                support@nemuzoo.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
