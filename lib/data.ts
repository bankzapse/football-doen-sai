import { getSupabase } from "./supabase";
import { seedTournaments, seedVenues, seedSponsors } from "./seed";
import type { Tournament, Venue, Sponsor } from "./types";

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

export async function getLiveTournaments(): Promise<Tournament[]> {
  const all = await getTournaments();
  return all.filter((t) => t.status === "live" && t.live_url);
}

export async function getVenues(): Promise<Venue[]> {
  const sb = getSupabase();
  if (!sb) return seedVenues;
  const { data, error } = await sb.from("venues").select("*").order("province");
  if (error || !data) return seedVenues;
  return data as unknown as Venue[];
}

export async function getSponsors(): Promise<Sponsor[]> {
  const sb = getSupabase();
  if (!sb) return seedSponsors.filter((s) => s.active);
  const { data, error } = await sb.from("sponsors").select("*").eq("active", true);
  if (error || !data) return seedSponsors.filter((s) => s.active);
  return data as unknown as Sponsor[];
}
