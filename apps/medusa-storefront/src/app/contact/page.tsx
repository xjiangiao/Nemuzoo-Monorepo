import type { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nemuzoo for plush, order, and care support.",
};

const contacts = [
  {
    label: "General support",
    email: "support@nemuzoo.com",
    description: "Care questions, product details, gifting, and anything soft.",
  },
  {
    label: "Order help",
    email: "orders@nemuzoo.com",
    description: "Shipping updates, returns, exchanges, and order changes.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Container className="grid gap-10 py-14 lg:grid-cols-[0.85fr_1fr] lg:py-16">
        <section>
          <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-text-muted">
            contact
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-5xl font-black leading-[0.96] text-text-primary sm:text-6xl lg:text-7xl">
            Questions, order help, or a soft hello.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-text-secondary">
            Tell us what you need and we will point you to the clearest next
            step. We aim to respond within 24 hours on business days.
          </p>
        </section>

        <section className="relative overflow-hidden rounded-[2.5rem] bg-surface-secondary p-6 md:p-8">
          <div className="grain absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative grid gap-5">
            {contacts.map((item) => (
              <article
                key={item.email}
                className="rounded-[2rem] bg-white/65 p-6 backdrop-blur"
              >
                <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                  {item.label}
                </p>
                <a
                  href={`mailto:${item.email}`}
                  className="mt-3 block break-words font-heading text-2xl font-black text-[#2E2E33] transition-colors hover:text-[#5C5963]"
                >
                  {item.email}
                </a>
                <p className="mt-3 text-sm leading-7 text-[#2E2E33]/65">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Container>

      <section className="border-y border-border-primary bg-white/45">
        <Container className="grid gap-6 py-14 md:grid-cols-3">
          <article className="rounded-[2rem] bg-surface-primary p-7">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
              01
            </p>
            <h2 className="mt-4 font-heading text-2xl font-black text-text-primary">
              Include your order number
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              It helps us find shipping, returns, and product details quickly.
            </p>
          </article>
          <article className="rounded-[2rem] bg-surface-primary p-7">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
              02
            </p>
            <h2 className="mt-4 font-heading text-2xl font-black text-text-primary">
              Send a photo when useful
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              For care questions or damaged packages, one clear image is enough.
            </p>
          </article>
          <article className="rounded-[2rem] bg-surface-primary p-7">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
              03
            </p>
            <h2 className="mt-4 font-heading text-2xl font-black text-text-primary">
              Check Care & FAQ first
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Shipping, cleaning, gifting, and returns now live together there.
            </p>
          </article>
        </Container>
      </section>
    </main>
  );
}
