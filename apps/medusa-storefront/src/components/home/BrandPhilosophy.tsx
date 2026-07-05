import Container from "@/components/layout/Container";
import FadeInView from "@/components/ui/FadeInView";

export default function BrandPhilosophy() {
  return (
    <section className="bg-surface-secondary py-20 lg:py-28">
      <Container>
        <FadeInView>
          <div className="quiet-shadow mx-auto max-w-3xl rounded-[2rem] border border-border-primary bg-surface-elevated p-8 text-center backdrop-blur md:p-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-text-muted">
                Nemuzoo
              </span>
            </div>

            <p className="text-lg leading-8 text-text-secondary lg:text-xl">
              Nemuzoo is built around quiet usefulness. We prefer honest
              materials, calm shapes, and objects that can live naturally on a
              desk, shelf, entryway, or bedside table.
            </p>
          </div>
        </FadeInView>
      </Container>
    </section>
  );
}
