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
  created_at: string;
}

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
export async function getThreads(category?: string): Promise<Thread[]> {
  const sb = getSupabase();
  if (!sb) return [];
  let query = sb.from("threads").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data } = await query.limit(100);
  return (data as Thread[]) ?? [];
}

export async function getThread(id: string): Promise<Thread | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("threads").select("*").eq("id", id).maybeSingle();
  return (data as Thread) ?? null;
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
  return (data as Thread[]) ?? [];
}

// ---- writes (service role) ----
export function communityWriteClient() {
  return getSupabaseAdmin();
}
