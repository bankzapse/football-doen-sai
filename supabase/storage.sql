-- ============================================================
-- Storage bucket สำหรับเก็บโปสเตอร์ — รันใน SQL Editor
-- (หรือสร้าง bucket ชื่อ "posters" แบบ public ผ่านหน้า Storage ก็ได้)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('posters', 'posters', true)
on conflict (id) do nothing;

-- ให้ทุกคนดูรูปได้ (อ่าน)
drop policy if exists "public read posters" on storage.objects;
create policy "public read posters" on storage.objects
  for select using (bucket_id = 'posters');

-- การอัปโหลด/ลบ ทำผ่าน service_role ในหลังบ้าน (bypass RLS) จึงไม่ต้องเปิด insert ให้ anon
