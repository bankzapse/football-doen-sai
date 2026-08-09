// เช็คตาราง ผล/คะแนน/ทีม/นักเตะ — รันด้วย: npm run db:check:rt
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ok = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`\x1b[31m✗\x1b[0m ${m}`);
if (!url || !anon) { bad("ยังไม่ได้ตั้งค่า .env.local"); process.exit(1); }
const sb = createClient(url, anon, { auth: { persistSession: false } });

async function count(table) {
  const { count, error } = await sb.from(table).select("*", { head: true, count: "exact" });
  if (error) { bad(`ตาราง ${table}: ${error.message}`); return false; }
  ok(`ตาราง ${table} — ${count} แถว`);
  return true;
}

await count("teams");
await count("players");
await count("matches");
await count("standings");

// คอลัมน์ผู้ชนะ
const { data: champ, error: cErr } = await sb
  .from("tournaments").select("name,champion,runner_up,top_scorer").not("champion", "is", null).limit(5);
if (cErr) bad(`คอลัมน์ผู้ชนะ: ${cErr.message}`);
else {
  ok(`มีรายการที่บันทึกแชมป์แล้ว ${champ.length} รายการ`);
  champ.forEach((t) => console.log(`   • ${t.name} → แชมป์: ${t.champion}`));
}

// ทีมตัวอย่าง + นักเตะ
const { data: team } = await sb.from("teams").select("name, players(name)").ilike("name", "%KWANSIRI%").maybeSingle();
if (team) ok(`ทีม ${team.name} มีนักเตะ ${team.players?.length ?? 0} คน`);

console.log("");
