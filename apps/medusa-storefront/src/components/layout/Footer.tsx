import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";

const footerLinks = {
  shop: [
    { label: "All Dolls", href: "/products" },
    { label: "Sleepy Pals", href: "/products?collection=sleepy-pals" },
    { label: "Dream Wanderers", href: "/products?collection=dream-wanderers" },
  ],
  company: [
    { label: "About Nemuzoo", href: "/about" },
    { label: "Care & FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-primary bg-surface-primary py-10">
      <Container>
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex"
              aria-label="Nemuzoo home"
            >
              <Image
                src="/nemuzoo-wordmark.svg"
                alt="nemuzoo"
                width={148}
                height={22}
                className="h-6 w-auto opacity-80"
              />
            </Link>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Soft companions for bedrooms, desks, gifting, and gentle everyday rituals.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
              Shop
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
              Policies
            </h4>
            <ul className="space-y-2">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-primary pt-8 text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Nemuzoo. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
