"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: Array<{ url: string; alt?: string }>;
  title: string;
}

export default function ProductGallery({
  images,
  title,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-[var(--color-surface-secondary)] rounded-xl flex items-center justify-center text-[var(--color-text-muted)]">
        No Image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-[var(--color-surface-secondary)] rounded-xl overflow-hidden">
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || title}
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-[var(--color-accent)]"
                  : "border-transparent hover:border-[var(--color-border-primary)]"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt || `${title} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
