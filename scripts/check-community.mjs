// ตรวจตารางชุมชน + storage bucket — รันด้วย: npm run db:check:community
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ok = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`\x1b[31m✗\x1b[0m ${m}`);

if (!url || !anon) { bad("ยังไม่ได้ตั้งค่า .env.local"); process.exit(1); }
const pub = createClient(url, anon, { auth: { persistSession: false } });

// threads (anon read)
const { data: threads, error: tErr } = await pub.from("threads").select("id,title,category,reply_count").limit(10);
if (tErr) bad(`ตาราง threads: ${tErr.message}`);
else {
  ok(`ตาราง threads อ่านได้ — พบ ${threads.length} กระทู้`);
  threads.forEach((t) => console.log(`   • [${t.category}] ${t.title} (${t.reply_count} ตอบ)`));
}

// replies
const { error: rErr } = await pub.from("replies").select("id", { head: true, count: "exact" });
if (rErr) bad(`ตาราง replies: ${rErr.message}`);
else ok("ตาราง replies พร้อมใช้งาน");

// storage bucket (service role)
if (service) {
  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { data: buckets, error: bErr } = await admin.storage.listBuckets();
  if (bErr) bad(`Storage: ${bErr.message}`);
  else {
    const posters = buckets.find((b) => b.id === "posters");
    if (posters) ok(`Storage bucket "posters" พร้อม (public: ${posters.public})`);
    else bad('ไม่พบ bucket "posters" — รัน supabase/storage.sql หรือสร้าง bucket ชื่อ posters');
  }
} else {
  console.log("• ข้ามการเช็ค storage (ไม่มี service role key)");
}

console.log("");
