-- ============================================================
-- ตำแหน่งแสดงสปอนเซอร์: ด้านขวา (side) / ด้านล่าง (bottom) / ทั้งสอง (both)
-- รันใน SQL Editor
-- ============================================================
alter table sponsors add column if not exists placement text not null default 'side'
  check (placement in ('side', 'bottom', 'both'));

-- สปอนเซอร์เดิมทั้งหมดจะอยู่ "ด้านขวา" (side) ตามเดิม
