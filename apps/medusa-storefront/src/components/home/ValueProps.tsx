import Container from "@/components/layout/Container";
import FadeInView from "@/components/ui/FadeInView";
import { BookOpen, Bookmark, PackageCheck } from "lucide-react";

const values = [
  {
    icon: <BookOpen size={28} />,
    title: "Useful before expressive",
    description:
      "Each object starts with a clear job, then keeps its shape, color, and language quiet.",
  },
  {
    icon: <Bookmark size={28} />,
    title: "Made for daily surfaces",
    description:
      "The first kit belongs near books and notebooks, but the brand is built for desks, shelves, bags, and small routines.",
  },
  {
    icon: <PackageCheck size={28} />,
    title: "Ready to give",
    description:
      "Plain packaging and practical contents make each edition easy to use, easy to keep, and easy to gift.",
  },
];

export default function ValueProps() {
  return (
    <section className="border-y border-border-primary bg-surface-secondary py-14 lg:py-20">
      <Container>
        <FadeInView>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {values.map((v, index) => (
              <article
                key={v.title}
                className="rounded-[1.75rem] border border-border-primary bg-surface-primary/72 p-6 backdrop-blur md:p-7"
              >
                <p className="mb-5 font-heading text-xs font-bold uppercase tracking-[0.24em] text-text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle text-text-primary">
                  {v.icon}
                </div>
                <h3
                  className="mb-3 font-heading text-2xl font-black leading-tight text-text-primary"
                >
                  {v.title}
                </h3>
                <p className="text-sm leading-7 text-text-secondary">
                  {v.description}
                </p>
              </article>
            ))}
          </div>
        </FadeInView>
      </Container>
    </section>
  );
}
