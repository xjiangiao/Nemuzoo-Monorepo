import { type ElementType } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "header" | "footer";
}

export default function Container({
  children,
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={`mx-auto max-w-7xl px-5 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
