import { createBrowserClient } from "@supabase/ssr";

/** Supabase client ฝั่ง browser (ใช้ในฟอร์มล็อกอิน) */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
