import Link from "next/link";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StarDecoration from "@/components/ui/StarDecoration";

interface CollectionData {
  title: string;
  description: string;
  href: string;
}

const collections: CollectionData[] = [
  {
    title: "Sleepy Pals",
    description:
      "For those who need a little extra comfort at bedtime. Soft, huggable, and always ready to listen.",
    href: "/products?collection=sleepy-pals",
  },
  {
    title: "Dream Wanderers",
    description:
      "Curious souls with big personalities. They guard your dreams and inspire your mornings.",
    href: "/products?collection=dream-wanderers",
  },
];

export default function CollectionBanners() {
  return (
    <section className="py-20 lg:py-28 bg-[var(--color-surface-secondary)]">
      <Container>
        <SectionHeading
          title="Find Your Companion"
          subtitle="Every Nemuzoo doll belongs to a family. Which one calls to you?"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className="group bg-[var(--color-surface-elevated)] rounded-2xl p-8 lg:p-10 border border-[var(--color-border-primary)] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <StarDecoration size="sm" variant="warm" />
                <h3
                  className="text-xl font-medium text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {col.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {col.description}
              </p>
              <span className="inline-block mt-4 text-sm font-medium text-[var(--color-accent)] group-hover:text-[var(--color-accent-hover)] transition-colors">
                Explore &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
