import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Brand Story",
  description:
    "Nemuzoo makes quiet cultural goods for reading, writing, storage, and simple daily routines.",
};

const storyValues = [
  {
    number: "01",
    title: "Plain usefulness",
    description:
      "Every object should be easy to understand, easy to use, and quiet enough to keep nearby.",
  },
  {
    number: "02",
    title: "Material calm",
    description:
      "Neutral colors, paper textures, fabric, and metal details keep the brand practical and warm.",
  },
  {
    number: "03",
    title: "Online-first clarity",
    description:
      "Dimensions, materials, contents, and use cases are written plainly so shoppers can choose with confidence.",
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
            nemuzoo is for the small routines that make a day feel ordered.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-text-secondary">
            The first product happens to live with books. The wider brand is
            about useful, modest objects for reading, writing, organizing, and
            carrying what you need.
          </p>
        </section>

        <aside className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] bg-surface-secondary p-8">
          <Image
            src="/book-annotation-kit-hero.png"
            alt="Book annotation kit arranged on warm paper"
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2F2B25]/34 via-transparent to-transparent" />
          <div className="absolute right-8 top-8 max-w-[240px] rounded-[1.5rem] bg-white/70 p-6 backdrop-blur">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-text-muted">
              design language
            </p>
            <p className="mt-3 font-heading text-2xl font-black leading-tight text-[#2F2B25]">
              plain paper
              <br />
              natural fabric
              <br />
              useful forms
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
