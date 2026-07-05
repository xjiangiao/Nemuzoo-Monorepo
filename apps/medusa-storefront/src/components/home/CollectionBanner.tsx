import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SurfaceCard from "@/components/ui/SurfaceCard";

interface CollectionData {
  title: string;
  description: string;
  href: string;
}

const collections: CollectionData[] = [
  {
    title: "Reading",
    description:
      "Simple tools for marking pages, keeping notes, and returning to useful ideas.",
    href: "/products?collection=annotation-kit",
  },
  {
    title: "Everyday Desk",
    description:
      "Small objects for writing, sorting, storing, and making a work surface feel settled.",
    href: "/products?collection=desk-editions",
  },
];

export default function CollectionBanners() {
  return (
    <section className="bg-surface-secondary py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="For ordinary routines"
          subtitle="The first drop starts with books and notes, then leaves room for everyday goods beyond the page."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {collections.map((col) => (
            <SurfaceCard
              key={col.title}
              href={col.href}
              className="group block p-8 lg:p-10"
            >
              <div className="relative mb-4">
                <h3
                  className="font-heading text-2xl font-black text-text-primary"
                >
                  {col.title}
                </h3>
              </div>
              <p className="relative text-sm text-text-secondary leading-relaxed">
                {col.description}
              </p>
              <span className="relative mt-5 inline-block text-sm font-bold text-text-primary underline decoration-text-primary/20 underline-offset-8 transition-colors group-hover:decoration-text-primary/50">
                Explore &rarr;
              </span>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
