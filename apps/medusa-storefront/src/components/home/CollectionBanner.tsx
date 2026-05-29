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
    <section className="bg-surface-secondary py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="Find Your Companion"
          subtitle="Every Nemuzoo doll belongs to a family. Which one calls to you?"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {collections.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className="soft-shadow group rounded-[2rem] border border-border-primary bg-surface-elevated p-8 transition-colors hover:bg-white/70 lg:p-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <StarDecoration size="sm" variant="accent" />
                <h3
                  className="font-heading text-2xl font-black text-text-primary"
                >
                  {col.title}
                </h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {col.description}
              </p>
              <span className="mt-5 inline-block text-sm font-bold text-text-primary underline decoration-text-primary/20 underline-offset-8 transition-colors group-hover:decoration-text-primary/50">
                Explore &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
