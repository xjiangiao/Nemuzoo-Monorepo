"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

/**
 * Renders a quantity stepper with decrement and increment controls and a centered numeric display.
 *
 * @param value - Current quantity shown by the selector.
 * @param onChange - Callback invoked with the updated clamped quantity when the user increments or decrements.
 * @param min - Minimum allowed quantity (defaults to `1`).
 * @param max - Maximum allowed quantity (defaults to `99`).
 * @param disabled - When `true`, disables both buttons and prevents changes (defaults to `false`).
 * @returns A React element representing the quantity selector control.
 */
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border-primary overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center text-text-secondary hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-12 text-center text-sm text-text-primary font-medium select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center text-text-secondary hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
