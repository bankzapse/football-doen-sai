import { getSupabaseAdmin } from "./supabase";

export interface SiteViewStats {
  today: number;
  last7: number;
  last30: number;
  total: number;
}

export interface TournamentViews {
  slug: string;
  views: number;
}

function sinceISO(days: number): string {
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - ms).toISOString();
}

async function countSince(
  sb: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  since?: string
): Promise<number> {
  let q = sb.from("page_views").select("*", { count: "exact", head: true });
  if (since) q = q.gte("created_at", since);
  const { count } = await q;
  return count ?? 0;
}

/** ยอดเข้าชมทั้งเว็บ: วันนี้(24 ชม.) / 7 วัน / 30 วัน / ทั้งหมด */
export async function getSiteViewStats(): Promise<SiteViewStats | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const [today, last7, last30, total] = await Promise.all([
    countSince(sb, sinceISO(1)),
    countSince(sb, sinceISO(7)),
    countSince(sb, sinceISO(30)),
    countSince(sb),
  ]);
  return { today, last7, last30, total };
}

/** ยอดเข้าชมรายรายการแข่ง — นับ path ที่ขึ้นต้นด้วย /tournament/ แล้วจับคู่ slug */
export async function getTournamentViews(): Promise<Map<string, number>> {
  const sb = getSupabaseAdmin();
  const map = new Map<string, number>();
  if (!sb) return map;
  const { data } = await sb
    .from("page_views")
    .select("path")
    .like("path", "/tournament/%")
    .limit(100000);
  for (const row of (data as { path: string }[]) ?? []) {
    const slug = row.path.replace("/tournament/", "").split(/[/?#]/)[0];
    if (slug) map.set(slug, (map.get(slug) ?? 0) + 1);
  }
  return map;
}
