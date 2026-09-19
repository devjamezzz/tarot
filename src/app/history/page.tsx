import { redirect } from "next/navigation";

/**
 * /history is superseded by the library (บันทึก tab → /library/saved).
 * The zustand history store stays untouched for sync + tarot result flows.
 */
export default function HistoryPage() {
  redirect("/library/saved");
}
