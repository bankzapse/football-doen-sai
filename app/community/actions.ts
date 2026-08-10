"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { communityWriteClient } from "@/lib/community";

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

const CATS = ["find_opponent", "join_tournament", "find_player", "buy_sell", "general"];

// จำนวนลิงก์ในข้อความ — ถ้ามากผิดปกติจะพักไว้ให้แอดมินตรวจ
function linkCount(text: string): number {
  return (text.match(/https?:\/\/|www\.|t\.me\/|line\.me\//gi) || []).length;
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

async function countSince(
  sb: NonNullable<ReturnType<typeof communityWriteClient>>,
  table: "threads" | "replies",
  ip: string,
  sinceIso: string
): Promise<number> {
  const { count, error } = await sb
    .from(table)
    .select("*", { head: true, count: "exact" })
    .eq("author_ip", ip)
    .gte("created_at", sinceIso);
  return error ? 0 : count ?? 0; // fails open ถ้ายังไม่มีคอลัมน์ author_ip
}

/** คืน error code ถ้าโพสต์ถี่/เกินโควตา, null ถ้าผ่าน */
async function checkRateLimit(
  sb: NonNullable<ReturnType<typeof communityWriteClient>>,
  ip: string
): Promise<string | null> {
  if (ip === "unknown") return null;
  const now = Date.now();
  const t30 = new Date(now - 30_000).toISOString();
  const t1h = new Date(now - 3_600_000).toISOString();

  const recent =
    (await countSince(sb, "threads", ip, t30)) + (await countSince(sb, "replies", ip, t30));
  if (recent >= 1) return "rate"; // โพสต์ได้ทุก 30 วินาที

  const hourly =
    (await countSince(sb, "threads", ip, t1h)) + (await countSince(sb, "replies", ip, t1h));
  if (hourly >= 10) return "hourly"; // สูงสุด 10 โพสต์/ชั่วโมง

  return null;
}

export async function createThreadAction(formData: FormData) {
  const sb = communityWriteClient();
  if (!sb) redirect("/community?error=nodb");

  // honeypot กันบอทเบื้องต้น
  if (str(formData.get("website"))) redirect("/community");

  const category = str(formData.get("category")) || "general";
  const title = str(formData.get("title"));
  const body = str(formData.get("body"));
  const author_name = str(formData.get("author_name"));

  if (!title || !body || !author_name || !CATS.includes(category)) {
    redirect("/community/new?error=missing");
  }

  const ip = await getClientIp();
  const limited = await checkRateLimit(sb!, ip);
  if (limited) redirect(`/community/new?error=${limited}`);

  // ลิงก์เยอะผิดปกติ → พักไว้ให้แอดมินตรวจก่อนแสดง
  const status = linkCount(`${title} ${body}`) > 2 ? "pending" : "approved";

  const { data, error } = await sb!
    .from("threads")
    .insert({
      category,
      title,
      body,
      province: str(formData.get("province")),
      author_name,
      author_contact: str(formData.get("author_contact")),
      tournament_id: str(formData.get("tournament_id")),
      author_ip: ip,
      status,
    })
    .select("id")
    .single();

  if (error) redirect(`/community/new?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/community");
  if (status === "pending") redirect("/community?pending=1");
  redirect(`/community/${data!.id}`);
}

export async function addReplyAction(formData: FormData) {
  const sb = communityWriteClient();
  const threadId = str(formData.get("thread_id"));
  if (!sb || !threadId) redirect("/community");

  if (str(formData.get("website"))) redirect(`/community/${threadId}`);

  const body = str(formData.get("body"));
  const author_name = str(formData.get("author_name"));
  if (!body || !author_name) redirect(`/community/${threadId}?error=missing`);

  const ip = await getClientIp();
  const limited = await checkRateLimit(sb!, ip);
  if (limited) redirect(`/community/${threadId}?error=${limited}#replies`);

  await sb!.from("replies").insert({
    thread_id: threadId,
    body,
    author_name,
    author_contact: str(formData.get("author_contact")),
    author_ip: ip,
  });

  revalidatePath(`/community/${threadId}`);
  redirect(`/community/${threadId}#replies`);
}
