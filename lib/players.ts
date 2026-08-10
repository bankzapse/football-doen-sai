import { getSupabase, getSupabaseAdmin } from "./supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PlayerPosition = "gk" | "df" | "mf" | "fw" | "any";
export type PlayerFoot = "left" | "right" | "both";

export interface FreePlayer {
  id: string;
  name: string;
  nickname: string | null;
  position: PlayerPosition;
  province: string | null;
  age: number | null;
  birthdate: string | null;
  height: number | null;
  weight: number | null;
  foot: PlayerFoot | null;
  rate: string | null; // ค่าตัว / เรทต่อแมตช์
  bio: string | null; // สถิติ / โปรไฟล์
  contact: string | null;
  facebook: string | null;
  photo_url: string | null;
  status: "pending" | "approved";
  created_at: string;
}

export interface PlayerHistory {
  id: string;
  player_id: string;
  period: string | null;
  club: string | null;
  note: string | null;
  sort: number;
}

export async function getPlayerHistory(playerId: string): Promise<PlayerHistory[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("player_history")
    .select("*")
    .eq("player_id", playerId)
    .order("sort", { ascending: true });
  return (data as PlayerHistory[]) ?? [];
}

/** บันทึกประวัติการเล่นจากฟอร์ม (history_period[]/history_club[]/history_note[]) */
export async function savePlayerHistoryFromForm(
  sb: SupabaseClient,
  playerId: string,
  formData: FormData,
  replace = false
): Promise<void> {
  const periods = formData.getAll("history_period");
  const clubs = formData.getAll("history_club");
  const notes = formData.getAll("history_note");
  const n = Math.max(periods.length, clubs.length, notes.length);
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < n; i++) {
    const period = String(periods[i] ?? "").trim();
    const club = String(clubs[i] ?? "").trim();
    const note = String(notes[i] ?? "").trim();
    if (!period && !club && !note) continue;
    rows.push({ player_id: playerId, period: period || null, club: club || null, note: note || null, sort: i + 1 });
  }
  if (replace) await sb.from("player_history").delete().eq("player_id", playerId);
  if (rows.length) await sb.from("player_history").insert(rows);
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
