-- ============================================================
-- ตั้งค่าเว็บ (key-value) — เช่น layout grid หน้าแรก
-- รันใน SQL Editor
-- ============================================================
create table if not exists site_settings (
  key text primary key,
  value text
);

alter table site_settings enable row level security;
drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
grant select on site_settings to anon, authenticated;
grant all on site_settings to service_role;

-- ค่าเริ่มต้น: หน้าแรกโชว์ 2 คอลัมน์ / ทุกแถว (0 = ไม่จำกัด)
insert into site_settings (key, value) values
  ('home_grid_columns', '2'),
  ('home_grid_rows', '0')
on conflict (key) do nothing;
