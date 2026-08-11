import { getSupabase, getSupabaseAdmin } from "./supabase";
import { seedTournaments, seedVenues, seedSponsors } from "./seed";
import type { Tournament, Venue, Sponsor, Match, Standing } from "./types";

const TOURNAMENT_SELECT = "*, venue:venues(*)";

/** ดึงรายการแข่งขันทั้งหมดที่เผยแพร่แล้ว (ไม่รวมสถานะ draft) */
export async function getTournaments(): Promise<Tournament[]> {
  const sb = getSupabase();
  if (!sb) return seedTournaments.filter((t) => t.status !== "draft");

  const { data, error } = await sb
    .from("tournaments")
    .select(TOURNAMENT_SELECT)
    .neq("status", "draft")
    .order("match_start", { ascending: true });

  if (error || !data) return seedTournaments.filter((t) => t.status !== "draft");
  return data as unknown as Tournament[];
}

/** ดึงทุกแถว (รวม draft) สำหรับหลังบ้าน */
export async function getAllTournamentsAdmin(): Promise<Tournament[]> {
  const sb = getSupabase();
  if (!sb) return seedTournaments;
  const { data, error } = await sb
    .from("tournaments")
    .select(TOURNAMENT_SELECT)
    .order("match_start", { ascending: false });
  if (error || !data) return seedTournaments;
  return data as unknown as Tournament[];
}

export async function getTournamentBySlug(slug: string): Promise<Tournament | null> {
  const sb = getSupabase();
  if (!sb) return seedTournaments.find((t) => t.slug === slug) ?? null;
  const { data, error } = await sb
    .from("tournaments")
    .select(TOURNAMENT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return seedTournaments.find((t) => t.slug === slug) ?? null;
  return data as unknown as Tournament;
}

export async function getTournamentById(id: string): Promise<Tournament | null> {
  const sb = getSupabase();
  if (!sb) return seedTournaments.find((t) => t.id === id) ?? null;
  const { data, error } = await sb
    .from("tournaments")
    .select(TOURNAMENT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as Tournament;
}

export async function getLiveTournaments(): Promise<Tournament[]> {
  const all = await getTournaments();
  return all.filter((t) => t.status === "live" && t.live_url);
}

export async function getFinishedTournaments(): Promise<Tournament[]> {
  const all = await getTournaments();
  return all
    .filter((t) => t.status === "finished")
    .sort((a, b) => (b.match_start || "").localeCompare(a.match_start || ""));
}

export async function getMatches(tournamentId: string): Promise<Match[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("matches")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("sort", { ascending: true });
  return (data as Match[]) ?? [];
}

export async function getStandings(tournamentId: string): Promise<Standing[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("standings")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("group_name", { ascending: true })
    .order("points", { ascending: false })
    .order("sort", { ascending: true });
  return (data as Standing[]) ?? [];
}

export async function getVenues(): Promise<Venue[]> {
  const sb = getSupabase();
  if (!sb) return seedVenues;
  const { data, error } = await sb.from("venues").select("*").order("province");
  if (error || !data) return seedVenues;
  return data as unknown as Venue[];
}

export async function getVenueById(id: string): Promise<Venue | null> {
  const sb = getSupabase();
  if (!sb) return seedVenues.find((v) => v.id === id) ?? null;
  const { data } = await sb.from("venues").select("*").eq("id", id).maybeSingle();
  return (data as Venue) ?? null;
}

export async function getSponsors(): Promise<Sponsor[]> {
  const sb = getSupabase();
  if (!sb) return seedSponsors.filter((s) => s.active);
  const { data, error } = await sb
    .from("sponsors")
    .select("*")
    .eq("active", true)
    .order("sort", { ascending: true })
    .order("name", { ascending: true });
  if (error || !data) return seedSponsors.filter((s) => s.active);
  return data as unknown as Sponsor[];
}

/** สปอนเซอร์ทั้งหมดสำหรับหลังบ้าน (รวมที่ซ่อนอยู่) — ต้องใช้ service role อ่านตัวที่ active=false */
export async function getAllSponsorsAdmin(): Promise<Sponsor[]> {
  const sb = getSupabaseAdmin() ?? getSupabase();
  if (!sb) return seedSponsors;
  const { data, error } = await sb
    .from("sponsors")
    .select("*")
    .order("sort", { ascending: true })
    .order("name", { ascending: true });
  if (error || !data) return seedSponsors;
  return data as unknown as Sponsor[];
}

export async function getSponsorById(id: string): Promise<Sponsor | null> {
  const sb = getSupabaseAdmin() ?? getSupabase();
  if (!sb) return seedSponsors.find((s) => s.id === id) ?? null;
  const { data } = await sb.from("sponsors").select("*").eq("id", id).maybeSingle();
  return (data as Sponsor) ?? null;
}
