# เดินสาย FC ⚽ — ศูนย์รวมฟุตบอลเดินสายทั่วไทย

เว็บรวมทุกรายการฟุตบอลเดินสาย (7/9/11 คน) — เปิดรับสมัครวันไหน แข่งวันไหน กี่ทีม เงินรางวัลเท่าไหร่
พร้อมลิงก์ถ่ายทอดสด หน้า SEO รายรายการ ลิสต์สปอนเซอร์ และระบบหลังบ้านให้ทีมงานลงข้อมูลเอง

**Stack:** Next.js 15 (App Router) · TypeScript · Supabase (Postgres) · Vercel

---

## รันในเครื่อง

```bash
npm install
npm run dev
```

เปิด http://localhost:3000 — เว็บ**รันได้ทันทีด้วยข้อมูลตัวอย่าง** แม้ยังไม่เชื่อม Supabase

- หน้าเว็บสาธารณะ: `/`, `/live`, `/venues`, `/sponsors`, `/tournament/[slug]`
- ระบบหลังบ้าน: `/admin`

## เชื่อม Supabase (ฐานข้อมูลจริง)

1. สร้างโปรเจกต์ที่ [supabase.com](https://supabase.com)
2. ไปที่ **SQL Editor** วางเนื้อหาไฟล์ [`supabase/schema.sql`](supabase/schema.sql) แล้ว Run
3. ก็อป `.env.local.example` เป็น `.env.local` แล้วใส่ค่าจาก **Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (ฝั่งเซิร์ฟเวอร์ ใช้เขียนข้อมูลในหลังบ้าน)
4. รีสตาร์ท `npm run dev` — ระบบจะสลับไปอ่าน/เขียนจากฐานข้อมูลจริงอัตโนมัติ

> ถ้าไม่ตั้งค่า env เว็บจะ fallback ไปใช้ `lib/seed.ts` (โหมดตัวอย่าง) — ฟอร์มในหลังบ้านจะบันทึกได้ก็ต่อเมื่อเชื่อม Supabase แล้ว

## ดีพลอยขึ้น Vercel

1. push โค้ดขึ้น GitHub
2. Import โปรเจกต์ใน [vercel.com](https://vercel.com)
3. ใส่ Environment Variables ชุดเดียวกับ `.env.local` (+ `NEXT_PUBLIC_SITE_URL` เป็นโดเมนจริง)
4. Deploy

## โครงสร้างโปรเจกต์

```
app/
  page.tsx                     หน้าแรก (รวมรายการ + ค้นหา/กรอง + ตาราง SEO)
  tournament/[slug]/page.tsx   หน้ารายละเอียด (SEO + JSON-LD + ฝังไลฟ์ + รูป BG)
  live/ venues/ sponsors/      หน้าถ่ายทอดสด / สนาม / สปอนเซอร์
  admin/                       หลังบ้าน (แดชบอร์ด + ตาราง + ฟอร์มเพิ่มรายการ)
  sitemap.ts robots.ts         SEO
components/                    Header, Footer, TournamentCard, TournamentBrowser
lib/                          types, format, seed, supabase, data (ชั้นดึงข้อมูล)
supabase/schema.sql           สคีมาฐานข้อมูล + ข้อมูลตัวอย่าง
```

## SEO ที่ทำให้แล้ว

- Metadata + Open Graph ต่อหน้า (title/description ไทยอัตโนมัติจากข้อมูลรายการ)
- JSON-LD `SportsEvent` (Google แสดงวันแข่ง/สถานที่ในผลค้นหา)
- `sitemap.xml` + `robots.txt` อัตโนมัติ (กันบอตเข้า `/admin`)
- URL อ่านง่าย `/tournament/<slug>`

## สิ่งที่ต่อยอดได้

- ล็อกอินหลังบ้าน (Supabase Auth) + แก้ไข/ลบรายการ
- อัปโหลดรูปโปสเตอร์ (Supabase Storage)
- หน้ารวมตามจังหวัด/เดือน, ระบบผลการแข่งขัน/แชมป์, ลิสต์ทีม-นักเตะ
