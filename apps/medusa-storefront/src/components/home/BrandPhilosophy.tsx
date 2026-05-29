import Container from "@/components/layout/Container";
import FadeInView from "@/components/ui/FadeInView";
import StarDecoration from "@/components/ui/StarDecoration";

export default function BrandPhilosophy() {
  return (
    <section className="bg-surface-secondary py-20 lg:py-28">
      <Container>
        <FadeInView>
          <div className="soft-shadow mx-auto max-w-3xl rounded-[2rem] border border-border-primary bg-surface-elevated p-8 text-center backdrop-blur md:p-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <StarDecoration variant="accent" size="sm" />
              <span
                className="font-mono text-xs uppercase tracking-[0.24em] text-text-muted"
              >
                Nemuzoo
              </span>
              <StarDecoration variant="accent" size="sm" />
            </div>

            <p
              className="text-lg leading-8 text-text-secondary lg:text-xl"
            >
              <em>Nemu</em> (眠る) means &ldquo;sleep&rdquo; in Japanese.{" "}
              <em>Zoo</em> means a collection of companions. Together, Nemuzoo
              is a family of knitted dolls — each one ready to be the friend
              you hold tight as you drift off. They do not fix loneliness.
              They simply sit beside it.
            </p>
          </div>
        </FadeInView>
      </Container>
    </section>
  );
}
