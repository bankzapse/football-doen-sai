import Link from "next/link";
import ProvinceSelect from "@/components/ProvinceSelect";
import { createTournament } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase";

export default async function NewTournamentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <div className="admin-head">
        <h1>เพิ่มรายการแข่งขัน</h1>
        <Link href="/admin" className="btn ghost">
          ← กลับ
        </Link>
      </div>

      <div className="callout">
        ทีมงานเรากรอกข้อมูลจากที่ผู้จัดติดต่อเข้ามา (LINE / โทร / ฟอร์มติดต่อ) → กด “บันทึกและเผยแพร่”
        → ขึ้นหน้าเว็บ + สร้างหน้า SEO อัตโนมัติทันที
      </div>

      {error === "nodb" ? (
        <div className="notice">
          ยังไม่ได้เชื่อม Supabase จึงบันทึกไม่ได้ — ใส่คีย์ใน <code>.env.local</code>{" "}
          และรัน <code>supabase/schema.sql</code> ก่อน แล้วลองใหม่อีกครั้ง
        </div>
      ) : error ? (
        <div className="notice">บันทึกไม่สำเร็จ: {error}</div>
      ) : null}

      {!isSupabaseConfigured() ? (
        <div className="notice">
          โหมดตัวอย่าง: ฟอร์มนี้จะบันทึกได้เมื่อเชื่อม Supabase แล้วเท่านั้น
        </div>
      ) : null}

      <form action={createTournament}>
        <div className="formgrid">
          <div className="field full">
            <label>ชื่อรายการ *</label>
            <input name="name" required placeholder="เช่น NONGSANG × M7SEVEN OPEN CUP 2026 #1" />
          </div>

          <div className="field">
            <label>Slug (URL)</label>
            <input name="slug" placeholder="nongsang-m7seven-open-cup-2026-1" />
            <span className="hint">เว้นว่างได้ ระบบจะสร้างให้อัตโนมัติ</span>
          </div>
          <div className="field">
            <label>ประเภท</label>
            <select name="format" defaultValue="7">
              <option value="7">7 คน</option>
              <option value="9">9 คน</option>
              <option value="11">11 คน</option>
            </select>
          </div>

          <div className="field">
            <label>จังหวัด *</label>
            <ProvinceSelect required />
          </div>
          <div className="field">
            <label>สถานะ</label>
            <select name="status" defaultValue="registering">
              <option value="draft">ร่าง (ยังไม่เผยแพร่)</option>
              <option value="registering">กำลังรับสมัคร</option>
              <option value="closing">ใกล้ปิดรับ</option>
              <option value="live">แข่งวันนี้ / ถ่ายทอดสด</option>
              <option value="finished">จบแล้ว</option>
            </select>
          </div>

          <div className="field">
            <label>ชื่อสนาม</label>
            <input name="venue_name" placeholder="Nongsang Stadium" />
          </div>
          <div className="field">
            <label>อำเภอ</label>
            <input name="district" placeholder="พนัสนิคม" />
          </div>
          <div className="field">
            <label>ขนาดสนาม</label>
            <input name="venue_size" placeholder="70×50 เมตร (หญ้าจริง)" />
          </div>
          <div className="field">
            <label>จำนวนทีมที่รับ</label>
            <input name="team_limit" inputMode="numeric" placeholder="32" />
          </div>

          <div className="field">
            <label>วันปิดรับสมัคร</label>
            <input name="reg_close" type="date" />
          </div>
          <div className="field">
            <label>&nbsp;</label>
            <span className="hint">กรอกวันแข่งด้านล่าง (เริ่ม–สิ้นสุด)</span>
          </div>
          <div className="field">
            <label>วันเริ่มแข่ง *</label>
            <input name="match_start" type="date" required />
          </div>
          <div className="field">
            <label>วันสิ้นสุด (ถ้ามี)</label>
            <input name="match_end" type="date" />
          </div>

          <div className="field">
            <label>ค่าสมัคร (บาท)</label>
            <input name="entry_fee" inputMode="numeric" placeholder="8000" />
          </div>
          <div className="field">
            <label>ประกันทีม (บาท)</label>
            <input name="deposit" inputMode="numeric" placeholder="1000" />
          </div>

          <div className="field">
            <label>เงินรางวัลรวม (บาท)</label>
            <input name="prize_total" inputMode="numeric" placeholder="130000" />
          </div>
          <div className="field">
            <label>ชนะเลิศ (บาท)</label>
            <input name="prize_champion" inputMode="numeric" placeholder="100000" />
          </div>
          <div className="field">
            <label>รองชนะเลิศ (บาท)</label>
            <input name="prize_runnerup" inputMode="numeric" placeholder="20000" />
          </div>
          <div className="field">
            <label>อันดับ 3 (บาท)</label>
            <input name="prize_third" inputMode="numeric" placeholder="5000" />
          </div>

          <div className="field full">
            <label>ลิงก์ถ่ายทอดสด (YouTube / Facebook)</label>
            <input name="live_url" placeholder="https://youtube.com/live/..." />
            <span className="hint">ถ้าเป็น YouTube ระบบจะฝังวิดีโอในหน้ารายการอัตโนมัติ</span>
          </div>
          <div className="field full">
            <label>อัปโหลดโปสเตอร์ / รูปภาพ</label>
            <input name="poster_file" type="file" accept="image/*" />
            <span className="hint">อัปโหลดไฟล์รูปโปสเตอร์ได้เลย (เก็บใน Supabase Storage)</span>
          </div>
          <div className="field full">
            <label>หรือใส่ลิงก์รูปภาพ / แบ็คกราวด์ (SEO)</label>
            <input name="image_url" placeholder="https://images.unsplash.com/..." />
            <span className="hint">ถ้าอัปโหลดไฟล์ด้านบนแล้ว ช่องนี้จะถูกข้าม</span>
          </div>

          <div className="field">
            <label>ผู้จัด</label>
            <input name="organizer_name" placeholder="เปาต้น วรินทร" />
          </div>
          <div className="field">
            <label>เบอร์ติดต่อ</label>
            <input name="organizer_phone" placeholder="064-642-2168" />
          </div>
          <div className="field">
            <label>LINE ID</label>
            <input name="organizer_line" placeholder="Kruton252629" />
          </div>

          <div className="field full">
            <label>รายละเอียด</label>
            <textarea name="description" placeholder="กติกา ระเบียบ ผู้ตัดสิน ฯลฯ" />
          </div>

          <div className="field full" style={{ flexDirection: "row", gap: 10 }}>
            <button type="submit" className="btn green">
              บันทึกและเผยแพร่
            </button>
            <Link href="/admin" className="btn ghost">
              ยกเลิก
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
