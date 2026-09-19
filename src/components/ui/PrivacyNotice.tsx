'use client';

import { useState, useSyncExternalStore } from 'react';
import { Bot, Cookie, Smartphone, Trash2, type LucideIcon } from 'lucide-react';
import { ReadingType } from '@/lib/reading/types';
import { Card } from './Card';
import { Button } from './Button';

interface PrivacyNoticeProps {
  featureType: ReadingType;
  featureName: string;
  onDismiss?: () => void;
}

const PRIVACY_NOTICE_PREFIX = 'privacy_notice_shown_';

interface NoticeItem {
  icon: LucideIcon;
  title: string;
  body: string;
}

const NOTICE_ITEMS: ReadonlyArray<NoticeItem> = [
  {
    icon: Smartphone,
    title: 'จัดเก็บในเครื่องเท่านั้น',
    body: 'ข้อมูลของคุณถูกเก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น ไม่มีการส่งไปยังเซิร์ฟเวอร์',
  },
  {
    icon: Bot,
    title: 'AI เพื่อคำทำนาย',
    body: 'เราใช้ Gemini AI เพื่อสร้างคำทำนายที่เป็นส่วนตัวสำหรับคุณ ข้อมูลจะถูกส่งไปยัง Google Gemini API เท่านั้น',
  },
  {
    icon: Cookie,
    title: 'ไม่มีคุกกี้',
    body: 'เราไม่ใช้คุกกี้ในการติดตามพฤติกรรมของคุณ',
  },
  {
    icon: Trash2,
    title: 'ลบได้ทุกเมื่อ',
    body: 'คุณสามารถลบข้อมูลทั้งหมดได้ตลอดเวลาในหน้าการตั้งค่า',
  },
];

/** Check if privacy notice has been shown for a feature type */
function hasShownPrivacyNotice(featureType: ReadingType): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`${PRIVACY_NOTICE_PREFIX}${featureType}`) === 'true';
  } catch {
    return false;
  }
}

const noopSubscribe = () => () => {};

/** Reads the per-feature flag without a hydration mismatch (server: "already shown"). */
function useHasShownPrivacyNotice(featureType: ReadingType): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => hasShownPrivacyNotice(featureType),
    () => true
  );
}

/** Mark privacy notice as shown for a feature type */
function markPrivacyNoticeShown(featureType: ReadingType): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${PRIVACY_NOTICE_PREFIX}${featureType}`, 'true');
  } catch {
    // storage unavailable — notice will simply show again next visit
  }
}

/**
 * Privacy Notice — shown on first use of each feature type; display state is
 * tracked in localStorage per feature.
 */
export function PrivacyNotice({ featureType, featureName, onDismiss }: PrivacyNoticeProps) {
  const hasShown = useHasShownPrivacyNotice(featureType);
  const [dismissed, setDismissed] = useState(false);
  const isVisible = !hasShown && !dismissed;

  const handleDismiss = () => {
    markPrivacyNoticeShown(featureType);
    setDismissed(true);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-notice-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4"
    >
      {/* z-[10000] keeps the modal above BottomTabBar (z-[9999]) so the
          "เข้าใจแล้ว" button stays tappable on small screens. */}
      <Card className="w-full max-w-md space-y-4 p-6">
        <div className="space-y-1">
          <p className="eyebrow">ความเป็นส่วนตัว</p>
          <h2 id="privacy-notice-title" className="font-display text-[22px] font-semibold text-fg">
            ความเป็นส่วนตัวของคุณ
          </h2>
          <p className="text-sm text-fg-muted">ยินดีต้อนรับสู่ {featureName}</p>
        </div>

        <div className="space-y-3 text-sm text-fg-muted">
          {NOTICE_ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
              <div>
                <p className="font-medium text-fg">{item.title}</p>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button onClick={handleDismiss} className="w-full">
            เข้าใจแล้ว เริ่มใช้งาน
          </Button>
        </div>

        <p className="text-center text-xs text-fg-subtle">
          การใช้งานต่อถือว่าคุณยอมรับนโยบายความเป็นส่วนตัวของเรา
        </p>
      </Card>
    </div>
  );
}

/** Hook to check if privacy notice should be shown */
export function usePrivacyNotice(featureType: ReadingType) {
  const hasShown = useHasShownPrivacyNotice(featureType);
  const [marked, setMarked] = useState(false);
  const shouldShow = !hasShown && !marked;

  const markAsShown = () => {
    markPrivacyNoticeShown(featureType);
    setMarked(true);
  };

  return {
    shouldShow,
    markAsShown
  };
}
