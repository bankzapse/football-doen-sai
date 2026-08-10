import { getSupabase, getSupabaseAdmin } from "./supabase";

export type PlayerPosition = "gk" | "df" | "mf" | "fw" | "any";
export type PlayerFoot = "left" | "right" | "both";

export interface FreePlayer {
  id: string;
  name: string;
  nickname: string | null;
  position: PlayerPosition;
  province: string | null;
  age: number | null;
  height: number | null;
  foot: PlayerFoot | null;
  rate: string | null; // ค่าตัว / เรทต่อแมตช์
  bio: string | null; // สถิติ / โปรไฟล์
  contact: string | null;
  photo_url: string | null;
  status: "pending" | "approved";
  created_at: string;
}

export const POSITIONS: { key: PlayerPosition; label: string; emoji: string }[] = [
  { key: "fw", label: "กองหน้า", emoji: "⚽" },
  { key: "mf", label: "กองกลาง", emoji: "🎯" },
  { key: "df", label: "กองหลัง", emoji: "🛡️" },
  { key: "gk", label: "ผู้รักษาประตู", emoji: "🧤" },
  { key: "any", label: "ได้ทุกตำแหน่ง", emoji: "🔁" },
];

export const POSITION_LABEL: Record<PlayerPosition, string> = Object.fromEntries(
  POSITIONS.map((p) => [p.key, p.label])
) as Record<PlayerPosition, string>;

export const FOOT_LABEL: Record<PlayerFoot, string> = {
  left: "เท้าซ้าย",
  right: "เท้าขวา",
  both: "สองเท้า",
};

// ---- reads (anon) — เห็นเฉพาะที่อนุมัติแล้ว ----
export async function getApprovedPlayers(filters?: {
  position?: string;
  province?: string;
}): Promise<FreePlayer[]> {
  const sb = getSupabase();
  if (!sb) return [];
  let q = sb
    .from("free_players")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (filters?.position) q = q.eq("position", filters.position);
  if (filters?.province) q = q.eq("province", filters.province);
  const { data } = await q.limit(200);
  return (data as FreePlayer[]) ?? [];
}

/** นักเตะที่อยู่จังหวัดเดียวกับรายการแข่ง (โชว์ในหน้า detail) */
export async function getPlayersByProvince(
  province: string,
  limit = 3
): Promise<FreePlayer[]> {
  const sb = getSupabase();
  if (!sb || !province) return [];
  const { data } = await sb
    .from("free_players")
    .select("*")
    .eq("status", "approved")
    .eq("province", province)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as FreePlayer[]) ?? [];
}

// ---- reads (service role) — รวม pending สำหรับหลังบ้าน ----
export async function getAllPlayersAdmin(): Promise<FreePlayer[]> {
  const sb = getSupabaseAdmin() ?? getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("free_players")
    .select("*")
    // รออนุมัติขึ้นก่อน แล้วเรียงตามเวลาล่าสุด
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  return (data as FreePlayer[]) ?? [];
}

export async function getPlayerById(id: string): Promise<FreePlayer | null> {
  const sb = getSupabaseAdmin() ?? getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("free_players").select("*").eq("id", id).maybeSingle();
  return (data as FreePlayer) ?? null;
}

/** จังหวัดที่มีนักเตะ (สำหรับฟิลเตอร์) */
export async function getPlayerProvinces(): Promise<string[]> {
  const players = await getApprovedPlayers();
  return Array.from(new Set(players.map((p) => p.province).filter(Boolean) as string[])).sort();
}

// ---- write client (service role) ----
export function playersWriteClient() {
  return getSupabaseAdmin();
}
