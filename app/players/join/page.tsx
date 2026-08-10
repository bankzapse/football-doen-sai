import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProvinceSelect from "@/components/ProvinceSelect";
import { submitPlayerAction } from "@/app/players/actions";
import { POSITIONS } from "@/lib/players";

export const metadata: Metadata = {
  title: "ลงชื่อหานักเตะเดินสาย",
  robots: { index: false, follow: false },
};

export default async function JoinPlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 760 }}>
        <div className="page-head">
          <h1>ลงชื่อหานักเตะเดินสาย</h1>
          <p>
            กรอกข้อมูลและช่องทางติดต่อ ทีมที่สนใจจะติดต่อชวนไปลงแข่ง —
            โปรไฟล์จะแสดงบนเว็บหลังทีมงานตรวจอนุมัติ
          </p>
        </div>

        {error === "missing" ? (
          <div className="notice">กรุณากรอกชื่อและช่องทางติดต่อให้ครบ</div>
        ) : error === "nodb" ? (
          <div className="notice">ยังไม่ได้เชื่อม Supabase จึงบันทึกไม่ได้</div>
        ) : error ? (
          <div className="notice">ส่งไม่สำเร็จ: {error}</div>
        ) : null}

        <form action={submitPlayerAction}>
          <div className="formgrid">
            <div className="field">
              <label>ชื่อ-นามสกุล *</label>
              <input name="name" required placeholder="ธนากร ใจดี" />
            </div>
            <div className="field">
              <label>ชื่อเล่น</label>
              <input name="nickname" placeholder="ต้น" />
            </div>
            <div className="field">
              <label>ตำแหน่ง</label>
              <select name="position" defaultValue="fw">
                {POSITIONS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.emoji} {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>จังหวัด</label>
              <ProvinceSelect />
            </div>
            <div className="field">
              <label>อายุ</label>
              <input name="age" type="number" min="10" max="70" placeholder="24" />
            </div>
            <div className="field">
              <label>ส่วนสูง (ซม.)</label>
              <input name="height" type="number" min="120" max="220" placeholder="172" />
            </div>
            <div className="field">
              <label>เท้าถนัด</label>
              <select name="foot" defaultValue="">
                <option value="">— ไม่ระบุ —</option>
                <option value="right">เท้าขวา</option>
                <option value="left">เท้าซ้าย</option>
                <option value="both">สองเท้า</option>
              </select>
            </div>
            <div className="field">
              <label>ค่าตัว / เรทต่อแมตช์</label>
              <input name="rate" placeholder="เช่น 500/แมตช์ หรือ เจรจาได้" />
            </div>

            <div className="field full">
              <label>สถิติ / โปรไฟล์ / ประสบการณ์</label>
              <textarea
                name="bio"
                placeholder="เช่น กองหน้าตัวเป้า จบสกอร์ดี เคยลงเดินสายภาคตะวันออก 3 ปี ยิงรวม 40+ ประตู"
                style={{ minHeight: 100 }}
              />
            </div>

            <div className="field">
              <label>ช่องทางติดต่อ *</label>
              <input name="contact" required placeholder="LINE / เบอร์โทร" />
            </div>
            <div className="field">
              <label>รูปนักเตะ (อัปโหลดจากเครื่อง)</label>
              <input name="photo_file" type="file" accept="image/*" />
            </div>

            {/* honeypot กันบอท */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              style={{ display: "none" }}
              aria-hidden
            />

            <div className="field full" style={{ flexDirection: "row", gap: 10 }}>
              <button type="submit" className="btn green">
                ส่งข้อมูลหาทีม
              </button>
              <Link href="/players" className="btn ghost">
                ยกเลิก
              </Link>
            </div>
          </div>
        </form>
        <div style={{ height: 40 }} />
      </main>
      <Footer />
    </>
  );
}
