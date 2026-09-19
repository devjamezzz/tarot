import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-line bg-sunk px-4 text-base text-fg placeholder:text-fg-subtle",
        "transition-[color,box-shadow,border-color] outline-none",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg",
        "selection:bg-gold-soft selection:text-fg",
        "focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40",
        "aria-invalid:border-danger aria-invalid:ring-danger/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
