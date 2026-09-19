import { Activity, Briefcase, Clover, Coins, Heart, Minus, Orbit, type LucideIcon } from "lucide-react";
import type { WallpaperTopic } from "@/lib/tarot/topicPools";

export type WallpaperStyle = "minimal" | "cosmic";

export const TOPICS: Array<{ id: WallpaperTopic; label: string; sublabel: string; icon: LucideIcon }> = [
  { id: "finance", label: "การเงิน", sublabel: "ไพ่เหรียญ", icon: Coins },
  { id: "career", label: "การงาน", sublabel: "ไพ่ไม้เท้า", icon: Briefcase },
  { id: "love", label: "ความรัก", sublabel: "ไพ่ถ้วย", icon: Heart },
  { id: "luck", label: "โชคลาภ", sublabel: "ไพ่หลัก", icon: Clover },
  { id: "health", label: "สุขภาพ", sublabel: "ทุกชุด", icon: Activity },
];

export const STYLES: Array<{ id: WallpaperStyle; label: string; desc: string; icon: LucideIcon }> = [
  { id: "minimal", label: "มินิมอล", desc: "สะอาด เรียบ มินิมอล", icon: Minus },
  { id: "cosmic", label: "จักรวาล", desc: "กาแลคซี จักรวาล ลึกลับ", icon: Orbit },
];

export const STEP_LABELS = ["วันเกิด", "เรื่องเสริม", "ปรับแต่ง", "สไตล์"] as const;

export const MAX_CUSTOM_TEXT = 12;
export const MAX_COLORS = 2;
