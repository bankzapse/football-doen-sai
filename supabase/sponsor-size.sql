-- ============================================================
-- ขนาดกล่องสปอนเซอร์ (ปรับเองได้): sm=1 ช่อง / md=2 ช่อง / lg=3 ช่อง
-- รันใน SQL Editor
-- ============================================================
alter table sponsors add column if not exists size text not null default 'sm'
  check (size in ('sm', 'md', 'lg'));

-- ค่าเริ่มต้น: พาร์ทเนอร์หลักให้ใหญ่ (2 ช่อง) ที่เหลือ 1 ช่องตามเดิม
update sponsors set size = 'md' where tier = 'platinum';
