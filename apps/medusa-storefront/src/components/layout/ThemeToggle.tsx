"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={cn(
        "theme-toggle inline-flex h-9 items-center justify-center rounded-full border border-border-primary bg-surface-elevated/70 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary",
        showLabel ? "gap-2 px-3 text-sm font-semibold" : "w-9",
        className,
      )}
      aria-label={`Toggle color theme, currently ${theme}`}
      aria-pressed={theme === "dark"}
      onClick={toggleTheme}
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <Sun
          size={16}
          className="theme-toggle-sun transition-all duration-200"
        />
        <Moon
          size={16}
          className="theme-toggle-moon absolute transition-all duration-200"
        />
      </span>
      {showLabel && <span>Theme</span>}
    </button>
  );
}
