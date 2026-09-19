import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl border border-line bg-sunk px-4 py-3 text-base text-fg placeholder:text-fg-subtle",
        "transition-[color,box-shadow,border-color] outline-none",
        "focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40",
        "aria-invalid:border-danger aria-invalid:ring-danger/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
