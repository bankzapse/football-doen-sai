import Link from "next/link";
import { getAllSponsorsAdmin } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSponsor, deleteSponsor, toggleSponsor } from "@/app/admin/actions";

const TIER_LABEL: Record<string, string> = {
  platinum: "พาร์ทเนอร์หลัก",
  gold: "สปอนเซอร์ทอง",
  standard: "สปอนเซอร์",
};

const OK_MSG: Record<string, string> = {
  created: "เพิ่มสปอนเซอร์เรียบร้อยแล้ว",
  updated: "แก้ไขสปอนเซอร์เรียบร้อยแล้ว",
  deleted: "ลบสปอนเซอร์เรียบร้อยแล้ว",
};

export default async function AdminSponsorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const sponsors = await getAllSponsorsAdmin();

  return (
    <>
      <div className="admin-head">
        <h1>สปอนเซอร์</h1>
        <Link href="/sponsors" className="btn ghost">
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
              <th>ระดับ</th>
              <th>เว็บไซต์</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{TIER_LABEL[s.tier] ?? s.tier}</td>
                <td>
                  {s.website ? (
                    <a href={s.website} target="_blank" rel="noreferrer">
                      ลิงก์
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <span
                    className="pill"
                    style={{
                      background: s.active ? "var(--surface-3)" : "transparent",
                      color: s.active ? "var(--pitch)" : "var(--muted)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {s.active ? "แสดง" : "ซ่อน"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 6 }}>
                  <Link href={`/admin/sponsors/${s.id}`} className="rowbtn">
                    แก้ไข
                  </Link>
                  <form action={toggleSponsor}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="active" value={String(s.active)} />
                    <button className="rowbtn">{s.active ? "ซ่อน" : "แสดง"}</button>
                  </form>
                  <form action={deleteSponsor}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="rowbtn" style={{ color: "var(--live)" }}>
                      ลบ
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 ? (
              <tr>
                <td colSpan={5} className="muted">
                  ยังไม่มีสปอนเซอร์
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: 16, margin: "8px 0 10px" }}>+ เพิ่มสปอนเซอร์ใหม่</h3>
      <form action={createSponsor}>
        <div className="formgrid">
          <div className="field">
            <label>ชื่อสปอนเซอร์ *</label>
            <input name="name" required placeholder="M7 SEVEN" />
          </div>
          <div className="field">
            <label>ระดับ</label>
            <select name="tier" defaultValue="standard">
              <option value="platinum">พาร์ทเนอร์หลัก (platinum)</option>
              <option value="gold">สปอนเซอร์ทอง (gold)</option>
              <option value="standard">สปอนเซอร์ (standard)</option>
            </select>
          </div>
          <div className="field">
            <label>ลิงก์โลโก้</label>
            <input name="logo_url" placeholder="https://..." />
          </div>
          <div className="field">
            <label>เว็บไซต์</label>
            <input name="website" placeholder="https://..." />
          </div>
          <div className="field">
            <label>การแสดงผล</label>
            <select name="active" defaultValue="true">
              <option value="true">แสดงบนเว็บ</option>
              <option value="false">ซ่อนไว้ก่อน</option>
            </select>
          </div>
          <div className="field full">
            <button type="submit" className="btn green">
              บันทึกสปอนเซอร์
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
