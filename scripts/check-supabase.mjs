// ตรวจการเชื่อมต่อ Supabase — รันด้วย: npm run db:check
// (โหลด .env.local อัตโนมัติผ่าน --env-file ใน package.json)
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ok = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`\x1b[31m✗\x1b[0m ${m}`);

if (!url || !anon) {
  bad("ยังไม่ได้ตั้งค่า .env.local (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  console.log("  → เปิดไฟล์ .env.local แล้ววางคีย์จาก Supabase ก่อนครับ");
  process.exit(1);
}

console.log(`\nกำลังทดสอบเชื่อมต่อ: ${url}\n`);

const pub = createClient(url, anon, { auth: { persistSession: false } });

// 1) อ่านข้อมูลด้วย anon key (ทดสอบ RLS + ตาราง)
const { data: reads, error: readErr } = await pub
  .from("tournaments")
  .select("slug,name,status")
  .limit(5);

if (readErr) {
  bad(`อ่านตาราง tournaments ไม่ได้: ${readErr.message}`);
  console.log("  → ตรวจว่ารัน supabase/schema.sql แล้วหรือยัง");
  process.exit(1);
}
ok(`อ่านข้อมูลได้ (anon) — พบ ${reads.length} รายการที่เผยแพร่`);
reads.forEach((t) => console.log(`   • ${t.name} [${t.status}]`));

// 2) ทดสอบสิทธิ์เขียนด้วย service role (ถ้ามีคีย์)
if (service) {
  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { count, error: cErr } = await admin
    .from("tournaments")
    .select("*", { count: "exact", head: true });
  if (cErr) bad(`service role ใช้ไม่ได้: ${cErr.message}`);
  else ok(`service role ใช้งานได้ — มีทั้งหมด ${count} รายการในฐานข้อมูล (รวม draft)`);
} else {
  console.log("• ยังไม่ได้ใส่ SUPABASE_SERVICE_ROLE_KEY (จำเป็นสำหรับบันทึกข้อมูลในหลังบ้าน)");
}

console.log("\n\x1b[32mพร้อมใช้งาน! รีสตาร์ท npm run dev เพื่อสลับไปใช้ฐานข้อมูลจริง\x1b[0m\n");
