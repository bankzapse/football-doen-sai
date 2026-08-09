-- ============================================================
-- ระบบชุมชน / กระทู้ (community) — รันใน SQL Editor
-- ครอบคลุม: บอร์ดหาคู่แข่ง/หาทีม/หานักเตะ + กระทู้ทั่วไป + กระทู้ผูกกับรายการแข่ง
-- ============================================================

-- กระทู้
create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general'
    check (category in ('find_opponent','join_tournament','find_player','buy_sell','general')),
  title text not null,
  body text not null,
  province text,
  author_name text not null,
  author_contact text,          -- LINE / เบอร์โทร
  tournament_id uuid references tournaments(id) on delete set null,
  reply_count int not null default 0,
  pinned boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists idx_threads_category on threads(category);
create index if not exists idx_threads_created on threads(created_at desc);
create index if not exists idx_threads_tournament on threads(tournament_id);

-- ความคิดเห็น / ตอบกลับ
create table if not exists replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads(id) on delete cascade,
  body text not null,
  author_name text not null,
  author_contact text,
  created_at timestamptz default now()
);

create index if not exists idx_replies_thread on replies(thread_id, created_at);

-- อัปเดตตัวนับจำนวนคอมเมนต์อัตโนมัติ
create or replace function bump_reply_count() returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update threads set reply_count = reply_count + 1 where id = new.thread_id;
  elsif (tg_op = 'DELETE') then
    update threads set reply_count = greatest(reply_count - 1, 0) where id = old.thread_id;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_reply_count on replies;
create trigger trg_reply_count
  after insert or delete on replies
  for each row execute function bump_reply_count();

-- ---------- RLS: อ่านได้ทุกคน, เขียนผ่าน service_role (หลังบ้าน) ----------
alter table threads enable row level security;
alter table replies enable row level security;

drop policy if exists "public read threads" on threads;
create policy "public read threads" on threads for select using (true);

drop policy if exists "public read replies" on replies;
create policy "public read replies" on replies for select using (true);

-- สิทธิ์สำหรับ PostgREST
grant select on threads, replies to anon, authenticated;
grant all on threads, replies to service_role;

-- ---------- ข้อมูลตัวอย่าง ----------
insert into threads (category, title, body, province, author_name, author_contact) values
  ('find_opponent','หาคู่แข่ง 7 คน โซนชลบุรี เสาร์นี้','ทีมเราระดับกลางๆ อยากหาคู่ซ้อม/อุ่นเครื่อง เย็นวันเสาร์ สนามพนัสนิคม ทักมาได้เลย','ชลบุรี','โค้ชนก','LINE: coachnok7'),
  ('find_player','รับนักเตะเสริม กองหน้า+เซนเตอร์','ทีมลงเดินสายแถวอีสาน ต้องการกองหน้าตัวเป้าและเซนเตอร์ มีค่าตัวต่อแมตช์','ขอนแก่น','พี่เบิร์ด','โทร 088-888-8888'),
  ('join_tournament','ทีมพร้อมลงรายการ 7 คน ชิงเงินแสน','ทีมเราพร้อมลงแข่งรายการเงินรางวัลสูง แถบภาคกลาง-ตะวันออก มีรายการไหนแนะนำได้','กรุงเทพมหานคร','ต้น','LINE: tonfc')
on conflict do nothing;
