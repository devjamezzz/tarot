import type { PackageConfig } from "@/lib/packages/defaults";
import { cn } from "@/lib/cn";
import { isFreePackage } from "./packageDetails";

const sizes = {
  md: "text-[28px]",
  lg: "text-[36px]",
} as const;

/** Large gold ฿ price with tabular numerals; "ฟรี" when the package has no price. */
export function PriceTag({
  pkg,
  size = "md",
  className,
}: {
  pkg: PackageConfig;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const free = isFreePackage(pkg);
  return (
    <div className={cn("min-w-0", className)}>
      <p
        className={cn(
          "font-sans font-bold leading-none tabular-nums tracking-[0.02em] text-gold",
          sizes[size]
        )}
        data-testid="pricing-price"
      >
        {free ? "ฟรี" : pkg.price}
      </p>
      {pkg.priceAlt ? (
        <p className="mt-1.5 text-[13px] text-fg-muted">หรือ {pkg.priceAlt}</p>
      ) : null}
    </div>
  );
}
