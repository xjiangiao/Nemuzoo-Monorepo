"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { XIcon } from "lucide-react"

/**
 * Provides the dialog root element and context for nested dialog primitives.
 *
 * Forwards all received props to the underlying DialogPrimitive.Root and sets `data-slot="dialog"`.
 *
 * @returns The rendered dialog root element.
 */
function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Renders the dialog trigger element and sets `data-slot="dialog-trigger"`.
 *
 * @returns A `DialogPrimitive.Trigger` element with the provided props and `data-slot="dialog-trigger"`.
 */
function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Renders a portal element for dialog content and forwards received props.
 *
 * @param props - Props forwarded to the portal element
 * @returns The portal element that mounts dialog children into a DOM portal
 */
function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Renders a dialog close trigger and applies the component's `data-slot` attribute.
 *
 * @param props - Props forwarded to the underlying `DialogPrimitive.Close` component.
 * @returns The rendered close trigger element.
 */
function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Renders a full-viewport dialog backdrop with preset positioning, backdrop blur, and open/close animations.
 *
 * @param className - Additional CSS class names merged with the component's default classes
 * @param props - Remaining props forwarded to the underlying Backdrop primitive
 * @returns The rendered backdrop element with merged classes and `data-slot="dialog-overlay"`
 */
function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-[#2E2E33]/28 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders dialog popup content inside a portal with an overlay and an optional close button.
 *
 * @param showCloseButton - If `true`, includes a top-right ghost icon close button; defaults to `true`.
 * @returns The dialog popup element (wrapped in a portal and overlay) that contains the provided children.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

/**
 * Renders the dialog header container with default vertical layout and spacing.
 *
 * @param className - Additional CSS class names to merge with the component's default classes
 * @returns The header wrapper div element for dialog content
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

/**
 * Render a responsive dialog footer container with spacing, border, and background styling.
 *
 * @param className - Additional class names merged into the footer container
 * @param showCloseButton - If `true`, includes a "Close" button that closes the dialog; defaults to `false`
 * @param children - Content rendered inside the footer
 */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

/**
 * Wraps the DialogPrimitive.Title element with the app's heading typography and a `data-slot="dialog-title"`.
 *
 * @returns A DialogPrimitive.Title element with heading font styles merged with the provided `className`.
 */
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the dialog description element with muted typography and link styling.
 *
 * @param className - Additional CSS classes to merge with the component's default styles
 * @returns The dialog description element with muted text and link underline/hover behavior
 */
function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
