import Link from "next/link";
import { getVenues } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createVenue, deleteVenue } from "@/app/admin/actions";

const OK_MSG: Record<string, string> = {
  created: "เพิ่มสนามเรียบร้อยแล้ว",
  updated: "แก้ไขสนามเรียบร้อยแล้ว",
  deleted: "ลบสนามเรียบร้อยแล้ว",
};

export default async function AdminVenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const venues = await getVenues();

  return (
    <>
      <div className="admin-head">
        <h1>สนามแข่ง</h1>
        <Link href="/venues" className="btn ghost">
          ดูหน้าเว็บ
        </Link>
      </div>

      {ok && OK_MSG[ok] ? <div className="notice ok">{OK_MSG[ok]}</div> : null}
      {error === "nodb" ? (
        <div className="notice">
          ยังไม่ได้เชื่อม Supabase จึงบันทึกไม่ได้ — ใส่คีย์ใน <code>.env.local</code> ก่อน
        </div>
      ) : error ? (
        <div className="notice">บันทึกไม่สำเร็จ: {error}</div>
      ) : null}

      {!isSupabaseConfigured() ? (
        <div className="notice">
          โหมดตัวอย่าง: ฟอร์มนี้จะบันทึกได้เมื่อเชื่อม Supabase แล้วเท่านั้น
        </div>
      ) : null}

      <div className="tablescroll" style={{ marginBottom: 24 }}>
        <table className="atable">
          <thead>
            <tr>
              <th>ชื่อสนาม</th>
              <th>จังหวัด</th>
              <th>อำเภอ</th>
              <th>ขนาด</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.province}</td>
                <td>{v.district ?? "-"}</td>
                <td>{v.size ?? "-"}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <Link href={`/admin/venues/${v.id}`} className="rowbtn">
                    แก้ไข
                  </Link>
                  <form action={deleteVenue}>
                    <input type="hidden" name="id" value={v.id} />
                    <button className="rowbtn" style={{ color: "var(--live)" }}>
                      ลบ
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {venues.length === 0 ? (
              <tr>
                <td colSpan={5} className="muted">
                  ยังไม่มีสนาม
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: 16, margin: "8px 0 10px" }}>+ เพิ่มสนามใหม่</h3>
      <form action={createVenue}>
        <div className="formgrid">
          <div className="field">
            <label>ชื่อสนาม *</label>
            <input name="name" required placeholder="Nongsang Stadium" />
          </div>
          <div className="field">
            <label>จังหวัด *</label>
            <input name="province" required placeholder="ชลบุรี" />
          </div>
          <div className="field">
            <label>อำเภอ</label>
            <input name="district" placeholder="พนัสนิคม" />
          </div>
          <div className="field">
            <label>ขนาดสนาม</label>
            <input name="size" placeholder="70×50 เมตร (หญ้าจริง)" />
          </div>
          <div className="field">
            <label>อัปโหลดรูปสนามจากเครื่อง</label>
            <input name="image_file" type="file" accept="image/*" />
            <span className="hint">เลือกไฟล์รูปได้เลย (เก็บใน Supabase Storage)</span>
          </div>
          <div className="field">
            <label>หรือใส่ลิงก์รูปภาพ</label>
            <input name="image_url" placeholder="https://..." />
            <span className="hint">ถ้าอัปโหลดไฟล์ด้านบนแล้ว ช่องนี้จะถูกข้าม</span>
          </div>
          <div className="field">
            <label>ลิงก์แผนที่ (Google Maps)</label>
            <input name="map_url" placeholder="https://maps.google.com/..." />
          </div>
          <div className="field full">
            <button type="submit" className="btn green">
              บันทึกสนาม
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
