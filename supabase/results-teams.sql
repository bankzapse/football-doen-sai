-- ============================================================
-- ผลการแข่งขัน / ตารางคะแนน + ทีม/นักเตะ — รันใน SQL Editor
-- ============================================================

-- ---------- ผู้ชนะ (เพิ่มคอลัมน์ในตาราง tournaments) ----------
alter table tournaments add column if not exists champion text;
alter table tournaments add column if not exists runner_up text;
alter table tournaments add column if not exists third_place text;
alter table tournaments add column if not exists top_scorer text;

-- ---------- ผลการแข่งขันรายคู่ ----------
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  round text not null default 'รอบแบ่งกลุ่ม',   -- เช่น "รอบชิงชนะเลิศ", "รอบ 8 ทีม"
  team_home text not null,
  team_away text not null,
  score_home int,
  score_away int,
  note text,                                     -- เช่น "ต่อเวลา / จุดโทษ 4-3"
  sort int not null default 0,
  created_at timestamptz default now()
);
create index if not exists idx_matches_tournament on matches(tournament_id, sort);

-- ---------- ตารางคะแนน (รอบแบ่งกลุ่ม) ----------
create table if not exists standings (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  group_name text not null default 'กลุ่ม A',
  team_name text not null,
  played int not null default 0,
  win int not null default 0,
  draw int not null default 0,
  loss int not null default 0,
  gf int not null default 0,   -- ได้
  ga int not null default 0,   -- เสีย
  points int not null default 0,
  sort int not null default 0
);
create index if not exists idx_standings_tournament on standings(tournament_id, group_name, sort);

-- ---------- ทีม ----------
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text,
  logo_url text,
  manager_name text,
  coach_name text,
  coach2_name text,
  created_at timestamptz default now()
);
create index if not exists idx_teams_name on teams(name);

-- ---------- นักเตะ ----------
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  name text not null,
  number int,
  position text,        -- GK / DF / MF / FW
  photo_url text,
  sort int not null default 0
);
create index if not exists idx_players_team on players(team_id, sort);

-- ---------- RLS ----------
alter table matches enable row level security;
alter table standings enable row level security;
alter table teams enable row level security;
alter table players enable row level security;

drop policy if exists "read matches" on matches;
create policy "read matches" on matches for select using (true);
drop policy if exists "read standings" on standings;
create policy "read standings" on standings for select using (true);
drop policy if exists "read teams" on teams;
create policy "read teams" on teams for select using (true);
drop policy if exists "read players" on players;
create policy "read players" on players for select using (true);

grant select on matches, standings, teams, players to anon, authenticated;
grant all on matches, standings, teams, players to service_role;

-- ============================================================
-- ข้อมูลตัวอย่าง
-- ============================================================

-- ผู้ชนะรายการที่จบแล้ว
update tournaments set champion='ไฟใต้ FC', runner_up='โคราช ยูไนเต็ด', third_place='ขอนแก่น ซิตี้', top_scorer='สมชาย ใจดี (7 ประตู)'
  where slug='kkc-concrete-champions';
update tournaments set champion='ระยอง ยูไนเต็ด', runner_up='บ้านค่าย เอฟซี', third_place='มาบตาพุด ซิตี้', top_scorer='อนุชา (5 ประตู)'
  where slug='rayong-beach-7s';

-- ผลคู่สำคัญ (KKC)
insert into matches (tournament_id, round, team_home, team_away, score_home, score_away, note, sort)
select id, 'รอบชิงชนะเลิศ', 'ไฟใต้ FC', 'โคราช ยูไนเต็ด', 2, 1, null, 1 from tournaments where slug='kkc-concrete-champions'
union all
select id, 'รอบชิงอันดับ 3', 'ขอนแก่น ซิตี้', 'อุดร ยูไนเต็ด', 3, 3, 'จุดโทษ 4-2', 2 from tournaments where slug='kkc-concrete-champions'
union all
select id, 'รอบรองชนะเลิศ', 'ไฟใต้ FC', 'อุดร ยูไนเต็ด', 3, 0, null, 3 from tournaments where slug='kkc-concrete-champions';

-- ตารางคะแนนกลุ่ม A (KKC)
insert into standings (tournament_id, group_name, team_name, played, win, draw, loss, gf, ga, points, sort)
select id, 'กลุ่ม A', 'ไฟใต้ FC', 3, 3, 0, 0, 9, 2, 9, 1 from tournaments where slug='kkc-concrete-champions'
union all
select id, 'กลุ่ม A', 'อุดร ยูไนเต็ด', 3, 2, 0, 1, 7, 4, 6, 2 from tournaments where slug='kkc-concrete-champions'
union all
select id, 'กลุ่ม A', 'เลย ซิตี้', 3, 1, 0, 2, 3, 6, 3, 3 from tournaments where slug='kkc-concrete-champions'
union all
select id, 'กลุ่ม A', 'หนองคาย เอฟซี', 3, 0, 0, 3, 1, 8, 0, 4 from tournaments where slug='kkc-concrete-champions';

-- ทีมตัวอย่าง (KWANSIRI จากใบสมัคร)
insert into teams (id, name, province, manager_name, coach_name, coach2_name)
values ('a0000000-0000-0000-0000-0000000000c1','KWANSIRI CS','กรุงเทพมหานคร','ยามาล','โค้ชนก','โค้ชโรตี')
on conflict (id) do nothing;

insert into players (team_id, name, number, position, sort) values
  ('a0000000-0000-0000-0000-0000000000c1','เมือง วรวิทย์',1,'GK',1),
  ('a0000000-0000-0000-0000-0000000000c1','แจ่น ธรรมรัตน์',4,'DF',2),
  ('a0000000-0000-0000-0000-0000000000c1','ขัย พรชัย',5,'DF',3),
  ('a0000000-0000-0000-0000-0000000000c1','ปู มนัสชัย',6,'DF',4),
  ('a0000000-0000-0000-0000-0000000000c1','เปตอง ณัฏฐิกรณ์',3,'DF',5),
  ('a0000000-0000-0000-0000-0000000000c1','นาย ศิลา',8,'MF',6),
  ('a0000000-0000-0000-0000-0000000000c1','อ๊อฟ สุรวุฒิ',10,'MF',7),
  ('a0000000-0000-0000-0000-0000000000c1','เต๋ย อัครพล',7,'MF',8),
  ('a0000000-0000-0000-0000-0000000000c1','เบนซ์ กฤษณะ',11,'MF',9),
  ('a0000000-0000-0000-0000-0000000000c1','กาย พงศธร',14,'FW',10),
  ('a0000000-0000-0000-0000-0000000000c1','โฟริว ยุธธกร',9,'FW',11),
  ('a0000000-0000-0000-0000-0000000000c1','ต๊าร์ หฤษฏิ์',17,'MF',12),
  ('a0000000-0000-0000-0000-0000000000c1','อาแปะ นพรัตน์',20,'DF',13),
  ('a0000000-0000-0000-0000-0000000000c1','พี พีรวิชญ์',13,'FW',14),
  ('a0000000-0000-0000-0000-0000000000c1','ฟีฟ่า ภูริณัฐ',19,'FW',15)
on conflict do nothing;
