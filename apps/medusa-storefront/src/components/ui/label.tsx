"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Renders a styled HTML label element with merged Tailwind classes and a `data-slot="label"` attribute.
 *
 * @param className - Additional CSS class names to merge with the component's default styles.
 * @param props - Other standard HTML `<label>` attributes and event handlers forwarded to the element.
 * @returns A React element for a `<label>` with default styling and the provided attributes.
 */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
