"use client";

import { useEffect, useRef, useState } from "react";

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeInView({
  children,
  className = "",
  delay = 0,
}: FadeInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setVisible(true), delay);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
