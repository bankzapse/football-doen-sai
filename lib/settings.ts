import { getSupabase } from "./supabase";

export interface SiteSettings {
  gridCols: number; // 2 | 3 | 4
  gridRows: number; // 0 = ไม่จำกัด (แสดงทุกแถว)
}

const DEFAULTS: SiteSettings = { gridCols: 2, gridRows: 0 };

/** อ่านค่าตั้งค่าเว็บ (resilient — คืนค่าเริ่มต้นถ้ายังไม่มีตาราง) */
export async function getSiteSettings(): Promise<SiteSettings> {
  const sb = getSupabase();
  if (!sb) return DEFAULTS;
  const { data, error } = await sb.from("site_settings").select("key, value");
  if (error || !data) return DEFAULTS;
  const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
  const cols = parseInt(map.home_grid_columns, 10);
  const rows = parseInt(map.home_grid_rows, 10);
  return {
    gridCols: [2, 3, 4].includes(cols) ? cols : DEFAULTS.gridCols,
    gridRows: Number.isFinite(rows) && rows >= 0 ? rows : DEFAULTS.gridRows,
  };
}
