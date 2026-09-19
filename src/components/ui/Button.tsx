import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "rounded-pill bg-gradient-to-b from-[#E9D39F] to-[#D4AF5A] font-bold text-[#1B1226] shadow-card hover:brightness-105 active:scale-[.98]",
        gold:
          "rounded-pill bg-gradient-to-b from-[#E9D39F] to-[#D4AF5A] font-bold text-[#1B1226] shadow-card hover:brightness-105 active:scale-[.98]",
        ghost:
          "rounded-pill border border-line bg-transparent text-fg hover:bg-sunk",
        line:
          "rounded-pill bg-line-green font-bold text-white hover:bg-[#05B04D] active:scale-[.98]",
        outline:
          "rounded-pill border border-gold bg-transparent text-gold hover:bg-gold-soft",
        secondary:
          "rounded-pill border border-line-faint bg-sunk text-fg hover:bg-surface-3",
        destructive:
          "rounded-pill bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger",
        link: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-[15px]",
        xs: "min-h-11 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-11 gap-1.5 px-4 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11 rounded-pill",
        "icon-xs": "h-11 w-11 rounded-pill [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "h-11 w-11 rounded-pill",
        "icon-lg": "h-12 w-12 rounded-pill",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export { Button, buttonVariants }
