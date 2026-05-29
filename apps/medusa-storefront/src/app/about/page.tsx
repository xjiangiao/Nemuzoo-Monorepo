import type { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Brand Story",
  description:
    "Nemuzoo is a soft place to land: plush companions shaped by rounded arches, gentle curves, and quiet everyday comfort.",
};

const storyValues = [
  {
    number: "01",
    title: "Emotional comfort",
    description:
      "The plush expressions stay quiet so the owner can bring their own feeling to the object.",
  },
  {
    number: "02",
    title: "Collectible softness",
    description:
      "Muted colors and clean packaging make each companion feel giftable, photographable, and worth keeping.",
  },
  {
    number: "03",
    title: "Online-first clarity",
    description:
      "Size, touch, care, and use cases are written plainly so shoppers can choose with confidence.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Container className="grid gap-10 py-16 lg:grid-cols-[1fr_0.8fr] lg:py-20">
        <section>
          <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-text-muted">
            brand story
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-5xl font-black leading-[0.96] text-text-primary sm:text-6xl lg:text-7xl">
            nemuzoo is a soft place to land.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-text-secondary">
            The brand begins with a rounded wordmark: soft arches, gentle curves,
            and a quiet rhythm. The store carries that language into plush
            silhouettes, packaging, and care details that feel polished but easy
            to approach.
          </p>
        </section>

        <aside className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] bg-surface-secondary p-8">
          <div className="plush-oval soft-shadow absolute bottom-8 left-8 h-64 w-48 rounded-[48%_48%_38%_38%]" />
          <div className="absolute right-8 top-8 max-w-[240px] rounded-[2rem] bg-white/60 p-6 backdrop-blur">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-text-muted">
              design language
            </p>
            <p className="mt-3 font-heading text-2xl font-black leading-tight text-[#2E2E33]">
              soft arches
              <br />
              gentle curves
              <br />
              rounded rhythm
            </p>
          </div>
        </aside>
      </Container>

      <section className="border-y border-border-primary bg-white/45">
        <Container className="grid gap-6 py-14 md:grid-cols-3">
          {storyValues.map((value) => (
            <article
              key={value.number}
              className="rounded-[2rem] bg-surface-primary p-7"
            >
              <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                {value.number}
              </p>
              <h2 className="mt-4 font-heading text-2xl font-black text-text-primary">
                {value.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {value.description}
              </p>
            </article>
          ))}
        </Container>
      </section>
    </main>
  );
}
