import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"

/**
 * Renders a spinning loader icon indicating a loading state.
 *
 * @param className - Optional additional CSS classes merged with the default `size-4 animate-spin`
 * @param props - Additional SVG props forwarded to the underlying icon element
 * @returns A JSX element that renders a rotating loader icon with `role="status"` and `aria-label="Loading"`
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
