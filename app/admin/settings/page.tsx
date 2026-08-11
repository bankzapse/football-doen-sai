import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { updateSiteSettings } from "@/app/admin/actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const s = await getSiteSettings();

  return (
    <>
      <div className="admin-head">
        <h1>ตั้งค่าเว็บ</h1>
        <Link href="/" className="btn ghost">ดูหน้าเว็บ</Link>
      </div>

      {ok ? <div className="notice ok">บันทึกการตั้งค่าเรียบร้อยแล้ว</div> : null}
      {error === "nodb" ? (
        <div className="notice">ยังไม่ได้เชื่อม Supabase จึงบันทึกไม่ได้</div>
      ) : error ? (
        <div className="notice">บันทึกไม่สำเร็จ: {error}</div>
      ) : null}

      <h3 style={{ fontSize: 16, margin: "8px 0 10px" }}>เลย์เอาต์ “รายการแข่งขัน” หน้าแรก</h3>
      <div className="callout">
        ปรับจำนวนคอลัมน์ (ขนาดการ์ด) และจำนวนแถวที่แสดงบนหน้าแรก — ถ้าเกินจำนวนแถวที่ตั้งไว้ จะมีปุ่ม “ดูทั้งหมด”
      </div>

      <form action={updateSiteSettings}>
        <div className="formgrid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field">
            <label>จำนวนคอลัมน์ (ขนาดการ์ด)</label>
            <select name="home_grid_columns" defaultValue={String(s.gridCols)}>
              <option value="2">2 คอลัมน์ (การ์ดใหญ่)</option>
              <option value="3">3 คอลัมน์ (กลาง)</option>
              <option value="4">4 คอลัมน์ (เล็ก)</option>
            </select>
          </div>
          <div className="field">
            <label>จำนวนแถวที่แสดง</label>
            <select name="home_grid_rows" defaultValue={String(s.gridRows)}>
              <option value="0">แสดงทุกแถว</option>
              <option value="1">1 แถว</option>
              <option value="2">2 แถว</option>
              <option value="3">3 แถว</option>
              <option value="4">4 แถว</option>
              <option value="5">5 แถว</option>
            </select>
            <span className="hint">แถวเกินจะซ่อนไว้ใต้ปุ่ม “ดูทั้งหมด”</span>
          </div>
          <div className="field full">
            <button type="submit" className="btn green">บันทึกการตั้งค่า</button>
          </div>
        </div>
      </form>
    </>
  );
}
