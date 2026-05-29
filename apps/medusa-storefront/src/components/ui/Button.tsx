import React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-colors outline-none select-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-[0.08] active:before:opacity-[0.14] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:before:opacity-0 disabled:hover:before:opacity-0 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm [a]:hover:bg-primary",
        accent:
          "bg-accent text-text-inverse shadow-sm",
        warm: "bg-warm text-text-inverse shadow-sm",
        outline:
          "border-border bg-surface-elevated text-foreground hover:bg-surface-elevated hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 before:hidden hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-11 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        lg: "h-12 gap-2 px-7 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-10",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

/**
 * Renders a styled button; if `href` is provided and the button is not disabled, renders a link with the same styling.
 *
 * @param className - Additional class names to merge with the component's generated classes.
 * @param variant - Visual variant to apply to the button (controls color and emphasis).
 * @param size - Size variant to apply (controls height, padding, and icon sizing).
 * @param href - If provided and the button is not disabled, the destination URL for a rendered link.
 * @returns A React element representing a styled button or a styled link when `href` is used.
 */
function Button({
  className,
  variant = "default",
  size = "default",
  href,
  ...props
}: ButtonProps) {
  if (href && !props.disabled) {
    const { children, ...rest } = props;
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(rest as Omit<React.ComponentProps<typeof Link>, "href" | "className">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants, type ButtonProps }
export default Button
