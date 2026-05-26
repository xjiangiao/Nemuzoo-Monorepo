"use client";

import { useState } from "react";
import Image from "next/image";

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
      <div className="aspect-square bg-surface-secondary rounded-xl flex items-center justify-center text-text-muted">
        No Image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-surface-secondary rounded-xl overflow-hidden relative">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors relative ${
                i === activeIndex
                  ? "border-accent"
                  : "border-transparent hover:border-border-primary"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
