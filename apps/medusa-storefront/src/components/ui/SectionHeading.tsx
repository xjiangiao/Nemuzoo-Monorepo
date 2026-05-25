interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: "center" | "left";
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  alignment = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${alignment === "center" ? "text-center" : ""} ${className}`}>
      <h2
        className="text-2xl lg:text-3xl font-medium text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base lg:text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto"
           style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
