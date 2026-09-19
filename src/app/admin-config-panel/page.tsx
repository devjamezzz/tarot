'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, ChevronDown, ChevronUp, Crown, Plus, Save, Trash2 } from 'lucide-react';
import { useConfigStore, type FeatureToggles, type PackageConfig } from '@/store/useConfigStore';
import { useAuth } from '@/components/auth/AuthProvider';
import { PageContainer } from '@/components/ui/PageContainer';
import { AppBar } from '@/components/nav/AppBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/switch';
import { AdminPackageEditor } from '@/components/pricing/AdminPackageEditor';
import { badgeFor, isFreePackage } from '@/components/pricing/packageDetails';

const TOGGLE_ROWS: [keyof FeatureToggles, string, string][] = [
  ['enableTarot', 'ไพ่ทาโรต์', 'ดูไพ่ยิปซี 1, 3, 10 ใบ'],
  ['enableSpiritCard', 'ไพ่จิตวิญญาณ', 'ไพ่สะท้อนตัวตนหนึ่งใบ'],
  ['enableNumerology', 'เลขศาสตร์', 'วิเคราะห์เบอร์มงคล'],
  ['enableLoveTarot', 'ทาโรต์ความรัก', 'ดูดวงความรักโดยเฉพาะ'],
  ['enableDailyAuspicious', 'ไพ่ประจำวัน', 'ไพ่หนึ่งใบสำหรับวันนี้'],
  ['showAiReading', 'แสดงคำทำนายจาก AI', 'เปิดแล้วหน้าผลจะแสดงคำอ่านจาก AI ต่อจากความหมายตามตำรา'],
];

const TOAST_MS = 2500;

function newEmptyPackage(): PackageConfig {
  return {
    id: `pkg-${Date.now()}`,
    name: '',
    subtitle: '',
    price: '',
    priceAlt: '',
    description: '',
    detail: '',
    features: [''],
    popular: false,
    href: '',
  };
}

const subscribeNoop = () => () => {};
/** true after hydration, false during SSR — avoids the setState-in-effect pattern. */
function useMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

