// นำเข้าข้อมูลตัวอย่างสมจริงเข้า Supabase — รันด้วย: npm run db:seed
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error("✗ ต้องตั้งค่า NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ใน .env.local ก่อน");
  process.exit(1);
}
const sb = createClient(url, service, { auth: { persistSession: false } });

const IMG = {
  night: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=60",
  pitch: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=60",
  ball: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1600&q=60",
  goal: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=1600&q=60",
  flood: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1600&q=60",
  seats: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1600&q=60",
};

const V = {
  nongsang: "11111111-1111-1111-1111-111111111111",
  chapamong: "22222222-2222-2222-2222-222222222222",
  nonglalok: "33333333-3333-3333-3333-333333333333",
  chaiyaphum: "44444444-4444-4444-4444-444444444444",
  khonkaen: "55555555-5555-5555-5555-555555555555",
  korat: "66666666-6666-6666-6666-666666666666",
  buriram: "77777777-7777-7777-7777-777777777777",
  chiangmai: "88888888-8888-8888-8888-888888888888",
};

const venues = [
  { id: V.nongsang, name: "Nongsang Stadium", province: "ชลบุรี", district: "พนัสนิคม", size: "70×50 เมตร (หญ้าจริง)", image_url: IMG.pitch },
  { id: V.chapamong, name: "สนามฉ่าปาโมง", province: "กรุงเทพมหานคร", district: "หนองจอก", size: "72×50 เมตร", image_url: IMG.flood },
  { id: V.nonglalok, name: "สนามหนองละลอก", province: "ระยอง", district: "บ้านค่าย", size: "68×48 เมตร", image_url: IMG.ball },
  { id: V.chaiyaphum, name: "สนามเทศบาลชัยภูมิ", province: "ชัยภูมิ", district: "เมืองชัยภูมิ", size: "หญ้าเทียม", image_url: IMG.goal },
  { id: V.khonkaen, name: "สนามกีฬากลางขอนแก่น", province: "ขอนแก่น", district: "เมืองขอนแก่น", size: "มาตรฐาน 11 คน", image_url: IMG.seats },
  { id: V.korat, name: "โคราช ซอคเกอร์ อารีน่า", province: "นครราชสีมา", district: "เมืองนครราชสีมา", size: "หญ้าเทียม 5 สนาม", image_url: IMG.night },
  { id: V.buriram, name: "บุรีรัมย์ มินิ สเตเดียม", province: "บุรีรัมย์", district: "เมืองบุรีรัมย์", size: "70×45 เมตร", image_url: IMG.flood },
  { id: V.chiangmai, name: "สนามล้านนา ฟุตบอลพาร์ค", province: "เชียงใหม่", district: "สันทราย", size: "หญ้าเทียม", image_url: IMG.pitch },
];

const T = (o) => ({ deposit: 1000, prize_runnerup: null, prize_third: null, reg_open: "2026-07-01", ...o });

