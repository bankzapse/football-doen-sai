import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * ไคลเอนต์อ่านข้อมูล (ใช้ anon key) — คืน null ถ้ายังไม่ตั้งค่า env
 * เมื่อเป็น null ระบบจะ fallback ไปใช้ข้อมูลตัวอย่าง (seed) อัตโนมัติ
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * ไคลเอนต์ฝั่งเซิร์ฟเวอร์สำหรับ "เขียน" ข้อมูลในหลังบ้าน (service role)
 * ห้ามใช้ฝั่ง client เด็ดขาด
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
