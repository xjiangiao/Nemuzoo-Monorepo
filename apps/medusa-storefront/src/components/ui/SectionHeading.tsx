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
        className="font-heading text-4xl font-black leading-tight text-text-primary sm:text-5xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-xl text-base leading-8 text-text-secondary lg:text-lg ${alignment === "center" ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
