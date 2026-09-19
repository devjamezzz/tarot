/**
 * ErrorDisplay Component for REFFORTUNE
 *
 * User-friendly error message display with retry and dismiss actions.
 * All messages displayed in Thai language.
 *
 * Feature: popular-fortune-features
 * Requirements: 10.6, 10.7
 */

import * as React from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

/** Error types that can be displayed */
export type ErrorType =
  | 'validation'    // Input validation errors
  | 'api'          // API/network errors
  | 'storage'      // Local storage errors
  | 'calculation'  // Calculation/processing errors
  | 'general';     // General errors

/** Error information structure */
export interface ErrorInfo {
  code: string;           // Error code for debugging
  message: string;        // User-friendly Thai message
  type?: ErrorType;       // Error category
  retryable?: boolean;    // Whether retry action should be shown
  recoverable?: boolean;  // Whether error can be recovered from
}

export interface ErrorDisplayProps {
  error: ErrorInfo | string;  // Error info or simple message string
  onRetry?: () => void;       // Retry action handler
  onDismiss?: () => void;     // Dismiss action handler
  className?: string;
  showIcon?: boolean;         // Show error icon (default: true)
}

/**
 * Displays user-friendly error messages in Thai with optional retry/dismiss actions.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={{ code: 'INVALID_DATE', message: 'รูปแบบวันที่ไม่ถูกต้อง', retryable: false }}
 *   onDismiss={() => setError(null)}
 * />
 * ```
 */
export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className,
  showIcon = true
}: ErrorDisplayProps) {
  // Normalize error to ErrorInfo structure
  const errorInfo: ErrorInfo = typeof error === 'string'
    ? { code: 'GENERAL_ERROR', message: error, type: 'general' }
    : error;

  return (
    <Alert tone="danger" role="alert" className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" strokeWidth={1.5} />
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 font-semibold text-danger">เกิดข้อผิดพลาด</div>
          <div className="text-sm text-fg">{errorInfo.message}</div>
        </div>
      </div>

      {(onRetry || onDismiss) && (
        <div className="mt-1 flex items-center gap-2">
          {errorInfo.retryable && onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              ลองใหม่
            </Button>
          )}
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              ปิด
            </Button>
          )}
        </div>
      )}
    </Alert>
  );
}

/**
 * Inline error message component for form fields
 *
 * @example
 * ```tsx
 * <InlineError message="กรุณาระบุชื่อ" />
 * ```
 */
export interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <div className={cn("mt-1.5 flex items-center gap-1.5 text-sm text-danger", className)}>
      <Info className="h-4 w-4 shrink-0" strokeWidth={1.5} />
      <span>{message}</span>
    </div>
  );
}
