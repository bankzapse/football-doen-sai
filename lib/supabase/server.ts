import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Supabase client ฝั่ง server ที่ผูกกับ cookie ของผู้ใช้ (ใช้เช็ค session/ล็อกอิน) */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ถูกเรียกจาก Server Component — ข้ามได้ (middleware จะ refresh ให้เอง)
          }
        },
      },
    }
  );
}

/** คืน user ปัจจุบัน (null ถ้ายังไม่ล็อกอิน) */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
