"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { HeartSave } from "@/components/ui/HeartSave";
import { cn } from "@/lib/cn";
import type { LibraryEntry } from "@/lib/library/types";
import { getThumbnail, presentEntry } from "./entryPresenters";

export function SavedEntryRow({ entry, onRemove }: { entry: LibraryEntry; onRemove: () => void }) {
  const thumb = getThumbnail(entry);
  const { title, meta, snippet, href } = presentEntry(entry);
  const Icon = thumb.kind === "icon" ? thumb.icon : null;

  return (
    <Card className="p-3 md:p-4" data-testid="saved-entry">
      <div className="flex items-start gap-3">
        <Link
          href={href}
          className="flex min-w-0 flex-1 items-start gap-3 rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <div className="relative h-[66px] w-11 shrink-0 overflow-hidden rounded-[8px] border border-gold/40 bg-sunk">
            {thumb.kind === "image" ? (
              <Image
                src={thumb.src}
                alt={thumb.alt}
                fill
                sizes="44px"
                className={cn("object-cover", thumb.rotate180 && "rotate-180")}
              />
            ) : Icon ? (
              <span className="flex h-full w-full items-center justify-center">
                <Icon className="size-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
              </span>
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-fg-muted">{meta}</p>
            <p className="mt-0.5 line-clamp-2 font-display text-base font-semibold leading-snug text-fg">{title}</p>
            {snippet ? <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{snippet}</p> : null}
          </div>
        </Link>

        <HeartSave saved onToggle={onRemove} label="เอาออกจากคลัง" />
      </div>
    </Card>
  );
}
