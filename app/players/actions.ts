"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { playersWriteClient, savePlayerHistoryFromForm } from "@/lib/players";

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

function intOrNull(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? null : n;
}

const POS = ["gk", "df", "mf", "fw", "any"];
const FEET = ["left", "right", "both"];

async function uploadPhoto(
  sb: NonNullable<ReturnType<typeof playersWriteClient>>,
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `player-${Date.now()}.${ext}`;
  const { error } = await sb.storage.from("posters").upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) return null;
  return sb.storage.from("posters").getPublicUrl(path).data.publicUrl;
}

/** นักเตะโพสต์เอง — บันทึกเป็น pending รอแอดมินอนุมัติ */
export async function submitPlayerAction(formData: FormData) {
  const sb = playersWriteClient();
  if (!sb) redirect("/players/join?error=nodb");

  // honeypot กันบอท
  if (str(formData.get("website"))) redirect("/players");

  const name = str(formData.get("name"));
  const contact = str(formData.get("contact"));
  if (!name || !contact) redirect("/players/join?error=missing");

  const position = str(formData.get("position")) || "any";
  const foot = str(formData.get("foot"));
  const photoUrl = await uploadPhoto(sb!, formData.get("photo_file") as File | null);

  const { data, error } = await sb!
    .from("free_players")
    .insert({
      name,
      nickname: str(formData.get("nickname")),
      position: POS.includes(position) ? position : "any",
      province: str(formData.get("province")),
      age: intOrNull(formData.get("age")),
      birthdate: str(formData.get("birthdate")),
      height: intOrNull(formData.get("height")),
      weight: intOrNull(formData.get("weight")),
      foot: foot && FEET.includes(foot) ? foot : null,
      rate: str(formData.get("rate")),
      bio: str(formData.get("bio")),
      contact,
      facebook: str(formData.get("facebook")),
      photo_url: photoUrl,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) redirect(`/players/join?error=${encodeURIComponent(error.message)}`);
  if (data) await savePlayerHistoryFromForm(sb!, data.id, formData);

  revalidatePath("/players");
  redirect("/players?ok=1");
}
