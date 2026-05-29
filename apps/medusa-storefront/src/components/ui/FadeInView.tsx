interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeInView({
  children,
  className = "",
}: FadeInViewProps) {
  return <div className={className}>{children}</div>;
}
