import Link from "next/link";
import { notFound } from "next/navigation";
import { getTournamentById, getVenues } from "@/lib/data";
import { updateTournament, deleteTournament } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase";

/** ตัดเฉพาะส่วนวันที่ (YYYY-MM-DD) ให้ใส่ใน <input type="date"> ได้ */
function dateVal(iso: string | null | undefined): string {
  return iso ? String(iso).slice(0, 10) : "";
}

export default async function EditTournamentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const [t, venues] = await Promise.all([getTournamentById(id), getVenues()]);
  if (!t) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>แก้ไขรายการแข่งขัน</h1>
        <Link href="/admin" className="btn ghost">
          ← กลับ
        </Link>
      </div>

      {error ? <div className="notice">บันทึกไม่สำเร็จ: {error}</div> : null}
      {!isSupabaseConfigured() ? (
        <div className="notice">
          โหมดตัวอย่าง: การแก้ไขจะบันทึกได้เมื่อเชื่อม Supabase แล้วเท่านั้น
        </div>
      ) : null}

      <form action={updateTournament}>
        <input type="hidden" name="id" value={t.id} />
        <div className="formgrid">
          <div className="field full">
            <label>ชื่อรายการ *</label>
            <input name="name" required defaultValue={t.name} />
          </div>

          <div className="field">
            <label>Slug (URL)</label>
            <input name="slug" defaultValue={t.slug} />
            <span className="hint">เปลี่ยน slug จะเปลี่ยน URL หน้ารายการด้วย</span>
          </div>
          <div className="field">
            <label>ประเภท</label>
            <select name="format" defaultValue={t.format}>
              <option value="7">7 คน</option>
              <option value="9">9 คน</option>
              <option value="11">11 คน</option>
            </select>
          </div>

          <div className="field">
            <label>จังหวัด *</label>
            <input name="province" required defaultValue={t.province} />
          </div>
          <div className="field">
            <label>สถานะ</label>
            <select name="status" defaultValue={t.status}>
              <option value="draft">ร่าง (ยังไม่เผยแพร่)</option>
              <option value="registering">กำลังรับสมัคร</option>
              <option value="closing">ใกล้ปิดรับ</option>
              <option value="live">แข่งวันนี้ / ถ่ายทอดสด</option>
              <option value="finished">จบแล้ว</option>
            </select>
          </div>

          <div className="field">
            <label>สนามแข่ง</label>
            <select name="venue_id" defaultValue={t.venue_id ?? ""}>
              <option value="">— ไม่ระบุ —</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (จ.{v.province})
                </option>
              ))}
            </select>
            <span className="hint">
              เพิ่มสนามใหม่ได้ที่เมนู “สนามแข่ง”
            </span>
          </div>
          <div className="field">
            <label>จำนวนทีมที่รับ</label>
            <input name="team_limit" inputMode="numeric" defaultValue={t.team_limit || ""} />
          </div>

          <div className="field">
            <label>วันปิดรับสมัคร</label>
            <input name="reg_close" type="date" defaultValue={dateVal(t.reg_close)} />
          </div>
          <div className="field">
            <label>วันเริ่มแข่ง *</label>
            <input name="match_start" type="date" required defaultValue={dateVal(t.match_start)} />
          </div>
          <div className="field">
            <label>วันสิ้นสุด (ถ้ามี)</label>
            <input name="match_end" type="date" defaultValue={dateVal(t.match_end)} />
          </div>
          <div className="field">
            <label>&nbsp;</label>
            <span className="hint">เว้นวันสิ้นสุดได้ถ้าแข่งวันเดียว</span>
          </div>

          <div className="field">
            <label>ค่าสมัคร (บาท)</label>
            <input name="entry_fee" inputMode="numeric" defaultValue={t.entry_fee || ""} />
          </div>
          <div className="field">
            <label>ประกันทีม (บาท)</label>
            <input name="deposit" inputMode="numeric" defaultValue={t.deposit || ""} />
          </div>

          <div className="field">
            <label>เงินรางวัลรวม (บาท)</label>
            <input name="prize_total" inputMode="numeric" defaultValue={t.prize_total || ""} />
          </div>
          <div className="field">
            <label>ชนะเลิศ (บาท)</label>
            <input name="prize_champion" inputMode="numeric" defaultValue={t.prize_champion || ""} />
          </div>
          <div className="field">
            <label>รองชนะเลิศ (บาท)</label>
            <input name="prize_runnerup" inputMode="numeric" defaultValue={t.prize_runnerup ?? ""} />
          </div>
          <div className="field">
            <label>อันดับ 3 (บาท)</label>
            <input name="prize_third" inputMode="numeric" defaultValue={t.prize_third ?? ""} />
          </div>

          <div className="field full">
            <label>ลิงก์ถ่ายทอดสด (YouTube / Facebook)</label>
            <input name="live_url" defaultValue={t.live_url ?? ""} />
          </div>
          <div className="field full">
            <label>อัปโหลดโปสเตอร์ใหม่ (ถ้าต้องการเปลี่ยน)</label>
            <input name="poster_file" type="file" accept="image/*" />
          </div>
          <div className="field full">
            <label>ลิงก์รูปภาพ / แบ็คกราวด์ (SEO)</label>
            <input name="image_url" defaultValue={t.image_url ?? ""} />
            <span className="hint">ถ้าอัปโหลดไฟล์ด้านบน ช่องนี้จะถูกข้าม</span>
          </div>

          <div className="field">
            <label>ผู้จัด</label>
            <input name="organizer_name" defaultValue={t.organizer_name ?? ""} />
          </div>
          <div className="field">
            <label>เบอร์ติดต่อ</label>
            <input name="organizer_phone" defaultValue={t.organizer_phone ?? ""} />
          </div>
          <div className="field">
            <label>LINE ID</label>
            <input name="organizer_line" defaultValue={t.organizer_line ?? ""} />
          </div>

          <div className="field full">
            <label>รายละเอียด</label>
            <textarea name="description" defaultValue={t.description ?? ""} />
          </div>

          <div className="field full" style={{ flexDirection: "row", gap: 10 }}>
            <button type="submit" className="btn green">
              บันทึกการแก้ไข
            </button>
            <Link href="/admin" className="btn ghost">
              ยกเลิก
            </Link>
          </div>
        </div>
      </form>

      <div
        className="callout"
        style={{ marginTop: 22, borderLeftColor: "var(--live)", display: "flex", alignItems: "center", gap: 12 }}
      >
        <span style={{ flex: 1 }}>
          ลบรายการนี้ถาวร — ผลการแข่งขันและตารางคะแนนที่ผูกอยู่จะถูกลบตามไปด้วย
        </span>
        <form action={deleteTournament}>
          <input type="hidden" name="id" value={t.id} />
          <button className="btn" style={{ color: "var(--live)", borderColor: "var(--live)" }}>
            ลบรายการ
          </button>
        </form>
      </div>
    </>
  );
}
