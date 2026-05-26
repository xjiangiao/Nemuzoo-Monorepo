"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

/**
 * Render a styled separator element that adapts its dimensions for horizontal or vertical layouts.
 *
 * @param className - Optional additional CSS classes to merge with the component's base styles.
 * @param orientation - Layout axis for the separator; affects the element's height/width and stretching.
 * @param props - Additional props forwarded to the underlying SeparatorPrimitive.
 * @returns A React element representing the configured separator.
 */
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
