import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProvinceSelect from "@/components/ProvinceSelect";
import { createThreadAction } from "@/app/community/actions";
import { CATEGORIES } from "@/lib/community";
import { getTournaments } from "@/lib/data";

export const metadata: Metadata = {
  title: "ตั้งกระทู้ใหม่",
  robots: { index: false, follow: false },
};

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; cat?: string; tournament?: string }>;
}) {
  const { error, cat, tournament } = await searchParams;
  const tournaments = await getTournaments();

  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 760 }}>
        <div className="page-head">
          <h1>ตั้งกระทู้ใหม่</h1>
          <p>โพสต์หาคู่แข่ง หาทีม หานักเตะ หรือพูดคุย — ใส่ช่องทางติดต่อให้คนอื่นติดต่อกลับได้</p>
        </div>

        {error === "missing" ? (
          <div className="notice">กรุณากรอกหัวข้อ เนื้อหา และชื่อผู้โพสต์ให้ครบ</div>
        ) : error === "rate" ? (
          <div className="notice">โพสต์ถี่เกินไป กรุณารอสักครู่ (โพสต์ได้ทุก 30 วินาที)</div>
        ) : error === "hourly" ? (
          <div className="notice">โพสต์ครบจำนวนที่กำหนดต่อชั่วโมงแล้ว ลองใหม่ภายหลังครับ</div>
        ) : error === "nodb" ? (
          <div className="notice">ยังไม่ได้เชื่อม Supabase จึงโพสต์ไม่ได้</div>
        ) : error ? (
          <div className="notice">โพสต์ไม่สำเร็จ: {error}</div>
        ) : null}

        <form action={createThreadAction}>
          <div className="formgrid">
            <div className="field">
              <label>หมวด *</label>
              <select name="category" defaultValue={cat || "find_opponent"}>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.emoji} {c.label} — {c.hint}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>จังหวัด/โซน</label>
              <ProvinceSelect />
            </div>

            <div className="field full">
              <label>หัวข้อ *</label>
              <input name="title" required placeholder="เช่น หาคู่แข่ง 7 คน โซนพนัสนิคม เสาร์นี้" />
            </div>

            <div className="field full">
              <label>รายละเอียด *</label>
              <textarea name="body" required placeholder="ระดับทีม วันเวลา สนาม เงื่อนไข ฯลฯ" style={{ minHeight: 120 }} />
            </div>

            <div className="field">
              <label>ชื่อผู้โพสต์ *</label>
              <input name="author_name" required placeholder="ชื่อ/ชื่อทีม" />
            </div>
            <div className="field">
              <label>ช่องทางติดต่อ</label>
              <input name="author_contact" placeholder="LINE / เบอร์โทร" />
            </div>

            <div className="field full">
              <label>เกี่ยวกับรายการแข่ง (ถ้ามี)</label>
              <select name="tournament_id" defaultValue={tournament || ""}>
                <option value="">— ไม่เกี่ยวกับรายการใด —</option>
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* honeypot กันบอท (ซ่อนไว้) */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden />

            <div className="field full" style={{ flexDirection: "row", gap: 10 }}>
              <button type="submit" className="btn green">
                โพสต์กระทู้
              </button>
              <Link href="/community" className="btn ghost">
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
