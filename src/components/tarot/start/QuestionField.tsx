"use client";

import { useId } from "react";
import { Lock } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Textarea } from "@/components/ui/textarea";
import { EXAMPLE_QUESTIONS, MAX_QUESTION_LENGTH, type TopicId } from "@/lib/tarot/spreads";

export const QUESTION_PRIVACY_NOTE = "คำถามนี้จะแนบไปกับไพ่ที่ส่งให้หมอดูเท่านั้น";

export interface QuestionFieldProps {
  topic: TopicId;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Optional question textarea + example-question chips + privacy line. */
export function QuestionField({
  topic,
  value,
  onChange,
  placeholder = "พิมพ์สิ่งที่อยู่ในใจ หรือแตะตัวอย่างด้านล่าง",
}: QuestionFieldProps) {
  const id = useId();
  const inputId = `${id}-question`;
  const examples = EXAMPLE_QUESTIONS[topic];

  return (
    <section aria-labelledby={`${inputId}-label`}>
      <div className="flex items-end justify-between gap-3">
        <label id={`${inputId}-label`} htmlFor={inputId} className="eyebrow">
          คำถามของคุณ{" "}
          <span className="font-normal normal-case tracking-normal text-fg-subtle">(ไม่บังคับ)</span>
        </label>
        <span aria-live="polite" className="text-[13px] tabular-nums text-fg-subtle">
          {value.length}/{MAX_QUESTION_LENGTH}
        </span>
      </div>

      <Textarea
        id={inputId}
        data-testid="question-input"
        value={value}
        rows={3}
        maxLength={MAX_QUESTION_LENGTH}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2"
      />

      <div role="group" aria-label="ตัวอย่างคำถาม" className="mt-3 flex flex-wrap gap-2">
        {examples.map((question) => (
          <Chip
            key={question}
            data-testid="example-question-chip"
            selected={value.trim() === question}
            onClick={() => onChange(question)}
            className="h-auto min-h-11 whitespace-normal py-2 text-left"
          >
            {question}
          </Chip>
        ))}
      </div>

      <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-fg-muted">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
        {QUESTION_PRIVACY_NOTE}
      </p>
    </section>
  );
}
