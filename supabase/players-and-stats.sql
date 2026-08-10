-- ============================================================
-- นักเตะเดินสาย (free_players) + สถิติการเข้าชม (page_views)
-- รันไฟล์นี้ครั้งเดียวใน Supabase → SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- 1) นักเตะเดินสาย — โปรไฟล์ผู้เล่นอิสระที่หาทีมไปลงแข่ง
--    status: pending = รออนุมัติ (นักเตะโพสต์เอง) / approved = แสดงบนเว็บ
-- ------------------------------------------------------------
create table if not exists free_players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nickname text,
  position text not null default 'any'
    check (position in ('gk','df','mf','fw','any')),  -- ประตู/กองหลัง/กองกลาง/กองหน้า/ได้ทุกตำแหน่ง
  province text,
  age int,
  height int,            -- ส่วนสูง (ซม.)
  foot text check (foot in ('left','right','both')),   -- เท้าถนัด
  rate text,             -- ค่าตัว / เรทต่อแมตช์ (ข้อความอิสระ เช่น "500/แมตช์")
  bio text,              -- สถิติ / โปรไฟล์ / ประสบการณ์
  contact text,          -- เบอร์โทร / LINE
  photo_url text,
  status text not null default 'pending' check (status in ('pending','approved')),
  created_at timestamptz default now()
);

create index if not exists idx_free_players_status on free_players(status);
create index if not exists idx_free_players_province on free_players(province);
create index if not exists idx_free_players_position on free_players(position);

-- RLS: สาธารณะเห็นเฉพาะที่อนุมัติแล้ว, การเขียน/อ่านทั้งหมดทำผ่าน service_role (หลังบ้าน)
alter table free_players enable row level security;

drop policy if exists "public read approved players" on free_players;
create policy "public read approved players" on free_players
  for select using (status = 'approved');

grant select on free_players to anon, authenticated;
grant all on free_players to service_role;

-- ข้อมูลตัวอย่าง (อนุมัติแล้ว)
insert into free_players (name, nickname, position, province, age, height, foot, rate, bio, contact, status) values
  ('ธนากร ใจดี','ต้น','fw','ชลบุรี',24,172,'right','800/แมตช์','กองหน้าตัวเป้า จบสกอร์ดี เคยลงเดินสายภาคตะวันออก 3 ปี','LINE: ton_fw9','approved'),
  ('อนุชา แข็งแรง','บอล','df','ระยอง',27,178,'right','600/แมตช์','เซนเตอร์แบ็ก โหม่งดี อ่านเกมนิ่ง','โทร 089-111-2222','approved'),
  ('วีรพล สายฟ้า','บิว','mf','ขอนแก่น',22,168,'left','เจรจาได้','กองกลางตัวรุก จ่ายบอลสุดท้ายคม ยิงไกลดี','LINE: biew_10','approved')
on conflict do nothing;

-- ------------------------------------------------------------
-- 2) สถิติการเข้าชม — บันทึก 1 แถวต่อการเปิดหน้า (ผ่าน server action)
--    ยอดรวมเว็บ = นับทุกแถว / รายรายการ = path = '/tournament/<slug>'
-- ------------------------------------------------------------
create table if not exists page_views (
  id bigint generated always as identity primary key,
  path text not null,
  created_at timestamptz default now()
);

create index if not exists idx_page_views_created on page_views(created_at desc);
create index if not exists idx_page_views_path on page_views(path);

-- RLS: เขียน/อ่านผ่าน service_role เท่านั้น (ไม่เปิดให้ anon)
alter table page_views enable row level security;
grant all on page_views to service_role;
