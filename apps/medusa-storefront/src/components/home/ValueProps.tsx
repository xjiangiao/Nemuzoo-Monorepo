import Container from "@/components/layout/Container";
import FadeInView from "@/components/ui/FadeInView";

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
      </svg>
    ),
    title: "Handmade with Care",
    description:
      "Every Nemuzoo doll is hand-knitted with soft, natural yarns chosen for their gentle touch and lasting comfort.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Emotional Companion",
    description:
      "Designed not just as toys but as quiet friends who listen without judgment and comfort without condition.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    title: "Nighttime Comfort",
    description:
      "Inspired by the stillness of night — when we most need someone by our side. Hold tight and drift away.",
  },
];

export default function ValueProps() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-warm-subtle)] text-[var(--color-warm)] mb-5">
                  {v.icon}
                </div>
                <h3
                  className="text-lg font-medium text-[var(--color-text-primary)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
                   style={{ fontWeight: 300 }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </FadeInView>
      </Container>
    </section>
  );
}
