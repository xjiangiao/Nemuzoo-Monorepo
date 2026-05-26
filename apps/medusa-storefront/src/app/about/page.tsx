import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StarDecoration from "@/components/ui/StarDecoration";
import FadeInView from "@/components/ui/FadeInView";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nemuzoo — knitted companions for quiet nights and gentle hearts. Inspired by the Japanese word for sleep (眠る) and a zoo of soft friends.",
};

export default function AboutPage() {
  return (
    <Container className="py-16 lg:py-20">
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <FadeInView>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <StarDecoration variant="warm" size="md" />
            </div>
            <h1
              className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading"
            >
              About Nemuzoo
            </h1>
            <p
              className="text-lg text-text-secondary"
              style={{ fontWeight: 300 }}
            >
              Knitted companions for quiet nights and gentle hearts.
            </p>
          </div>
        </FadeInView>

        {/* Brand Story */}
        <FadeInView delay={100}>
          <section className="mb-16">
            <SectionHeading title="What is Nemuzoo?" alignment="left" />
            <div
              className="space-y-4 text-base text-text-secondary leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              <p>
                <em>Nemu</em> (眠る) means &ldquo;sleep&rdquo; in Japanese.{" "}
                <em>Zoo</em> is a collection of companions. Together, Nemuzoo is
                a family of hand-knitted dolls — each one ready to be the friend
                you hold tight as you drift off.
              </p>
              <p>
                We believe comfort shouldn&rsquo;t be complicated. A soft doll
                in your arms, a quiet presence beside your pillow — sometimes
                that is enough. Nemuzoo dolls do not try to fix loneliness. They
                simply sit beside it. And that makes all the difference.
              </p>
            </div>
          </section>
        </FadeInView>

        {/* Care Guide */}
        <FadeInView delay={200}>
          <section className="mb-16">
            <SectionHeading title="Caring for Your Doll" alignment="left" />
            <div className="space-y-6">
              <div>
                <h3
                  className="text-lg font-medium text-text-primary mb-1 font-heading"
                >
                  Gentle Hand Wash
                </h3>
                <p
                  className="text-sm text-text-secondary"
                  style={{ fontWeight: 300 }}
                >
                  Use lukewarm water and mild detergent. Gently squeeze — do not
                  wring. Lay flat to dry in a shaded spot. Your doll will be
                  fresh and ready for another night.
                </p>
              </div>
              <div>
                <h3
                  className="text-lg font-medium text-text-primary mb-1 font-heading"
                >
                  Natural Yarns
                </h3>
                <p
                  className="text-sm text-text-secondary"
                  style={{ fontWeight: 300 }}
                >
                  Each doll is knitted with carefully selected natural yarns.
                  Colors may deepen slightly over time — that is the yarn
                  settling in with you, not a flaw.
                </p>
              </div>
              <div>
                <h3
                  className="text-lg font-medium text-text-primary mb-1 font-heading"
                >
                  A Little Love
                </h3>
                <p
                  className="text-sm text-text-secondary"
                  style={{ fontWeight: 300 }}
                >
                  Your doll is made to be held. Over time, the knit will soften
                  and mold to your touch — like any good friendship.
                </p>
              </div>
            </div>
          </section>
        </FadeInView>

        {/* Contact placeholder */}
        <FadeInView delay={300}>
          <section className="text-center py-10 bg-surface-secondary rounded-2xl">
            <StarDecoration
              variant="accent"
              size="md"
              className="mx-auto mb-3"
            />
            <h3
              className="text-xl font-medium text-text-primary font-heading"
            >
              Have a Question?
            </h3>
            <p
              className="mt-2 text-sm text-text-secondary"
              style={{ fontWeight: 300 }}
            >
              Reach out to us anytime. We&rsquo;d love to hear from you.
            </p>
          </section>
        </FadeInView>
      </div>
    </Container>
  );
}
