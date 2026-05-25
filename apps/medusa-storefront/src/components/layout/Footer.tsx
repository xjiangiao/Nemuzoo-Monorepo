import Link from "next/link";
import Container from "@/components/layout/Container";

const footerLinks = {
  shop: [
    { label: "All Dolls", href: "/products" },
    { label: "Sleepy Pals", href: "/products?collection=sleepy-pals" },
    { label: "Dream Wanderers", href: "/products?collection=dream-wanderers" },
  ],
  company: [
    { label: "About Nemuzoo", href: "/about" },
    { label: "FAQ", href: "#" },
    { label: "Contact", href: "#" },
  ],
  policies: [
    { label: "Shipping & Returns", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-muted)] border-t border-[var(--color-border-primary)] pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Nemuzoo
            </Link>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Knitted companions for quiet nights and gentle hearts.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Shop
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Policies
            </h4>
            <ul className="space-y-2">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border-primary)] pt-8 text-center text-sm text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Nemuzoo. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
