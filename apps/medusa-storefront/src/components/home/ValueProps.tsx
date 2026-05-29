import Container from "@/components/layout/Container";
import FadeInView from "@/components/ui/FadeInView";
import { Star, Heart, Moon } from "lucide-react";

const values = [
  {
    icon: <Star size={28} />,
    title: "Handmade with Care",
    description:
      "Every Nemuzoo doll is hand-knitted with soft, natural yarns chosen for their gentle touch and lasting comfort.",
  },
  {
    icon: <Heart size={28} />,
    title: "Emotional Companion",
    description:
      "Designed not just as toys but as quiet friends who listen without judgment and comfort without condition.",
  },
  {
    icon: <Moon size={28} />,
    title: "Nighttime Comfort",
    description:
      "Inspired by the stillness of night — when we most need someone by our side. Hold tight and drift away.",
  },
];

export default function ValueProps() {
  return (
    <section className="border-y border-border-primary bg-white/45 py-14">
      <Container>
        <FadeInView>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((v, index) => (
              <div key={v.title}>
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-subtle text-text-primary">
                  {v.icon}
                </div>
                <h3
                  className="mb-3 font-heading text-2xl font-black text-text-primary"
                >
                  {v.title}
                </h3>
                <p className="text-sm leading-7 text-text-secondary">
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
