"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

// ไม่นับหน้าหลังบ้าน/ระบบ
const IGNORE_PREFIXES = ["/admin", "/login", "/auth", "/api"];

/** บันทึกการเข้าชม 1 ครั้ง (เรียกจาก client ตอนโหลดหน้า) */
export async function recordView(path: string) {
  if (!path || typeof path !== "string") return;
  const clean = path.split(/[?#]/)[0].slice(0, 300);
  if (IGNORE_PREFIXES.some((p) => clean === p || clean.startsWith(p + "/"))) return;

  const sb = getSupabaseAdmin();
  if (!sb) return;
  // เขียนแบบ fire-and-forget — ไม่ให้พังหน้าเว็บถ้าบันทึกไม่สำเร็จ
  await sb.from("page_views").insert({ path: clean });
}
