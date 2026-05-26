"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import FadeInView from "@/components/ui/FadeInView";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[var(--color-surface-secondary)]">
      <Container>
        <FadeInView>
          <div className="max-w-lg mx-auto text-center">
            <h2
              className="text-2xl lg:text-3xl font-medium text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Join the Dreamers
            </h2>
            <p className="mt-3 text-base text-[var(--color-text-secondary)]"
               style={{ fontWeight: 300 }}>
              Gentle updates about new companions, stories, and moments of
              comfort.
            </p>

            {status === "success" ? (
              <p className="mt-8 text-sm font-medium text-[var(--color-success)]">
                Welcome to the dream. We will keep in touch.
              </p>
            ) : status === "error" ? (
              <div className="mt-8">
                <p className="text-sm font-medium text-[var(--color-error)] mb-3">
                  Something went wrong. Try again?
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="px-4 py-2.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent sm:min-w-[280px]"
                  />
                  <Button type="submit" variant="accent">
                    Try Again
                  </Button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={status === "loading"}
                  className="px-4 py-2.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent sm:min-w-[280px] disabled:opacity-50"
                />
                <Button type="submit" variant="accent" disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </FadeInView>
      </Container>
    </section>
  );
}
