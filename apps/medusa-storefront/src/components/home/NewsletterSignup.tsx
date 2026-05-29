"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import FadeInView from "@/components/ui/FadeInView";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !consent) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-surface-secondary py-20 lg:py-28">
      <Container>
        <FadeInView>
          <div className="soft-shadow mx-auto max-w-2xl rounded-[2rem] border border-border-primary bg-surface-elevated p-8 text-center md:p-12">
            <h2
              className="font-heading text-4xl font-black text-text-primary"
            >
              Join the Dreamers
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-7 text-text-secondary">
              Gentle updates about new companions, stories, and moments of
              comfort.
            </p>

            {status === "success" ? (
              <p className="mt-8 text-sm font-medium text-success">
                Welcome to the dream. We will keep in touch.
              </p>
            ) : status === "error" ? (
              <div className="mt-8">
                <p className="text-sm font-medium text-error mb-3">
                  Something went wrong. Try again?
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="rounded-full border border-border-primary bg-white/55 px-5 py-3 text-sm text-text-primary placeholder-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button type="submit" variant="accent">
                    Try Again
                  </Button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={status === "loading"}
                  className="w-full max-w-sm rounded-full border border-border-primary bg-white/55 px-5 py-3 text-sm text-text-primary placeholder-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                />
                <label className="flex items-start gap-2 text-left max-w-sm">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 shrink-0 w-4 h-4 rounded border-border-primary text-accent focus:ring-accent"
                    required
                  />
                  <span className="text-xs text-text-secondary leading-relaxed">
                    I agree to receive email updates from Nemuzoo and accept the{" "}
                    <a href="/privacy" className="text-accent hover:text-accent-hover underline">
                      Privacy Policy
                    </a>.
                    You can unsubscribe at any time.
                  </span>
                </label>
                <Button type="submit" variant="accent" disabled={status === "loading" || !consent}>
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
