import { getSupabase } from "./supabase";
import type { Team, Player } from "./types";

export async function getTeams(): Promise<Team[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("teams")
    .select("*, players(*)")
    .order("name", { ascending: true });
  return (data as Team[]) ?? [];
}

export async function getTeam(id: string): Promise<Team | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("teams")
    .select("*, players(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const team = data as Team;
  team.players = (team.players ?? []).sort(
    (a: Player, b: Player) => (a.sort ?? 0) - (b.sort ?? 0)
  );
  return team;
}
