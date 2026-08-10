-- ============================================================
-- อัปเกรดโปรไฟล์นักเตะ: เพิ่ม วันเกิด/น้ำหนัก/Facebook + ประวัติการเล่น
-- รันใน SQL Editor
-- ============================================================

alter table free_players add column if not exists birthdate date;
alter table free_players add column if not exists weight int;
alter table free_players add column if not exists facebook text;

-- ประวัติการเล่น (timeline สโมสรรายปี)
create table if not exists player_history (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references free_players(id) on delete cascade,
  period text,          -- เช่น "2018–2019"
  club text,            -- ชื่อสโมสร
  note text,            -- รายละเอียด เช่น ไทยลีก 3 / เลื่อนชั้น
  sort int not null default 0
);
create index if not exists idx_player_history_player on player_history(player_id, sort);

alter table player_history enable row level security;
drop policy if exists "read player_history" on player_history;
create policy "read player_history" on player_history for select using (true);
grant select on player_history to anon, authenticated;
grant all on player_history to service_role;

-- ============================================================
-- ตัวอย่าง: ณัฐวุฒิ ด่านตระเวน (อุ้ม)
-- ============================================================
insert into free_players
  (id, name, nickname, position, province, age, birthdate, height, weight, foot, rate, bio, contact, facebook, status)
values
  ('b0000000-0000-0000-0000-0000000000aa',
   'ณัฐวุฒิ ด่านตระเวน', 'อุ้ม', 'df', 'จันทบุรี', 29, '1997-01-11', 178, 64, 'right',
   'เจรจาต่อรองได้',
   'แบ็กขวา / ปีกขวา (Right back / Right winger) · ประสบการณ์ไทยลีก 1-3 · ลงเล่นรวม 148 นัด',
   'โทร 061-647-2879 · Line: aummkpll', 'Aummaikinpuk', 'approved')
on conflict (id) do nothing;

insert into player_history (player_id, period, club, note, sort) values
  ('b0000000-0000-0000-0000-0000000000aa','2015–2016','จันทบุรี เอฟซี','ดิวิชั่น 2',1),
  ('b0000000-0000-0000-0000-0000000000aa','2018–2019','จันทบุรี เอฟซี','ไทยลีก 1',2),
  ('b0000000-0000-0000-0000-0000000000aa','2019–2020','สโมสร ลช.รด.','แชมป์ / เลื่อนชั้น',3),
  ('b0000000-0000-0000-0000-0000000000aa','2020–2021','ลช.รด. เอฟซี','ไทยลีก 3',4),
  ('b0000000-0000-0000-0000-0000000000aa','2021–2022','ลช.รด. (เลกแรก) / จันทบุรี เอฟซี (เลกหลัง)','ไทยลีก 3',5),
  ('b0000000-0000-0000-0000-0000000000aa','2022–2023','จันทบุรี เอฟซี','เลื่อนชั้นสู่ไทยลีก 2',6),
  ('b0000000-0000-0000-0000-0000000000aa','2023–2025','จันทบุรี เอฟซี','ไทยลีก 2',7),
  ('b0000000-0000-0000-0000-0000000000aa','2025–2026','อุดร อัสสัมชัญ (เลกแรก) / เชียงราย ยูไนเต็ด (เลก 2)','ไทยลีก 3',8)
on conflict do nothing;
