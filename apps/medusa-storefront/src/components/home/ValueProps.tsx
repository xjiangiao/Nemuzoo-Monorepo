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
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-warm-subtle text-warm mb-5">
                  {v.icon}
                </div>
                <h3
                  className="text-lg font-medium text-text-primary mb-2 font-heading"
                >
                  {v.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed"
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
