"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type LabelTone = "default" | "eyebrow"

const tones: Record<LabelTone, string> = {
  default: "text-sm font-medium text-fg",
  eyebrow: "eyebrow",
}

function Label({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { tone?: LabelTone }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        tones[tone],
        className
      )}
      {...props}
    />
  )
}

export { Label }
