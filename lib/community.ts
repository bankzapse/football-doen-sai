import { getSupabase, getSupabaseAdmin } from "./supabase";

export type ThreadCategory =
  | "find_opponent"
  | "join_tournament"
  | "find_player"
  | "buy_sell"
  | "general";

export interface Thread {
  id: string;
  category: ThreadCategory;
  title: string;
  body: string;
  province: string | null;
  author_name: string;
  author_contact: string | null;
  tournament_id: string | null;
  reply_count: number;
  pinned: boolean;
  status?: "approved" | "pending";
  author_ip?: string | null;
  created_at: string;
}

/** ซ่อนกระทู้ที่รออนุมัติออกจากหน้าสาธารณะ (resilient หากยังไม่มีคอลัมน์ status) */
const isPublic = (t: Thread) => t.status !== "pending";

export interface Reply {
  id: string;
  thread_id: string;
  body: string;
  author_name: string;
  author_contact: string | null;
  created_at: string;
}

export const CATEGORIES: { key: ThreadCategory; label: string; emoji: string; hint: string }[] = [
  { key: "find_opponent", label: "หาคู่แข่ง", emoji: "🤝", hint: "หาทีมมาอุ่นเครื่อง/ซ้อม" },
  { key: "join_tournament", label: "หาทีมลงแข่ง", emoji: "🏆", hint: "ทีมพร้อมลงรายการ / ชวนลงแข่ง" },
  { key: "find_player", label: "หานักเตะ", emoji: "👟", hint: "รับสมัคร/หานักเตะเสริม" },
  { key: "buy_sell", label: "ซื้อขาย-อุปกรณ์", emoji: "🎽", hint: "ชุดแข่ง อุปกรณ์ ของมือสอง" },
  { key: "general", label: "พูดคุยทั่วไป", emoji: "💬", hint: "เรื่องทั่วไปในวงการเดินสาย" },
];

export const CATEGORY_LABEL: Record<ThreadCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label])
) as Record<ThreadCategory, string>;

// ---- reads (anon) — คืน [] ถ้ายังไม่เชื่อม Supabase ----
// หน้าสาธารณะ: เห็นเฉพาะกระทู้ที่อนุมัติแล้ว (กรองฝั่ง JS เพื่อไม่พังหากยังไม่ได้รัน migration)
export async function getThreads(category?: string): Promise<Thread[]> {
  const sb = getSupabase();
  if (!sb) return [];
  let query = sb.from("threads").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data } = await query.limit(150);
  return ((data as Thread[]) ?? []).filter(isPublic).slice(0, 100);
}

/** สำหรับหลังบ้าน: เห็นทุกกระทู้รวมที่รออนุมัติ (pending ขึ้นก่อน) */
export async function getThreadsAdmin(): Promise<Thread[]> {
  const sb = getSupabaseAdmin() ?? getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("threads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  const rows = (data as Thread[]) ?? [];
  // pending ขึ้นก่อน
  return rows.sort((a, b) => Number(a.status === "pending" ? 0 : 1) - Number(b.status === "pending" ? 0 : 1));
}

export async function getThread(id: string): Promise<Thread | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("threads").select("*").eq("id", id).maybeSingle();
  const t = (data as Thread) ?? null;
  if (t && !isPublic(t)) return null; // กระทู้รออนุมัติ ไม่แสดงสาธารณะ
  return t;
}

export async function getReplies(threadId: string): Promise<Reply[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("replies")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  return (data as Reply[]) ?? [];
}

export async function getThreadsForTournament(tournamentId: string): Promise<Thread[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("threads")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("created_at", { ascending: false })
    .limit(20);
  return ((data as Thread[]) ?? []).filter(isPublic);
}

// ---- writes (service role) ----
export function communityWriteClient() {
  return getSupabaseAdmin();
}
