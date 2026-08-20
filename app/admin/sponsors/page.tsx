import Link from "next/link";
import { getAllSponsorsAdmin } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSponsor, deleteSponsor, toggleSponsor, moveSponsor } from "@/app/admin/actions";
import type { Sponsor } from "@/lib/types";

const TIER_LABEL: Record<string, string> = {
  platinum: "พาร์ทเนอร์หลัก",
  gold: "สปอนเซอร์ทอง",
  standard: "สปอนเซอร์",
};

const PLACEMENT_LABEL: Record<string, string> = {
  side: "ด้านขวา",
  bottom: "ด้านล่าง",
  both: "ทั้งสอง",
};

export const PLAN_LABEL: Record<number, string> = {
  1: "รายเดือน",
  3: "3 เดือน",
  6: "6 เดือน",
  12: "รายปี",
};

function thaiDate(d: string | null | undefined): string {
  if (!d) return "-";
  const dt = new Date(d + "T00:00:00");
  const m = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${dt.getDate()} ${m[dt.getMonth()]} ${(dt.getFullYear() + 543) % 100}`;
}

/** แสดงแพ็กเกจ + วันหมดอายุ + สถานะเหลือ/หมดอายุ */
function BillingCell({ s }: { s: Sponsor }) {
  if (!s.plan_months || !s.end_date) return <span className="muted">-</span>;
  const days = Math.ceil((new Date(s.end_date + "T00:00:00").getTime() - Date.now()) / 86400000);
  const expired = days < 0;
  const soon = !expired && days <= 7;
  const color = expired ? "var(--live)" : soon ? "var(--gold)" : "var(--pitch)";
  return (
    <div style={{ lineHeight: 1.4 }}>
      <div style={{ fontWeight: 700 }}>{PLAN_LABEL[s.plan_months] ?? `${s.plan_months} เดือน`}</div>
      <div className="muted" style={{ fontSize: 12 }}>หมดอายุ {thaiDate(s.end_date)}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color }}>
        {expired ? "หมดอายุแล้ว" : `เหลือ ${days} วัน`}
      </div>
    </div>
  );
}

/** ตารางสปอนเซอร์ 1 section พร้อมปุ่มเลื่อนลำดับ ↑/↓ */
function SponsorSection({ title, group, list }: { title: string; group: "side" | "bottom"; list: Sponsor[] }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div className="section-title">
        <h2 style={{ fontSize: 17 }}>{title}</h2>
        <span>{list.length} ราย</span>
      </div>
      <div className="tablescroll">
        <table className="atable">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อ</th>
              <th>ระดับ</th>
              <th>ตำแหน่ง</th>
              <th>แพ็กเกจ / หมดอายุ</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => (
              <tr key={s.id}>
                <td style={{ display: "flex", gap: 4 }}>
                  <form action={moveSponsor}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="dir" value="up" />
                    <input type="hidden" name="group" value={group} />
                    <button className="rowbtn" disabled={i === 0} aria-label="เลื่อนขึ้น">↑</button>
                  </form>
                  <form action={moveSponsor}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="dir" value="down" />
                    <input type="hidden" name="group" value={group} />
                    <button className="rowbtn" disabled={i === list.length - 1} aria-label="เลื่อนลง">↓</button>
                  </form>
                </td>
                <td>
                  {s.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logo_url} alt={s.name} style={{ height: 22, width: "auto", display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
                  ) : null}
                  {s.name}
                </td>
                <td>{TIER_LABEL[s.tier] ?? s.tier}</td>
                <td>{PLACEMENT_LABEL[s.placement ?? "side"]}</td>
                <td><BillingCell s={s} /></td>
                <td>
                  <span className="pill" style={{ background: s.active ? "var(--surface-3)" : "transparent", color: s.active ? "var(--pitch)" : "var(--muted)", border: "1px solid var(--border)" }}>
                    {s.active ? "แสดง" : "ซ่อน"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 6 }}>
                  <Link href={`/admin/sponsors/${s.id}`} className="rowbtn">แก้ไข</Link>
                  <form action={toggleSponsor}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="active" value={String(s.active)} />
                    <button className="rowbtn">{s.active ? "ซ่อน" : "แสดง"}</button>
                  </form>
                  <form action={deleteSponsor}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="rowbtn" style={{ color: "var(--live)" }}>ลบ</button>
                  </form>
                </td>
              </tr>
            ))}
            {list.length === 0 ? (
              <tr><td colSpan={7} className="muted">ยังไม่มีสปอนเซอร์ในตำแหน่งนี้</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
  const sideList = sponsors.filter((s) => (s.placement ?? "side") !== "bottom");
  const bottomList = sponsors.filter((s) => s.placement === "bottom" || s.placement === "both");

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

      <div className="callout">
        จัดลำดับการแสดงด้วยปุ่ม ↑ / ↓ ในแต่ละ section — สปอนเซอร์ที่ตั้งเป็น “ทั้งสอง” จะปรากฏในทั้งสอง section
      </div>

      <SponsorSection title="สปอนเซอร์ด้านขวา (คอลัมน์ข้าง)" group="side" list={sideList} />
      <SponsorSection title="สปอนเซอร์ด้านล่าง (แถบเต็มความกว้าง)" group="bottom" list={bottomList} />

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
            <label>ตำแหน่งแสดงผล</label>
            <select name="placement" defaultValue="side">
              <option value="side">ด้านขวา (คอลัมน์ข้าง)</option>
              <option value="bottom">ด้านล่าง (แถบเต็มความกว้าง)</option>
              <option value="both">ทั้งด้านขวาและด้านล่าง</option>
            </select>
          </div>
          <div className="field">
            <label>ขนาดกล่อง</label>
            <select name="size" defaultValue="sm">
              <option value="sm">เล็ก (1 ช่อง)</option>
              <option value="md">กลาง (2 ช่อง)</option>
              <option value="lg">ใหญ่ (3 ช่อง)</option>
            </select>
          </div>
          <div className="field">
            <label>อัปโหลดโลโก้จากเครื่อง</label>
            <input name="logo_file" type="file" accept="image/*" />
            <span className="hint">เลือกไฟล์รูปได้เลย (เก็บใน Supabase Storage)</span>
          </div>
          <div className="field">
            <label>หรือใส่ลิงก์โลโก้</label>
            <input name="logo_url" placeholder="https://..." />
            <span className="hint">ถ้าอัปโหลดไฟล์ด้านบนแล้ว ช่องนี้จะถูกข้าม</span>
          </div>
          <div className="field">
            <label>เว็บไซต์</label>
            <input name="website" placeholder="https://..." />
          </div>
          <div className="field">
            <label>แพ็กเกจ (รอบชำระ)</label>
            <select name="plan_months" defaultValue="">
              <option value="">— ไม่ระบุ —</option>
              <option value="1">รายเดือน (1 เดือน)</option>
              <option value="3">3 เดือน</option>
              <option value="6">6 เดือน</option>
              <option value="12">รายปี (12 เดือน)</option>
            </select>
          </div>
          <div className="field">
            <label>วันเริ่ม</label>
            <input name="start_date" type="date" />
            <span className="hint">ระบบจะคำนวณวันหมดอายุให้อัตโนมัติ</span>
          </div>
          <div className="field">
            <label>ค่าลง (บาท)</label>
            <input name="price" inputMode="numeric" placeholder="เช่น 3,000" />
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
