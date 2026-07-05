import Link from "next/link";
import { cn } from "@/lib/utils";

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

const surfaceCardClass =
  "quiet-shadow relative overflow-hidden rounded-[2rem] border border-border-primary bg-surface-elevated transition-[background-color,border-color,box-shadow] before:pointer-events-none before:absolute before:inset-0 before:bg-accent before:opacity-0 before:transition-opacity hover:border-accent/60 hover:bg-accent-subtle hover:before:opacity-[0.08] focus-visible:border-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/30";

export default function SurfaceCard({
  children,
  className,
  href,
}: SurfaceCardProps) {
  const classes = cn(surfaceCardClass, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
