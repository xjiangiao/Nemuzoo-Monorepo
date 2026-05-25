type StarVariant = "warm" | "accent" | "muted";
type StarSize = "sm" | "md" | "lg";

interface StarDecorationProps {
  variant?: StarVariant;
  size?: StarSize;
  className?: string;
}

const colorMap: Record<StarVariant, string> = {
  warm: "text-[var(--color-warm)]",
  accent: "text-[var(--color-accent-soft)]",
  muted: "text-[var(--color-text-muted)]",
};

const sizeMap: Record<StarSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export default function StarDecoration({
  variant = "warm",
  size = "md",
  className = "",
}: StarDecorationProps) {
  const px = sizeMap[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${colorMap[variant]} ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  );
}
