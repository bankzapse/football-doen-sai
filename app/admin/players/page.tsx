import Link from "next/link";
import ProvinceSelect from "@/components/ProvinceSelect";
import { getAllPlayersAdmin, POSITION_LABEL } from "@/lib/players";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  createPlayer,
  deletePlayer,
  togglePlayerStatus,
} from "@/app/admin/actions";
import { POSITIONS } from "@/lib/players";

const OK_MSG: Record<string, string> = {
  created: "เพิ่มนักเตะเรียบร้อยแล้ว",
  updated: "แก้ไขนักเตะเรียบร้อยแล้ว",
  deleted: "ลบนักเตะเรียบร้อยแล้ว",
};

export default async function AdminPlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const players = await getAllPlayersAdmin();
  const pendingCount = players.filter((p) => p.status === "pending").length;

  return (
    <>
      <div className="admin-head">
        <h1>
          นักเตะเดินสาย
          {pendingCount > 0 ? (
            <span className="pill" style={{ marginLeft: 10, color: "var(--live)", border: "1px solid var(--border)" }}>
              รออนุมัติ {pendingCount}
            </span>
          ) : null}
        </h1>
        <Link href="/players" className="btn ghost">
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
              <th>ชื่อ</th>
              <th>ตำแหน่ง</th>
              <th>จังหวัด</th>
              <th>ค่าตัว/เรท</th>
              <th>ติดต่อ</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.name}
                  {p.nickname ? ` (${p.nickname})` : ""}
                </td>
                <td>{POSITION_LABEL[p.position]}</td>
                <td>{p.province ?? "-"}</td>
                <td>{p.rate ?? "-"}</td>
                <td>{p.contact ?? "-"}</td>
                <td>
                  <span
                    className="pill"
                    style={{
                      background: p.status === "approved" ? "var(--surface-3)" : "transparent",
                      color: p.status === "approved" ? "var(--pitch)" : "var(--live)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {p.status === "approved" ? "แสดง" : "รออนุมัติ"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 6 }}>
                  <Link href={`/admin/players/${p.id}`} className="rowbtn">
                    แก้ไข
                  </Link>
                  <form action={togglePlayerStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="status" value={p.status} />
                    <button className="rowbtn">
                      {p.status === "approved" ? "ซ่อน" : "อนุมัติ"}
                    </button>
                  </form>
                  <form action={deletePlayer}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rowbtn" style={{ color: "var(--live)" }}>
                      ลบ
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {players.length === 0 ? (
              <tr>
                <td colSpan={7} className="muted">
                  ยังไม่มีนักเตะ
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: 16, margin: "8px 0 10px" }}>+ เพิ่มนักเตะเอง</h3>
      <form action={createPlayer}>
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
                  {p.label}
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
            <input name="rate" placeholder="500/แมตช์" />
          </div>
          <div className="field">
            <label>ช่องทางติดต่อ</label>
            <input name="contact" placeholder="LINE / เบอร์โทร" />
          </div>
          <div className="field">
            <label>อัปโหลดรูปจากเครื่อง</label>
            <input name="photo_file" type="file" accept="image/*" />
          </div>
          <div className="field full">
            <label>สถิติ / โปรไฟล์</label>
            <textarea name="bio" placeholder="ประสบการณ์ ความถนัด สถิติต่างๆ" style={{ minHeight: 80 }} />
          </div>
          <div className="field">
            <label>สถานะ</label>
            <select name="status" defaultValue="approved">
              <option value="approved">แสดงบนเว็บเลย</option>
              <option value="pending">รออนุมัติก่อน</option>
            </select>
          </div>
          <div className="field full">
            <button type="submit" className="btn green">
              บันทึกนักเตะ
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
