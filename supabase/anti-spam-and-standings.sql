-- ============================================================
-- กันสแปมชุมชน (IP + คิวตรวจ) + ตารางคะแนนคำนวณอัตโนมัติ
-- รันใน SQL Editor
-- ============================================================

-- ---------- ชุมชน: เก็บ IP ผู้โพสต์ + สถานะอนุมัติ ----------
alter table threads add column if not exists author_ip text;
alter table threads add column if not exists status text not null default 'approved'
  check (status in ('approved', 'pending'));
alter table replies add column if not exists author_ip text;

create index if not exists idx_threads_status on threads(status, created_at desc);

-- ---------- ผลการแข่ง: ระบุกลุ่มของแต่ละคู่ (ใช้คำนวณตารางคะแนน) ----------
alter table matches add column if not exists group_name text;

-- เสร็จแล้ว: กระทู้เดิมทั้งหมดจะเป็นสถานะ 'approved' อัตโนมัติ