function SectionTitle({ title, caption, action }: { title: string; caption: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line-faint px-4 py-4 md:px-5">
      <div className="min-w-0">
        <h2 className="font-display text-[22px] font-semibold leading-snug text-fg">{title}</h2>
        <p className="mt-0.5 text-[13px] text-fg-muted">{caption}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export default function AdminConfigPanel() {
  const { toggles, packages, setToggle, updatePackage, addPackage, removePackage, reorderPackages } = useConfigStore();
  const { user, loading: authLoading } = useAuth();
  const mounted = useMounted();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  if (!mounted || authLoading) return null;

  // Client-side admin gate (the sensitive customer data lives behind
  // server-gated /api/admin/* routes; this guard is UX only).
  if (!user?.isAdmin) {
    return (
      <PageContainer variant="narrow" className="py-16 text-center">
        <p className="text-sm text-fg-muted">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
      </PageContainer>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), TOAST_MS);
  };

  const handleField = (id: string, field: keyof PackageConfig, value: string | boolean) => {
    updatePackage(id, { [field]: value });
  };

  const handleFeature = (id: string, idx: number, value: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;
    updatePackage(id, { features: pkg.features.map((f, i) => (i === idx ? value : f)) });
  };

  const addFeature = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;
    updatePackage(id, { features: [...pkg.features, ''] });
  };

  const removeFeature = (id: string, idx: number) => {
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;
    updatePackage(id, { features: pkg.features.filter((_, i) => i !== idx) });
  };

  const movePackage = (idx: number, dir: -1 | 1) => {
    const swap = idx + dir;
    if (swap < 0 || swap >= packages.length) return;
    const next = [...packages];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    reorderPackages(next);
  };

  const handleAdd = () => {
    const pkg = newEmptyPackage();
    addPackage(pkg);
    setExpandedId(pkg.id);
    showToast('เพิ่มแพ็กเกจใหม่แล้ว');
  };

  const handleRemove = (id: string) => {
    if (!confirm('ลบแพ็กเกจนี้?')) return;
    removePackage(id);
    showToast('ลบแพ็กเกจแล้ว');
  };

  return (
    <main data-testid="admin-config-panel">
      <PageContainer variant="narrow">
        <AppBar
          label="ผู้ดูแลระบบ"
          title="แผงควบคุมผู้ดูแล"
          caption="จัดการฟีเจอร์และแพ็กเกจ · บันทึกอัตโนมัติ"
          backHref="/"
          right={
            <Button size="sm" variant="outline" onClick={() => showToast('บันทึกแล้ว')}>
              <Save className="size-4" strokeWidth={1.5} aria-hidden="true" />
              บันทึก
            </Button>
          }
        />

        <div role="status" aria-live="polite" className="sr-only">
          {toast}
        </div>
        {toast ? (
          <div className="pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-pill border border-gold bg-surface px-4 py-2 text-sm text-fg shadow-card">
              <Check className="size-4 text-gold" strokeWidth={2} aria-hidden="true" />
              {toast}
            </div>
          </div>
        ) : null}

        <Card className="mt-2 overflow-hidden p-0 md:p-0" data-testid="admin-toggles">
          <SectionTitle title="เปิด/ปิดฟีเจอร์" caption="ควบคุมการแสดงผลแต่ละฟีเจอร์บนหน้าแรกและหน้าผล" />
          <ul className="divide-y divide-line-faint">
            {TOGGLE_ROWS.map(([key, label, desc]) => (
              <li key={key} className="flex min-h-14 items-center justify-between gap-4 px-4 py-3 md:px-5">
                <div className="min-w-0">
                  <label htmlFor={`toggle-${key}`} className="text-sm font-bold text-fg">
                    {label}
                  </label>
                  <p className="text-[13px] text-fg-muted">{desc}</p>
                </div>
                <Switch
                  id={`toggle-${key}`}
                  checked={toggles[key]}
                  onCheckedChange={(value) => setToggle(key, value)}
                  data-testid={`admin-toggle-${key}`}
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-5 overflow-hidden p-0 md:p-0" data-testid="admin-packages">
          <SectionTitle
            title={`แพ็กเกจ (${packages.length})`}
            caption="รายการที่แสดงบนหน้าแรกและหน้าแพ็กเกจ"
            action={
              <Button size="sm" variant="outline" onClick={handleAdd}>
                <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                เพิ่มแพ็กเกจ
              </Button>
            }
          />

          <ul className="divide-y divide-line-faint">
            {packages.map((pkg, idx) => {
              const isOpen = expandedId === pkg.id;
              const badge = badgeFor(pkg);
              const editorId = `admin-package-editor-${pkg.id}`;

              return (
                <li key={pkg.id} data-testid="admin-package-row">
                  <div className="flex items-center gap-2 px-3 py-2 md:px-4">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isOpen ? null : pkg.id)}
                      aria-expanded={isOpen}
                      aria-controls={editorId}
                      className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-card px-1 text-left transition-colors hover:bg-sunk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-pill border border-line bg-sunk text-[13px] font-bold tabular-nums text-gold">
                        {isFreePackage(pkg) ? 'ฟรี' : pkg.price}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-bold text-fg">{pkg.name || '(ยังไม่ตั้งชื่อ)'}</span>
                          {badge ? (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-pill border border-gold bg-gold-soft px-2 py-0.5 text-[13px] font-bold text-gold">
                              <Crown className="size-3" strokeWidth={1.5} aria-hidden="true" />
                              {badge}
                            </span>
                          ) : null}
                        </span>
                        <span className="block truncate text-[13px] text-fg-muted">{pkg.description || pkg.subtitle}</span>
                      </span>
                      {isOpen ? (
                        <ChevronUp className="size-4 shrink-0 text-fg-muted" strokeWidth={1.5} aria-hidden="true" />
                      ) : (
                        <ChevronDown className="size-4 shrink-0 text-fg-muted" strokeWidth={1.5} aria-hidden="true" />
                      )}
                    </button>

                    <div className="flex shrink-0 items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="border-transparent text-fg-muted"
                        onClick={() => movePackage(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`เลื่อน ${pkg.name || 'แพ็กเกจ'} ขึ้น`}
                      >
                        <ChevronUp className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="border-transparent text-fg-muted"
                        onClick={() => movePackage(idx, 1)}
                        disabled={idx === packages.length - 1}
                        aria-label={`เลื่อน ${pkg.name || 'แพ็กเกจ'} ลง`}
                      >
                        <ChevronDown className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="border-transparent text-fg-muted hover:text-danger"
                        onClick={() => handleRemove(pkg.id)}
                        aria-label={`ลบ ${pkg.name || 'แพ็กเกจ'}`}
                      >
                        <Trash2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {isOpen ? (
                    <div id={editorId}>
                      <AdminPackageEditor
                        pkg={pkg}
                        onField={(field, value) => handleField(pkg.id, field, value)}
                        onFeatureChange={(i, value) => handleFeature(pkg.id, i, value)}
                        onFeatureAdd={() => addFeature(pkg.id)}
                        onFeatureRemove={(i) => removeFeature(pkg.id, i)}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>
      </PageContainer>
    </main>
  );
}
