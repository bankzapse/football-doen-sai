"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { communityWriteClient } from "@/lib/community";

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

const CATS = ["find_opponent", "join_tournament", "find_player", "buy_sell", "general"];

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
    })
    .select("id")
    .single();

  if (error) redirect(`/community/new?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/community");
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

  await sb!.from("replies").insert({
    thread_id: threadId,
    body,
    author_name,
    author_contact: str(formData.get("author_contact")),
  });

  revalidatePath(`/community/${threadId}`);
  redirect(`/community/${threadId}#replies`);
}
