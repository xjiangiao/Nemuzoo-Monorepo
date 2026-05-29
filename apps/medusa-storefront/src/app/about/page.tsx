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
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <FadeInView>
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <StarDecoration variant="accent" size="md" />
            </div>
            <h1
              className="mb-4 font-heading text-5xl font-black text-text-primary lg:text-6xl"
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
            <div className="space-y-4 text-base leading-8 text-text-secondary">
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
            <div className="space-y-5">
              <div className="rounded-[2rem] border border-border-primary bg-surface-elevated p-6">
                <h3
                  className="mb-2 font-heading text-xl font-black text-text-primary"
                >
                  Gentle Hand Wash
                </h3>
                <p className="text-sm leading-7 text-text-secondary">
                  Use lukewarm water and mild detergent. Gently squeeze — do not
                  wring. Lay flat to dry in a shaded spot. Your doll will be
                  fresh and ready for another night.
                </p>
              </div>
              <div className="rounded-[2rem] border border-border-primary bg-surface-elevated p-6">
                <h3
                  className="mb-2 font-heading text-xl font-black text-text-primary"
                >
                  Natural Yarns
                </h3>
                <p className="text-sm leading-7 text-text-secondary">
                  Each doll is knitted with carefully selected natural yarns.
                  Colors may deepen slightly over time — that is the yarn
                  settling in with you, not a flaw.
                </p>
              </div>
              <div className="rounded-[2rem] border border-border-primary bg-surface-elevated p-6">
                <h3
                  className="mb-2 font-heading text-xl font-black text-text-primary"
                >
                  A Little Love
                </h3>
                <p className="text-sm leading-7 text-text-secondary">
                  Your doll is made to be held. Over time, the knit will soften
                  and mold to your touch — like any good friendship.
                </p>
              </div>
            </div>
          </section>
        </FadeInView>

        {/* Contact placeholder */}
        <FadeInView delay={300}>
          <section className="soft-shadow rounded-[2rem] border border-border-primary bg-surface-elevated py-10 text-center">
            <StarDecoration
              variant="accent"
              size="md"
              className="mx-auto mb-3"
            />
            <h3
              className="font-heading text-2xl font-black text-text-primary"
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
