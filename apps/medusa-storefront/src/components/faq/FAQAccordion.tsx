"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="space-y-4" aria-label="Frequently asked questions">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;

        return (
          <article
            key={faq.q}
            className="rounded-[2rem] bg-surface-elevated p-6"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 text-left font-heading text-2xl font-black leading-tight text-text-primary"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{faq.q}</span>
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-subtle text-xl leading-none text-text-primary"
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "absolute transition-all duration-200",
                    isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
                  )}
                >
                  +
                </span>
                <span
                  className={cn(
                    "transition-all duration-200",
                    isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
                  )}
                >
                  -
                </span>
              </span>
            </button>

            <div
              id={panelId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "max-w-3xl leading-7 text-text-secondary transition-[opacity,transform,padding-top] duration-300 ease-out",
                    isOpen
                      ? "pt-4 opacity-100 translate-y-0"
                      : "pt-0 opacity-0 -translate-y-1",
                  )}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
