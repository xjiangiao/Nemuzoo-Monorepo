import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import StarDecoration from "@/components/ui/StarDecoration";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 40%, var(--color-surface-elevated) 0%, var(--color-surface-primary) 100%)",
      }}
    >
      {/* Floating stars decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] animate-[float_4s_ease-in-out_infinite] opacity-60">
          <StarDecoration size="lg" variant="warm" />
        </div>
        <div className="absolute top-[25%] right-[15%] animate-[float_3.5s_ease-in-out_infinite_0.5s] opacity-40">
          <StarDecoration size="md" variant="accent" />
        </div>
        <div className="absolute bottom-[30%] left-[20%] animate-[float_3s_ease-in-out_infinite_1s] opacity-50">
          <StarDecoration size="sm" variant="warm" />
        </div>
        <div className="absolute top-[40%] right-[25%] animate-[float_4.5s_ease-in-out_infinite_0.3s] opacity-30">
          <StarDecoration size="md" variant="accent" />
        </div>
        <div className="absolute bottom-[20%] right-[10%] animate-[float_3.8s_ease-in-out_infinite_0.8s] opacity-45">
          <StarDecoration size="sm" variant="warm" />
        </div>
      </div>

      <Container className="relative z-10 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1
            className="text-5xl lg:text-7xl font-bold text-[var(--color-text-primary)] leading-[1.1]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The one you hold tight before falling asleep
          </h1>
          <p
            className="mt-6 text-lg lg:text-xl text-[var(--color-text-secondary)] max-w-lg mx-auto"
            style={{ fontWeight: 300 }}
          >
            Knitted companions for quiet nights and gentle hearts.
          </p>
          <div className="mt-10">
            <Button variant="warm" size="lg" href="/products">
              Meet the Zoo
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
