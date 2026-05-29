import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

/**
 * Render the homepage hero section with a radial gradient background, animated star decorations, a centered headline and subtitle, and a primary call-to-action button.
 *
 * @returns The hero section JSX element containing background decorations, centered marketing content, and a CTA button.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid min-h-[calc(100vh-72px)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-16">
        <div className="relative z-10">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
            soft companions for everyday rituals
          </p>
          <h1 className="max-w-3xl font-heading text-5xl font-black leading-[0.95] text-text-primary sm:text-6xl lg:text-8xl">
            A quieter kind of comfort.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-text-secondary">
            Soft collectible companions for bedrooms, desks, gifting, and the small moments when you want something gentle nearby.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button variant="warm" size="lg" href="/products">
              Shop plush
            </Button>
            <Button variant="outline" size="lg" href="/about">
              Our story
            </Button>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
            <span>Gift-ready</span>
            <span>US shipping</span>
            <span>Easy care</span>
          </div>
        </div>

        <div className="relative mx-auto aspect-[0.9/1] w-full max-w-[560px]" aria-hidden="true">
          <div className="grain absolute inset-0 rounded-[3rem] bg-surface-secondary" />
          <div className="plush-cream soft-shadow absolute left-[11%] top-[8%] h-[70%] w-[58%] rounded-[48%_48%_38%_38%]" />
          <div className="plush-oval soft-shadow absolute right-[8%] top-[24%] h-[46%] w-[38%] rounded-[48%]" />
          <div className="absolute left-[22%] top-[27%] h-4 w-4 rounded-full bg-text-primary" />
          <div className="absolute left-[44%] top-[27%] h-4 w-4 rounded-full bg-text-primary" />
          <div className="absolute left-[32%] top-[39%] h-3 w-12 rounded-full bg-text-primary/20" />
          <div className="absolute bottom-[9%] left-[10%] right-[10%] rounded-[2rem] border border-white/70 bg-white/70 p-5 backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-muted">
              first drop
            </p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <h2 className="font-heading text-3xl font-black text-[#2E2E33]">
                Mellow Room Series
              </h2>
              <span className="rounded-full bg-accent-soft/70 px-4 py-2 text-xs font-bold text-[#2E2E33]">
                new
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
