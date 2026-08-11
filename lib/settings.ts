import { getSupabase } from "./supabase";

/** section หน้าแรกที่จัดลำดับได้ (key + ป้ายในหลังบ้าน) */
export const HOME_SECTIONS: { key: string; label: string }[] = [
  { key: "cta", label: "แถบชวนจัดรายการ (ประชาสัมพันธ์)" },
  { key: "schedule", label: "ตารางแข่งขันทั้งหมด" },
  { key: "sponsors", label: "สปอนเซอร์ & พาร์ทเนอร์ (แถบล่าง)" },
  { key: "players", label: "หานักเตะเดินสาย" },
  { key: "community", label: "คุยกันในชุมชน" },
];

export const DEFAULT_SECTION_ORDER = HOME_SECTIONS.map((s) => s.key);

/** ทำให้ลำดับสมบูรณ์: ตัด key ที่ไม่รู้จักทิ้ง + เติม section ที่ขาดไว้ท้าย */
export function normalizeSectionOrder(order: string[]): string[] {
  const known = new Set(DEFAULT_SECTION_ORDER);
  const cleaned = order.filter((k) => known.has(k));
  for (const k of DEFAULT_SECTION_ORDER) if (!cleaned.includes(k)) cleaned.push(k);
  return cleaned;
}

export interface SiteSettings {
  gridCols: number; // 2 | 3 | 4
  gridRows: number; // 0 = ไม่จำกัด (แสดงทุกแถว)
  sectionOrder: string[];
}

const DEFAULTS: SiteSettings = { gridCols: 2, gridRows: 0, sectionOrder: DEFAULT_SECTION_ORDER };

/** อ่านค่าตั้งค่าเว็บ (resilient — คืนค่าเริ่มต้นถ้ายังไม่มีตาราง) */
export async function getSiteSettings(): Promise<SiteSettings> {
  const sb = getSupabase();
  if (!sb) return DEFAULTS;
  const { data, error } = await sb.from("site_settings").select("key, value");
  if (error || !data) return DEFAULTS;
  const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
  const cols = parseInt(map.home_grid_columns, 10);
  const rows = parseInt(map.home_grid_rows, 10);
  const orderRaw = (map.home_section_order || "").split(",").map((s: string) => s.trim()).filter(Boolean);
  return {
    gridCols: [2, 3, 4].includes(cols) ? cols : DEFAULTS.gridCols,
    gridRows: Number.isFinite(rows) && rows >= 0 ? rows : DEFAULTS.gridRows,
    sectionOrder: normalizeSectionOrder(orderRaw),
  };
}