const tournaments = [
  T({ slug: "nongsang-m7seven-open-cup-2026-1", name: "NONGSANG × M7SEVEN OPEN CUP 2026 #1", format: "7", province: "ชลบุรี", team_limit: 32, entry_fee: 8000, deposit: 1000, prize_total: 130000, prize_champion: 100000, prize_runnerup: 20000, prize_third: 5000, reg_close: "2026-08-26", match_start: "2026-08-29", match_end: "2026-08-30", status: "live", image_url: IMG.night, live_url: "https://www.facebook.com/SRC.Sriracha", description: "ฟุตบอล 7 คน มาตรฐาน 7 สี ชิงถ้วยท่านสมศักดิ์ เทพสุทิน", organizer_name: "เปาต้น วรินทร สัสดี", organizer_phone: "064-642-2168", organizer_line: "Kruton252629", venue_id: V.nongsang }),
  T({ slug: "chapamong-cup-5", name: "เงินแสน ฉ่าปาโมงคัพ ครั้งที่ 5", format: "7", province: "กรุงเทพมหานคร", team_limit: 24, entry_fee: 6000, prize_total: 100000, prize_champion: 80000, prize_runnerup: 15000, prize_third: 5000, reg_close: "2026-09-08", match_start: "2026-09-12", match_end: "2026-09-13", status: "registering", image_url: IMG.flood, live_url: "https://www.youtube.com/@kwansiri", description: "ฟุตบอล 7 คน เงินแสน ชิงแชมป์กรุงเทพฯ 24 ทีม", organizer_name: "ทีมงานฉ่าปาโมง", organizer_phone: "081-234-5678", organizer_line: "chapamong", venue_id: V.chapamong }),
  T({ slug: "nonglalok-super7", name: "หนองละลอก ซูเปอร์ 7 ลีก", format: "7", province: "ระยอง", team_limit: 16, entry_fee: 4000, deposit: 500, prize_total: 60000, prize_champion: 40000, prize_runnerup: 12000, prize_third: 4000, reg_close: "2026-08-14", match_start: "2026-08-16", status: "closing", image_url: IMG.ball, live_url: "https://www.facebook.com/meree.live", description: "ฟุตบอล 7 คน ระยอง จบใน 1 วัน 16 ทีม", organizer_name: "เมรีย์ สปอร์ต", organizer_phone: "089-111-2222", organizer_line: "mereesport", venue_id: V.nonglalok }),
  T({ slug: "larb-chaiyaphum-cup-3", name: "ลาบชัยภูมิ คัพ ครั้งที่ 3", format: "9", province: "ชัยภูมิ", team_limit: 20, entry_fee: 5000, prize_total: 80000, prize_champion: 60000, prize_runnerup: 15000, prize_third: 5000, reg_close: "2026-09-16", match_start: "2026-09-20", match_end: "2026-09-21", status: "registering", image_url: IMG.goal, live_url: "https://www.youtube.com/@isaansport", description: "ฟุตบอล 9 คน อีสาน ชิงถ้วยผู้ว่าฯ 20 ทีม", organizer_name: "ลาบชัยภูมิ", organizer_phone: "085-333-4444", organizer_line: "larbcpm", venue_id: V.chaiyaphum }),
  T({ slug: "kkc-concrete-champions", name: "KKC คอนกรีต แชมเปียนส์ คัพ", format: "11", province: "ขอนแก่น", team_limit: 32, entry_fee: 10000, deposit: 2000, prize_total: 150000, prize_champion: 120000, prize_runnerup: 20000, prize_third: 10000, reg_close: "2026-07-20", match_start: "2026-07-26", status: "finished", image_url: IMG.seats, live_url: null, description: "ฟุตบอล 11 คน มาตรฐาน 32 ทีม แชมป์: ทีมไฟใต้ FC", organizer_name: "KKC คอนกรีต", organizer_phone: "086-555-6666", organizer_line: "kkcconcrete", venue_id: V.khonkaen }),
  T({ slug: "korat-arena-7s-open", name: "โคราช อารีน่า 7s โอเพ่น", format: "7", province: "นครราชสีมา", team_limit: 28, entry_fee: 7000, prize_total: 120000, prize_champion: 90000, prize_runnerup: 20000, prize_third: 6000, reg_close: "2026-09-25", match_start: "2026-09-27", match_end: "2026-09-28", status: "registering", image_url: IMG.night, live_url: "https://www.facebook.com/koratarena", description: "7 คน หญ้าเทียม แอร์เย็น ไฟสปอตไลต์เต็มสนาม", organizer_name: "โคราช อารีน่า", organizer_phone: "090-777-8888", organizer_line: "koratarena", venue_id: V.korat }),
  T({ slug: "buriram-united-fan-cup", name: "บุรีรัมย์ แฟนคัพ 7 คน", format: "7", province: "บุรีรัมย์", team_limit: 24, entry_fee: 6000, prize_total: 90000, prize_champion: 70000, prize_runnerup: 12000, prize_third: 5000, reg_close: "2026-10-05", match_start: "2026-10-10", match_end: "2026-10-11", status: "registering", image_url: IMG.flood, live_url: "https://www.youtube.com/@buriramlive", description: "7 คน เมืองปราสาทสายฟ้า ชิงถ้วยแฟนคลับ", organizer_name: "แฟนคลับบุรีรัมย์", organizer_phone: "092-000-1111", organizer_line: "brfancup", venue_id: V.buriram }),
  T({ slug: "lanna-winter-cup", name: "ล้านนา วินเทอร์ คัพ", format: "7", province: "เชียงใหม่", team_limit: 20, entry_fee: 5000, prize_total: 70000, prize_champion: 50000, prize_runnerup: 12000, prize_third: 5000, reg_close: "2026-11-15", match_start: "2026-11-21", match_end: "2026-11-22", status: "registering", image_url: IMG.pitch, live_url: null, description: "7 คน อากาศเย็นสบายภาคเหนือ ปลายฝนต้นหนาว", organizer_name: "ล้านนา ฟุตบอลพาร์ค", organizer_phone: "093-222-3333", organizer_line: "lannapark", venue_id: V.chiangmai }),
  T({ slug: "nongsang-night-league-2", name: "หนองสังข์ ไนท์ลีก #2", format: "7", province: "ชลบุรี", team_limit: 16, entry_fee: 4500, deposit: 500, prize_total: 55000, prize_champion: 40000, prize_runnerup: 10000, prize_third: 3000, reg_close: "2026-10-20", match_start: "2026-10-25", status: "registering", image_url: IMG.night, live_url: "https://www.facebook.com/SRC.Sriracha", description: "7 คน แข่งกลางคืน จบในวันเดียว", organizer_name: "เปาต้น วรินทร", organizer_phone: "064-642-2168", organizer_line: "Kruton252629", venue_id: V.nongsang }),
  T({ slug: "isaan-super-cup-9s", name: "อีสาน ซูเปอร์คัพ 9 คน", format: "9", province: "ขอนแก่น", team_limit: 24, entry_fee: 8000, deposit: 1500, prize_total: 130000, prize_champion: 100000, prize_runnerup: 20000, prize_third: 8000, reg_close: "2026-10-28", match_start: "2026-11-01", match_end: "2026-11-02", status: "registering", image_url: IMG.seats, live_url: "https://www.youtube.com/@isaansport", description: "9 คน รวมทีมแกร่งทั่วอีสาน ชิงเงินแสน", organizer_name: "อีสาน สปอร์ต", organizer_phone: "087-444-5555", organizer_line: "isaansport", venue_id: V.khonkaen }),
  T({ slug: "rayong-beach-7s", name: "ระยอง บีช 7s", format: "7", province: "ระยอง", team_limit: 16, entry_fee: 3500, deposit: 500, prize_total: 45000, prize_champion: 30000, prize_runnerup: 10000, prize_third: 3000, reg_close: "2026-08-05", match_start: "2026-08-08", status: "finished", image_url: IMG.ball, live_url: null, description: "7 คน ริมทะเลระยอง แชมป์: ระยอง ยูไนเต็ด", organizer_name: "ระยอง สปอร์ต", organizer_phone: "088-666-7777", organizer_line: "rayongsport", venue_id: V.nonglalok }),
  T({ slug: "korat-new-year-cup-2027", name: "โคราช นิวเยียร์ คัพ 2027", format: "7", province: "นครราชสีมา", team_limit: 32, entry_fee: 9000, deposit: 2000, prize_total: 180000, prize_champion: 150000, prize_runnerup: 20000, prize_third: 10000, reg_close: "2026-12-20", match_start: "2027-01-03", match_end: "2027-01-04", status: "registering", image_url: IMG.night, live_url: "https://www.facebook.com/koratarena", description: "7 คน ส่งท้ายปี เงินรางวัลสูงสุดของโซนอีสานใต้", organizer_name: "โคราช อารีน่า", organizer_phone: "090-777-8888", organizer_line: "koratarena", venue_id: V.korat }),
];

console.log(`\nกำลังนำเข้า ${venues.length} สนาม และ ${tournaments.length} รายการ...\n`);

const { error: vErr } = await sb.from("venues").upsert(venues, { onConflict: "id" });
if (vErr) { console.error("✗ สนาม:", vErr.message); process.exit(1); }
console.log(`✓ สนาม ${venues.length} แห่ง`);

const { error: tErr } = await sb.from("tournaments").upsert(tournaments, { onConflict: "slug" });
if (tErr) { console.error("✗ รายการ:", tErr.message); process.exit(1); }
console.log(`✓ รายการแข่งขัน ${tournaments.length} รายการ`);

const { count } = await sb.from("tournaments").select("*", { count: "exact", head: true });
console.log(`\n\x1b[32mเสร็จสิ้น! ตอนนี้มี ${count} รายการในฐานข้อมูล\x1b[0m\n`);
