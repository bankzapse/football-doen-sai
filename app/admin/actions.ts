"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function num(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

export async function createTournament(formData: FormData) {
  const sb = getSupabaseAdmin();
  if (!sb) {
    // ยังไม่ได้ตั้งค่า Supabase — กลับไปหน้าเดิมพร้อมแจ้งเตือน
    redirect("/admin/tournaments/new?error=nodb");
  }

  const name = str(formData.get("name")) || "รายการใหม่";
  const slug =
    str(formData.get("slug")) ||
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-ก-๙]/g, "");

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
    image_url: str(formData.get("image_url")),
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
