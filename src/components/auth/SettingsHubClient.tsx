"use client";

import * as React from "react";
import {
  Package,
  Bookmark,
  UserRound,
  ShieldCheck,
  FileText,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "./authContext";
import { SessionCard } from "./SessionCard";
import { LinkListCard, AboutCard, type SettingsLink } from "./SettingsRows";

const MENU_LINKS: SettingsLink[] = [
  { href: "/pricing", label: "แพ็กเกจ", desc: "ดูหรืออัปเกรดแพ็กเกจของคุณ", icon: Package },
  { href: "/library/saved", label: "บันทึกของฉัน", desc: "ไพ่และผลดูดวงที่บันทึกไว้", icon: Bookmark },
  { href: "/profile", label: "บัญชีของฉัน", desc: "ข้อมูลบัญชีและเครดิต", icon: UserRound },
  { href: "/privacy", label: "ความเป็นส่วนตัว", desc: "นโยบายการเก็บและใช้ข้อมูล", icon: ShieldCheck },
  { href: "/terms", label: "ข้อกำหนด", desc: "เงื่อนไขการใช้บริการ", icon: FileText },
];

const ADMIN_LINKS: SettingsLink[] = [
  { href: "/admin/customers", label: "ลูกค้า (CRM)", desc: "รายชื่อสมาชิกและเครดิต", icon: Users },
  { href: "/admin-config-panel", label: "ตั้งค่าระบบ", desc: "เปิด-ปิดฟีเจอร์และแพ็กเกจ", icon: SlidersHorizontal },
];

/** Account & settings hub body (the ตั้งค่า tab). */
export function SettingsHubClient({ version }: { version?: string }) {
  const { user } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-[360px_minmax(0,1fr)] md:items-start md:gap-6">
      <SessionCard />
      <div className="space-y-4">
        <LinkListCard title="เมนู" links={MENU_LINKS} testId="settings-menu" />
        {user?.isAdmin ? (
          <LinkListCard title="ผู้ดูแลระบบ" links={ADMIN_LINKS} testId="settings-admin" />
        ) : null}
        <AboutCard version={version} />
      </div>
    </div>
  );
}
