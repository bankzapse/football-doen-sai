"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase/server";
import { savePlayerHistoryFromForm } from "@/lib/players";

function num(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

/** อัปโหลดไฟล์รูปขึ้น Supabase Storage (bucket posters) แล้วคืน public URL */
async function uploadImage(
  sb: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  file: File | null,
  prefix: string
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${prefix}-${Date.now()}.${ext}`;
  const { error } = await sb.storage.from("posters").upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) return null;
  return sb.storage.from("posters").getPublicUrl(path).data.publicUrl;
}

export async function createTournament(formData: FormData) {
  // ต้องล็อกอินก่อนเท่านั้น (ป้องกันการเรียก action ตรงๆ)
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/tournaments/new");

  const sb = getSupabaseAdmin();
  if (!sb) {
    // ยังไม่ได้ตั้งค่า Supabase — กลับไปหน้าเดิมพร้อมแจ้งเตือน
    redirect("/admin/tournaments/new?error=nodb");
  }

  const name = str(formData.get("name")) || "รายการใหม่";
  const slug =
    str(formData.get("slug")) ||
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-ก-๙]/g, "");

  // อัปโหลดโปสเตอร์ (ถ้ามี) — ใช้เป็นรูปหลัก มิฉะนั้นใช้ลิงก์รูปที่วางมา
  const posterFile = formData.get("poster_file") as File | null;
  const uploadedUrl = await uploadImage(sb!, posterFile, slug);
  const imageUrl = uploadedUrl || str(formData.get("image_url"));

  // เพิ่มสนามใหม่ถ้ามีการกรอกชื่อสนาม
  let venueId: string | null = null;
  const venueName = str(formData.get("venue_name"));
  if (venueName) {
    const { data: venue } = await sb!
      .from("venues")
      .insert({
        name: venueName,
        province: str(formData.get("province")),
        district: str(formData.get("district")),
        size: str(formData.get("venue_size")),
      })
      .select("id")
      .single();
    venueId = venue?.id ?? null;
  }

  const { error } = await sb!.from("tournaments").insert({
    slug,
    name,
    format: str(formData.get("format")) || "7",
    province: str(formData.get("province")),
    team_limit: num(formData.get("team_limit")),
    entry_fee: num(formData.get("entry_fee")),
    deposit: num(formData.get("deposit")),
    prize_total: num(formData.get("prize_total")),
    prize_champion: num(formData.get("prize_champion")),
    prize_runnerup: num(formData.get("prize_runnerup")) || null,
    prize_third: num(formData.get("prize_third")) || null,
    reg_close: str(formData.get("reg_close")),
    match_start: str(formData.get("match_start")),
    match_end: str(formData.get("match_end")),
    status: str(formData.get("status")) || "registering",
    image_url: imageUrl,
    poster_url: uploadedUrl,
    live_url: str(formData.get("live_url")),
    description: str(formData.get("description")),
    organizer_name: str(formData.get("organizer_name")),
    organizer_phone: str(formData.get("organizer_phone")),
    organizer_line: str(formData.get("organizer_line")),
    venue_id: venueId,
  });

  if (error) {
    redirect(`/admin/tournaments/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?created=1");
}

function numOrNull(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? null : n;
}

async function requireUser(next: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${next}`);
}

// ---------- ผลการแข่งขัน ----------
export async function setWinners(formData: FormData) {
  await requireUser("/admin");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("tournament_id"));
  if (sb && id) {
    await sb
      .from("tournaments")
      .update({
        champion: str(formData.get("champion")),
        runner_up: str(formData.get("runner_up")),
        third_place: str(formData.get("third_place")),
        top_scorer: str(formData.get("top_scorer")),
      })
      .eq("id", id);
    revalidatePath("/results");
    revalidatePath(`/admin/results/${id}`);
  }
  redirect(`/admin/results/${id}`);
}

export async function addMatch(formData: FormData) {
  await requireUser("/admin");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("tournament_id"));
  if (sb && id) {
    await sb.from("matches").insert({
      tournament_id: id,
      round: str(formData.get("round")) || "รอบแบ่งกลุ่ม",
      group_name: str(formData.get("group_name")),
      team_home: str(formData.get("team_home")) || "-",
      team_away: str(formData.get("team_away")) || "-",
      score_home: numOrNull(formData.get("score_home")),
      score_away: numOrNull(formData.get("score_away")),
      note: str(formData.get("note")),
      sort: numOrNull(formData.get("sort")) ?? 0,
    });
    revalidatePath(`/admin/results/${id}`);
  }
  redirect(`/admin/results/${id}`);
}

export async function deleteMatch(formData: FormData) {
  await requireUser("/admin");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  const tid = str(formData.get("tournament_id"));
  if (sb && id) {
    await sb.from("matches").delete().eq("id", id);
    revalidatePath(`/admin/results/${tid}`);
  }
  redirect(`/admin/results/${tid}`);
}

export async function addStanding(formData: FormData) {
  await requireUser("/admin");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("tournament_id"));
  if (sb && id) {
    await sb.from("standings").insert({
      tournament_id: id,
      group_name: str(formData.get("group_name")) || "กลุ่ม A",
      team_name: str(formData.get("team_name")) || "-",
      played: numOrNull(formData.get("played")) ?? 0,
      win: numOrNull(formData.get("win")) ?? 0,
      draw: numOrNull(formData.get("draw")) ?? 0,
      loss: numOrNull(formData.get("loss")) ?? 0,
      gf: numOrNull(formData.get("gf")) ?? 0,
      ga: numOrNull(formData.get("ga")) ?? 0,
      points: numOrNull(formData.get("points")) ?? 0,
      sort: numOrNull(formData.get("sort")) ?? 0,
    });
    revalidatePath(`/admin/results/${id}`);
  }
  redirect(`/admin/results/${id}`);
}

export async function deleteStanding(formData: FormData) {
  await requireUser("/admin");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  const tid = str(formData.get("tournament_id"));
  if (sb && id) {
    await sb.from("standings").delete().eq("id", id);
    revalidatePath(`/admin/results/${tid}`);
  }
  redirect(`/admin/results/${tid}`);
}

/** คำนวณตารางคะแนนอัตโนมัติจากผลรายคู่ (เฉพาะคู่ที่ระบุกลุ่มและมีสกอร์ครบ) */
export async function recalcStandings(formData: FormData) {
  await requireUser("/admin");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("tournament_id"));
  if (!sb || !id) redirect(`/admin/results/${id ?? ""}`);

  const { data: matches } = await sb!
    .from("matches")
    .select("group_name, team_home, team_away, score_home, score_away")
    .eq("tournament_id", id)
    .not("group_name", "is", null)
    .not("score_home", "is", null)
    .not("score_away", "is", null);

  type Row = {
    group_name: string; team_name: string; played: number;
    win: number; draw: number; loss: number; gf: number; ga: number; points: number;
  };
  const table = new Map<string, Row>();
  const ensure = (g: string, t: string): Row => {
    const k = `${g}||${t}`;
    if (!table.has(k))
      table.set(k, { group_name: g, team_name: t, played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, points: 0 });
    return table.get(k)!;
  };

  for (const m of (matches ?? []) as Array<Record<string, unknown>>) {
    const g = String(m.group_name);
    const home = ensure(g, String(m.team_home));
    const away = ensure(g, String(m.team_away));
    const hs = Number(m.score_home);
    const as = Number(m.score_away);
    home.played++; away.played++;
    home.gf += hs; home.ga += as; away.gf += as; away.ga += hs;
    if (hs > as) { home.win++; home.points += 3; away.loss++; }
    else if (hs < as) { away.win++; away.points += 3; home.loss++; }
    else { home.draw++; away.draw++; home.points++; away.points++; }
  }

  // ลบตารางคะแนนเดิมของรายการนี้ แล้วใส่ที่คำนวณใหม่
  await sb!.from("standings").delete().eq("tournament_id", id);
  const byGroup: Record<string, Row[]> = {};
  for (const r of table.values()) (byGroup[r.group_name] ??= []).push(r);
  const insertRows: Record<string, unknown>[] = [];
  for (const g of Object.keys(byGroup).sort()) {
    byGroup[g].sort(
      (x, y) => y.points - x.points || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf
    );
    byGroup[g].forEach((r, i) => insertRows.push({ tournament_id: id, ...r, sort: i + 1 }));
  }
  if (insertRows.length) await sb!.from("standings").insert(insertRows);

  revalidatePath("/results");
  revalidatePath(`/admin/results/${id}`);
  redirect(`/admin/results/${id}?ok=recalc`);
}

// ---------- ทีม / นักเตะ ----------
export async function createTeam(formData: FormData) {
  await requireUser("/admin/teams/new");
  const sb = getSupabaseAdmin();
  if (!sb) redirect("/admin/teams/new?error=nodb");

  // อัปโหลดโลโก้ทีม (ถ้ามี) ไม่งั้นใช้ลิงก์ที่วางมา
  const logoUrl =
    (await uploadImage(sb!, formData.get("logo_file") as File | null, "team")) ||
    str(formData.get("logo_url"));

  const { data: team, error } = await sb!
    .from("teams")
    .insert({
      name: str(formData.get("name")) || "ทีมใหม่",
      province: str(formData.get("province")),
      logo_url: logoUrl,
      manager_name: str(formData.get("manager_name")),
      coach_name: str(formData.get("coach_name")),
      coach2_name: str(formData.get("coach2_name")),
    })
    .select("id")
    .single();

  if (error || !team) redirect(`/admin/teams/new?error=${encodeURIComponent(error?.message || "insert")}`);

  const names = formData.getAll("player_name").map((v) => String(v).trim());
  const numbers = formData.getAll("player_number");
  const positions = formData.getAll("player_position");
  const photos = formData.getAll("player_photo");
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < names.length; i++) {
    if (!names[i]) continue;
    const pf = photos[i] instanceof File ? (photos[i] as File) : null;
    const photoUrl = await uploadImage(sb!, pf, `player-${i}`);
    rows.push({
      team_id: team!.id,
      name: names[i],
      number: numOrNull(numbers[i] ?? null),
      position: str(positions[i] ?? null),
      photo_url: photoUrl,
      sort: i + 1,
    });
  }
  if (rows.length) await sb!.from("players").insert(rows);

  revalidatePath("/teams");
  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function deleteTeam(formData: FormData) {
  await requireUser("/admin/teams");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (sb && id) {
    await sb.from("teams").delete().eq("id", id);
    revalidatePath("/teams");
    revalidatePath("/admin/teams");
  }
  redirect("/admin/teams");
}

export async function deleteThread(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/community");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (sb && id) {
    await sb.from("threads").delete().eq("id", id);
    revalidatePath("/admin/community");
    revalidatePath("/community");
  }
  redirect("/admin/community");
}

export async function togglePinThread(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/community");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  const pinned = str(formData.get("pinned")) === "true";
  if (sb && id) {
    await sb.from("threads").update({ pinned: !pinned }).eq("id", id);
    revalidatePath("/admin/community");
    revalidatePath("/community");
  }
  redirect("/admin/community");
}

/** อนุมัติกระทู้ที่ถูกพักไว้ (pending -> approved) */
export async function approveThread(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/community");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (sb && id) {
    await sb.from("threads").update({ status: "approved" }).eq("id", id);
    revalidatePath("/admin/community");
    revalidatePath("/community");
  }
  redirect("/admin/community");
}

// ---------- แก้ไข / ลบ รายการแข่งขัน ----------
export async function updateTournament(formData: FormData) {
  await requireUser("/admin");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (!sb || !id) redirect("/admin");

  const slug = str(formData.get("slug"));
  const posterFile = formData.get("poster_file") as File | null;
  const uploadedUrl = await uploadImage(sb!, posterFile, slug || id);
  const newImage = uploadedUrl || str(formData.get("image_url"));

  const patch: Record<string, unknown> = {
    name: str(formData.get("name")) || "รายการ",
    format: str(formData.get("format")) || "7",
    province: str(formData.get("province")) || "-",
    team_limit: num(formData.get("team_limit")),
    entry_fee: num(formData.get("entry_fee")),
    deposit: num(formData.get("deposit")),
    prize_total: num(formData.get("prize_total")),
    prize_champion: num(formData.get("prize_champion")),
    prize_runnerup: numOrNull(formData.get("prize_runnerup")),
    prize_third: numOrNull(formData.get("prize_third")),
    reg_close: str(formData.get("reg_close")),
    match_start: str(formData.get("match_start")),
    match_end: str(formData.get("match_end")),
    status: str(formData.get("status")) || "registering",
    live_url: str(formData.get("live_url")),
    description: str(formData.get("description")),
    organizer_name: str(formData.get("organizer_name")),
    organizer_phone: str(formData.get("organizer_phone")),
    organizer_line: str(formData.get("organizer_line")),
    venue_id: str(formData.get("venue_id")),
    updated_at: new Date().toISOString(),
  };
  if (slug) patch.slug = slug;
  if (newImage) patch.image_url = newImage;
  if (uploadedUrl) patch.poster_url = uploadedUrl;

  const { error } = await sb!.from("tournaments").update(patch).eq("id", id);
  if (error) {
    redirect(`/admin/tournaments/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/tournament/${slug}`);
  redirect("/admin?updated=1");
}

export async function deleteTournament(formData: FormData) {
  await requireUser("/admin");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (sb && id) {
    // matches / standings ผูกด้วย on delete cascade — ลบตามอัตโนมัติ
    await sb.from("tournaments").delete().eq("id", id);
    revalidatePath("/");
    revalidatePath("/admin");
  }
  redirect("/admin?deleted=1");
}

// ---------- สนามแข่ง (venues) ----------
function venuePayload(formData: FormData, imageUrl: string | null) {
  return {
    name: str(formData.get("name")) || "สนามใหม่",
    province: str(formData.get("province")) || "-",
    district: str(formData.get("district")),
    size: str(formData.get("size")),
    image_url: imageUrl,
    map_url: str(formData.get("map_url")),
  };
}

export async function createVenue(formData: FormData) {
  await requireUser("/admin/venues");
  const sb = getSupabaseAdmin();
  if (!sb) redirect("/admin/venues?error=nodb");
  // อัปโหลดรูปจากเครื่อง (ถ้ามี) ไม่งั้นใช้ลิงก์ที่วางมา
  const uploaded = await uploadImage(sb!, formData.get("image_file") as File | null, "venue");
  const imageUrl = uploaded || str(formData.get("image_url"));
  const { error } = await sb!.from("venues").insert(venuePayload(formData, imageUrl));
  if (error) redirect(`/admin/venues?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/venues");
  revalidatePath("/venues");
  redirect("/admin/venues?ok=created");
}

export async function updateVenue(formData: FormData) {
  await requireUser("/admin/venues");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (!sb || !id) redirect("/admin/venues");
  // ถ้าอัปโหลดรูปใหม่ให้ใช้รูปนั้น ไม่งั้นใช้ค่าลิงก์เดิม/ที่แก้ในช่อง
  const uploaded = await uploadImage(sb!, formData.get("image_file") as File | null, "venue");
  const imageUrl = uploaded || str(formData.get("image_url"));
  const { error } = await sb!.from("venues").update(venuePayload(formData, imageUrl)).eq("id", id);
  if (error) redirect(`/admin/venues/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/venues");
  revalidatePath("/venues");
  redirect("/admin/venues?ok=updated");
}

export async function deleteVenue(formData: FormData) {
  await requireUser("/admin/venues");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (sb && id) {
    // tournaments.venue_id ผูกด้วย on delete set null — ลบสนามได้ปลอดภัย
    await sb.from("venues").delete().eq("id", id);
    revalidatePath("/admin/venues");
    revalidatePath("/venues");
  }
  redirect("/admin/venues?ok=deleted");
}

// ---------- สปอนเซอร์ (sponsors) ----------
const SPONSOR_TIERS = ["platinum", "gold", "standard"];

const SPONSOR_PLACEMENTS = ["side", "bottom", "both"];

function sponsorPayload(formData: FormData, logoUrl: string | null) {
  const tier = str(formData.get("tier")) || "standard";
  const placement = str(formData.get("placement")) || "side";
  return {
    name: str(formData.get("name")) || "สปอนเซอร์ใหม่",
    logo_url: logoUrl,
    tier: SPONSOR_TIERS.includes(tier) ? tier : "standard",
    placement: SPONSOR_PLACEMENTS.includes(placement) ? placement : "side",
    website: str(formData.get("website")),
    active: str(formData.get("active")) !== "false",
  };
}

export async function createSponsor(formData: FormData) {
  await requireUser("/admin/sponsors");
  const sb = getSupabaseAdmin();
  if (!sb) redirect("/admin/sponsors?error=nodb");
  // อัปโหลดโลโก้จากเครื่อง (ถ้ามี) ไม่งั้นใช้ลิงก์ที่วางมา
  const uploaded = await uploadImage(sb!, formData.get("logo_file") as File | null, "sponsor");
  const logoUrl = uploaded || str(formData.get("logo_url"));
  const { error } = await sb!.from("sponsors").insert(sponsorPayload(formData, logoUrl));
  if (error) redirect(`/admin/sponsors?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
  redirect("/admin/sponsors?ok=created");
}

export async function updateSponsor(formData: FormData) {
  await requireUser("/admin/sponsors");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (!sb || !id) redirect("/admin/sponsors");
  // ถ้าอัปโหลดโลโก้ใหม่ให้ใช้รูปนั้น ไม่งั้นใช้ค่าลิงก์เดิม/ที่แก้ในช่อง
  const uploaded = await uploadImage(sb!, formData.get("logo_file") as File | null, "sponsor");
  const logoUrl = uploaded || str(formData.get("logo_url"));
  const { error } = await sb!.from("sponsors").update(sponsorPayload(formData, logoUrl)).eq("id", id);
  if (error) redirect(`/admin/sponsors/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
  redirect("/admin/sponsors?ok=updated");
}

export async function toggleSponsor(formData: FormData) {
  await requireUser("/admin/sponsors");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  const active = str(formData.get("active")) === "true";
  if (sb && id) {
    await sb.from("sponsors").update({ active: !active }).eq("id", id);
    revalidatePath("/admin/sponsors");
    revalidatePath("/sponsors");
  }
  redirect("/admin/sponsors");
}

/** เลื่อนลำดับสปอนเซอร์ขึ้น/ลง ภายใน section (side/bottom) */
export async function moveSponsor(formData: FormData) {
  await requireUser("/admin/sponsors");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  const dir = str(formData.get("dir"));
  const group = str(formData.get("group")); // "side" | "bottom"
  if (!sb || !id) redirect("/admin/sponsors");

  const placements = group === "bottom" ? ["bottom", "both"] : ["side", "both"];
  const { data } = await sb!
    .from("sponsors")
    .select("id, sort")
    .in("placement", placements)
    .order("sort", { ascending: true })
    .order("name", { ascending: true });
  const list = data ?? [];
  const idx = list.findIndex((s) => s.id === id);
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) redirect("/admin/sponsors");

  // จัดเลข sort ให้เรียงต่อเนื่องก่อน แล้วสลับตำแหน่งคู่ที่เลือก
  for (let i = 0; i < list.length; i++) {
    if (list[i].sort !== i) await sb!.from("sponsors").update({ sort: i }).eq("id", list[i].id);
  }
  await sb!.from("sponsors").update({ sort: swapIdx }).eq("id", list[idx].id);
  await sb!.from("sponsors").update({ sort: idx }).eq("id", list[swapIdx].id);

  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  revalidatePath("/sponsors");
  redirect("/admin/sponsors");
}

export async function deleteSponsor(formData: FormData) {
  await requireUser("/admin/sponsors");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (sb && id) {
    await sb.from("sponsors").delete().eq("id", id);
    revalidatePath("/admin/sponsors");
    revalidatePath("/sponsors");
  }
  redirect("/admin/sponsors?ok=deleted");
}

// ---------- นักเตะเดินสาย (free_players) ----------
const PLAYER_POS = ["gk", "df", "mf", "fw", "any"];
const PLAYER_FEET = ["left", "right", "both"];

function playerPayload(formData: FormData, photoUrl: string | null) {
  const position = str(formData.get("position")) || "any";
  const foot = str(formData.get("foot"));
  const age = numOrNull(formData.get("age"));
  const height = numOrNull(formData.get("height"));
  const weight = numOrNull(formData.get("weight"));
  return {
    name: str(formData.get("name")) || "นักเตะ",
    nickname: str(formData.get("nickname")),
    position: PLAYER_POS.includes(position) ? position : "any",
    province: str(formData.get("province")),
    age: age != null ? Math.round(age) : null,
    birthdate: str(formData.get("birthdate")),
    height: height != null ? Math.round(height) : null,
    weight: weight != null ? Math.round(weight) : null,
    foot: foot && PLAYER_FEET.includes(foot) ? foot : null,
    rate: str(formData.get("rate")),
    bio: str(formData.get("bio")),
    contact: str(formData.get("contact")),
    facebook: str(formData.get("facebook")),
    photo_url: photoUrl,
    status: str(formData.get("status")) === "pending" ? "pending" : "approved",
  };
}

function revalidatePlayers() {
  revalidatePath("/admin/players");
  revalidatePath("/players");
}

export async function createPlayer(formData: FormData) {
  await requireUser("/admin/players");
  const sb = getSupabaseAdmin();
  if (!sb) redirect("/admin/players?error=nodb");
  const photoFile = formData.get("photo_file") as File | null;
  const uploaded = await uploadImage(sb!, photoFile, "player");
  if (photoFile && photoFile.size > 0 && !uploaded) redirect("/admin/players?error=upload");
  const photoUrl = uploaded || str(formData.get("photo_url"));
  const { data, error } = await sb!
    .from("free_players")
    .insert(playerPayload(formData, photoUrl))
    .select("id")
    .single();
  if (error) redirect(`/admin/players?error=${encodeURIComponent(error.message)}`);
  if (data) await savePlayerHistoryFromForm(sb!, data.id, formData);
  revalidatePlayers();
  redirect("/admin/players?ok=created");
}

export async function updatePlayer(formData: FormData) {
  await requireUser("/admin/players");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (!sb || !id) redirect("/admin/players");
  const photoFile = formData.get("photo_file") as File | null;
  const uploaded = await uploadImage(sb!, photoFile, "player");
  if (photoFile && photoFile.size > 0 && !uploaded) redirect(`/admin/players/${id}?error=upload`);
  const photoUrl = uploaded || str(formData.get("photo_url"));
  const { error } = await sb!.from("free_players").update(playerPayload(formData, photoUrl)).eq("id", id);
  if (error) redirect(`/admin/players/${id}?error=${encodeURIComponent(error.message)}`);
  await savePlayerHistoryFromForm(sb!, id, formData, true);
  revalidatePlayers();
  redirect("/admin/players?ok=updated");
}

/** อนุมัติ / เลิกแสดง (สลับ pending <-> approved) */
export async function togglePlayerStatus(formData: FormData) {
  await requireUser("/admin/players");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  const status = str(formData.get("status")); // สถานะปัจจุบัน
  if (sb && id) {
    const next = status === "approved" ? "pending" : "approved";
    await sb.from("free_players").update({ status: next }).eq("id", id);
    revalidatePlayers();
  }
  redirect("/admin/players");
}

export async function deletePlayer(formData: FormData) {
  await requireUser("/admin/players");
  const sb = getSupabaseAdmin();
  const id = str(formData.get("id"));
  if (sb && id) {
    await sb.from("free_players").delete().eq("id", id);
    revalidatePlayers();
  }
  redirect("/admin/players?ok=deleted");
}
