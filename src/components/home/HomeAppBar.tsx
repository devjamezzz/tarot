import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** Small logo bar for the home page — logo only, no admin entry on public pages. */
export function HomeAppBar({ className }: { className?: string }) {
  return (
    <header className={cn("flex items-center justify-between pb-2 pt-4", className)}>
      <Link
        href="/"
        aria-label="หน้าแรก REFFORTUNE"
        className="inline-flex items-center rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <Image
          src="/logo-home.png"
          alt="โลโก้ REFFORTUNE ดูดวงกับเรฟ"
          width={767}
          height={649}
          className="h-14 w-auto object-contain"
          priority
        />
      </Link>
    </header>
  );
}
