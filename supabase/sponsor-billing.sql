-- ============================================================
-- แพ็กเกจ/รอบชำระสปอนเซอร์ + วันหมดอายุ
-- รันใน SQL Editor
-- ============================================================
alter table sponsors add column if not exists plan_months int;   -- 1 / 3 / 6 / 12
alter table sponsors add column if not exists start_date date;    -- วันเริ่ม
alter table sponsors add column if not exists end_date date;      -- วันหมดอายุ (คำนวณอัตโนมัติ)
alter table sponsors add column if not exists price int;          -- ค่าลง (บาท)

create index if not exists idx_sponsors_end_date on sponsors(end_date);
