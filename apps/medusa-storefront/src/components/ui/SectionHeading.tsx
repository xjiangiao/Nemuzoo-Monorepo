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
        className="text-2xl lg:text-3xl font-medium text-text-primary font-heading"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base lg:text-lg text-text-secondary max-w-xl mx-auto font-body font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}
