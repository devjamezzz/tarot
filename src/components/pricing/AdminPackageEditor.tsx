"use client";

import { Plus, X } from "lucide-react";
import type { PackageConfig } from "@/lib/packages/defaults";
import { POPULAR_BADGE_LABEL } from "@/lib/packages/defaults";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type AdminPackageEditorProps = {
  pkg: PackageConfig;
  onField: (field: keyof PackageConfig, value: string | boolean) => void;
  onFeatureChange: (index: number, value: string) => void;
  onFeatureAdd: () => void;
  onFeatureRemove: (index: number) => void;
};

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[13px] text-fg-muted">
        {label}
      </Label>
      {children}
    </div>
  );
}

/** Expanded editor for one package in the admin panel (all labels Thai). */
export function AdminPackageEditor({
  pkg,
  onField,
  onFeatureChange,
  onFeatureAdd,
  onFeatureRemove,
}: AdminPackageEditorProps) {
  const f = (name: string) => `pkg-${pkg.id}-${name}`;

  return (
    <div className="space-y-4 border-t border-line-faint bg-sunk px-4 pb-5 pt-4 md:px-5" data-testid="admin-package-editor">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={f("name")} label="ชื่อแพ็กเกจ">
          <Input id={f("name")} value={pkg.name} onChange={(e) => onField("name", e.target.value)} placeholder="ชื่อแพ็กเกจ" />
        </Field>
        <Field id={f("subtitle")} label="คำโปรย / ป้าย">
          <Input
            id={f("subtitle")}
            value={pkg.subtitle ?? ""}
            onChange={(e) => onField("subtitle", e.target.value)}
            placeholder={`${POPULAR_BADGE_LABEL} / มาใหม่`}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={f("price")} label="ราคา">
          <Input id={f("price")} value={pkg.price} onChange={(e) => onField("price", e.target.value)} placeholder="฿389 (เว้นว่าง = ฟรี)" />
        </Field>
        <Field id={f("priceAlt")} label="ราคาทางเลือก">
          <Input
            id={f("priceAlt")}
            value={pkg.priceAlt ?? ""}
            onChange={(e) => onField("priceAlt", e.target.value)}
            placeholder="฿749 (คุยสาย 1 ชั่วโมง)"
          />
        </Field>
      </div>

      <Field id={f("description")} label="คำอธิบายสั้น">
        <Input
          id={f("description")}
          value={pkg.description}
          onChange={(e) => onField("description", e.target.value)}
          placeholder="ไฟล์เอกสาร 15-20 หน้า"
        />
      </Field>

      <Field id={f("detail")} label="รายละเอียด">
        <Textarea
          id={f("detail")}
          value={pkg.detail ?? ""}
          onChange={(e) => onField("detail", e.target.value)}
          rows={2}
          placeholder="เจาะลึกทุกมิติชีวิต..."
        />
      </Field>

      <Field id={f("href")} label="ลิงก์ปลายทาง (เว้นว่างเพื่อใช้หน้ารายละเอียดแพ็กเกจ)">
        <Input id={f("href")} value={pkg.href ?? ""} onChange={(e) => onField("href", e.target.value)} placeholder="/esiimsi" />
      </Field>

      <div className="flex min-h-11 items-center gap-3">
        <Switch
          id={f("popular")}
          checked={pkg.popular ?? false}
          onCheckedChange={(value) => onField("popular", value)}
        />
        <Label htmlFor={f("popular")} className="text-[13px] text-fg-muted">
          แสดงป้าย {POPULAR_BADGE_LABEL}
        </Label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-fg-muted">รายการที่ได้รับ</p>
          <Button type="button" variant="ghost" size="sm" onClick={onFeatureAdd}>
            <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
            เพิ่มรายการ
          </Button>
        </div>
        {/* Composite key isolates rows across packages. Within a package,
            removal still shifts indices — `features` is `string[]`. */}
        {pkg.features.map((feature, index) => (
          <div key={`${pkg.id}-${index}`} className="flex gap-2">
            <Input
              value={feature}
              onChange={(e) => onFeatureChange(index, e.target.value)}
              placeholder={`รายการที่ ${index + 1}`}
              aria-label={`รายการที่ ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-12 w-12 border-transparent text-fg-muted hover:text-danger"
              onClick={() => onFeatureRemove(index)}
              aria-label={`ลบรายการที่ ${index + 1}`}
            >
              <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
