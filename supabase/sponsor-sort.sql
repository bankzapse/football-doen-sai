-- ============================================================
-- ลำดับการแสดงสปอนเซอร์ (จัด layout ตำแหน่งได้)
-- รันใน SQL Editor
-- ============================================================
alter table sponsors add column if not exists sort int not null default 0;
create index if not exists idx_sponsors_sort on sponsors(sort);
