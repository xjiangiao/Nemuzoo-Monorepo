import Link from "next/link";

type ButtonVariant = "accent" | "warm" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

const variantClasses: Record<ButtonVariant, string> = {
  accent:
    "bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]",
  warm:
    "bg-[var(--color-warm)] text-[var(--color-text-inverse)] hover:bg-[var(--color-warm-hover)]",
  outline:
    "border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]",
  ghost:
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-1.5 px-4 text-sm",
  md: "py-2.5 px-6 text-base",
  lg: "py-3 px-8 text-lg",
};

export default function Button({
  children,
  variant = "accent",
  size = "md",
  href,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
  } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
