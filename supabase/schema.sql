-- ============================================================
-- เดินสาย FC — Supabase / Postgres schema
-- รันไฟล์นี้ใน Supabase → SQL Editor (ครั้งเดียว)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- สนามแข่ง ----------
create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text not null,
  district text,
  size text,
  image_url text,
  map_url text,
  created_at timestamptz default now()
);

-- ---------- สปอนเซอร์ ----------
create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  tier text not null default 'standard' check (tier in ('platinum','gold','standard')),
  website text,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- ---------- รายการแข่งขัน ----------
create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  format text not null default '7' check (format in ('7','9','11')),
  province text not null,
  team_limit int not null default 0,
  entry_fee int not null default 0,
  deposit int not null default 0,
  prize_total int not null default 0,
  prize_champion int not null default 0,
  prize_runnerup int,
  prize_third int,
  reg_open date,
  reg_close date,
  match_start date not null,
  match_end date,
  status text not null default 'registering'
    check (status in ('draft','registering','closing','live','finished')),
  poster_url text,
  image_url text,
  live_url text,
  description text,
  organizer_name text,
  organizer_phone text,
  organizer_line text,
  venue_id uuid references venues(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_tournaments_status on tournaments(status);
create index if not exists idx_tournaments_province on tournaments(province);
create index if not exists idx_tournaments_match_start on tournaments(match_start);

-- ---------- Row Level Security ----------
-- คนทั่วไป (anon) อ่านได้เฉพาะที่เผยแพร่แล้ว
-- การเขียน/แก้/ลบ ทำผ่าน service role ในหลังบ้านเท่านั้น (bypass RLS)
alter table venues enable row level security;
alter table sponsors enable row level security;
alter table tournaments enable row level security;

drop policy if exists "public read venues" on venues;
create policy "public read venues" on venues for select using (true);

drop policy if exists "public read sponsors" on sponsors;
create policy "public read sponsors" on sponsors for select using (active = true);

drop policy if exists "public read published tournaments" on tournaments;
create policy "public read published tournaments" on tournaments
  for select using (status <> 'draft');

-- ============================================================
-- ข้อมูลตัวอย่าง (ลบออกได้ถ้าไม่ต้องการ)
-- ============================================================
insert into venues (id, name, province, district, size, image_url)
values
  ('11111111-1111-1111-1111-111111111111','Nongsang Stadium','ชลบุรี','พนัสนิคม','70×50 เมตร (หญ้าจริง)','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=60')
on conflict (id) do nothing;

insert into sponsors (name, tier) values
  ('M7 SEVEN','platinum'),
  ('Hi-RUN FURNITURE','gold'),
  ('KKC คอนกรีต','gold'),
  ('AOM WATER','standard')
on conflict do nothing;

insert into tournaments
  (slug, name, format, province, team_limit, entry_fee, deposit,
   prize_total, prize_champion, prize_runnerup, prize_third,
   reg_close, match_start, match_end, status, image_url, live_url,
   description, organizer_name, organizer_phone, organizer_line, venue_id)
values
  ('nongsang-m7seven-open-cup-2026-1','NONGSANG × M7SEVEN OPEN CUP 2026 #1','7','ชลบุรี',
   32,8000,1000,130000,100000,20000,5000,
   '2026-08-26','2026-08-29','2026-08-30','live',
   'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=60',
   'https://www.facebook.com/SRC.Sriracha',
   'ฟุตบอล 7 คน มาตรฐาน 7 สี ชิงถ้วยท่านสมศักดิ์ เทพสุทิน',
   'เปาต้น วรินทร สัสดี','064-642-2168','Kruton252629',
   '11111111-1111-1111-1111-111111111111')
on conflict (slug) do nothing;
