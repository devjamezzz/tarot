"use client";

import { useEffect, useState } from "react";
import { GENERIC_ERROR } from "./readingMeta";

export type EngineReadingStatus = "invalid" | "loading" | "ready" | "error";

export type EngineReadingState<T> = {
  status: EngineReadingStatus;
  reading: T | null;
  /** Thai error message when status is "error". */
  error: string;
};

type Settled<P, T> = { params: P; reading: T | null; error: string };

/**
 * Runs a deterministic client-side engine for the given params.
 *
 * `params` must be memoised by the caller (useMemo on the raw query strings)
 * and is `null` when the query is invalid. `engine` should be a stable
 * module-level function. State is keyed by the params object so a change in
 * query flips straight back to "loading" without a setState inside the effect.
 */
export function useEngineReading<P, T>(
  params: P | null,
  engine: (params: P) => Promise<T>
): EngineReadingState<T> {
  const [settled, setSettled] = useState<Settled<P, T> | null>(null);

  useEffect(() => {
    if (params === null) return;
    let cancelled = false;
    engine(params).then(
      (reading) => {
        if (!cancelled) setSettled({ params, reading, error: "" });
      },
      (cause: unknown) => {
        if (cancelled) return;
        const error = cause instanceof Error && cause.message ? cause.message : GENERIC_ERROR;
        setSettled({ params, reading: null, error });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [params, engine]);

  if (params === null) return { status: "invalid", reading: null, error: "" };
  if (!settled || settled.params !== params) return { status: "loading", reading: null, error: "" };
  if (settled.reading === null) return { status: "error", reading: null, error: settled.error };
  return { status: "ready", reading: settled.reading, error: "" };
}
