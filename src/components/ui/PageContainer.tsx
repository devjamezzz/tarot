import * as React from "react";
import { cn } from "@/lib/cn";

export interface PageContainerProps {
  /** narrow = 640px reading column; wide = 1120px with optional 360px aside on md+. */
  variant?: "narrow" | "wide";
  className?: string;
  children: React.ReactNode;
  /** Right column on md+ (wide variant only). */
  aside?: React.ReactNode;
}

export function PageContainer({
  variant = "narrow",
  className,
  children,
  aside,
}: PageContainerProps) {
  if (variant === "wide") {
    return (
      <div
        className={cn(
          "mx-auto w-full max-w-[1120px] px-4 pb-24 md:px-6",
          aside && "md:grid md:grid-cols-[minmax(0,1fr)_360px] md:gap-6",
          className
        )}
      >
        {aside ? (
          <>
            <div className="min-w-0">{children}</div>
            <aside className="mt-6 min-w-0 has-[>.hidden]:mt-0 md:mt-0">{aside}</aside>
          </>
        ) : (
          children
        )}
      </div>
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-[640px] px-4 pb-24", className)}>
      {children}
    </div>
  );
}
