import Image from "next/image";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

/**
 * Render the homepage hero section with a product-led headline, subtitle, call-to-action buttons, and editorial product image.
 *
 * @returns The hero section JSX element containing background decorations, centered marketing content, and a CTA button.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid min-h-[calc(100vh-72px)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-16">
        <div className="relative z-10">
          <p className="mb-5 font-heading text-xs font-bold uppercase tracking-[0.24em] text-text-muted">
            quiet goods for reading and everyday desks
          </p>
          <h1 className="max-w-3xl font-heading text-5xl font-black leading-[0.95] text-text-primary sm:text-6xl lg:text-8xl">
            Simple things for thoughtful days.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-text-secondary">
            Nemuzoo makes understated cultural goods for reading, writing,
            storage, and small daily routines. The first edition begins with a
            book annotation kit.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button variant="warm" size="lg" href="/products">
              Shop first edition
            </Button>
            <Button variant="outline" size="lg" href="/about">
              About Nemuzoo
            </Button>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
            <span>Plain materials</span>
            <span>Everyday use</span>
            <span>Gift-ready</span>
          </div>
        </div>

        <div className="quiet-shadow relative mx-auto aspect-[0.9/1] w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-border-primary bg-surface-secondary">
          <Image
            src="/book-annotation-kit-hero.png"
            alt="Book annotation kit with an open book, tabs, brass clips, cards, and writing tools"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2F2B25]/38 via-transparent to-transparent" />
          <div className="absolute bottom-[8%] left-[8%] right-[8%] rounded-[1.5rem] border border-white/60 bg-white/72 p-5 backdrop-blur">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-text-muted">
              first product
            </p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <h2 className="font-heading text-3xl font-black text-[#2F2B25]">
                Book Annotation Kit
              </h2>
              <span className="rounded-full bg-warm-subtle px-4 py-2 text-xs font-bold text-[#2F2B25]">
                new
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
