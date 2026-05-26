import Container from "@/components/layout/Container";
import FadeInView from "@/components/ui/FadeInView";
import StarDecoration from "@/components/ui/StarDecoration";

export default function BrandPhilosophy() {
  return (
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <Container>
        <FadeInView>
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <StarDecoration variant="warm" size="sm" />
              <span
                className="text-sm text-warm tracking-widest uppercase font-heading"
              >
                Nemuzoo
              </span>
              <StarDecoration variant="warm" size="sm" />
            </div>

            <p
              className="text-lg lg:text-xl text-text-secondary leading-relaxed"
              style={{ fontWeight: 300 }}
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
