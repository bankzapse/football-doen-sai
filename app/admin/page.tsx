import Link from "next/link";
import { getAllTournamentsAdmin } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  formatBaht,
  formatThaiDateRange,
  STATUS_META,
  FORMAT_LABEL,
} from "@/lib/format";

export default async function AdminDashboard() {
  const tournaments = await getAllTournamentsAdmin();

  const openCount = tournaments.filter(
    (t) => t.status === "registering" || t.status === "closing"
  ).length;
  const liveCount = tournaments.filter((t) => t.status === "live").length;
  const revenue = tournaments
    .filter((t) => t.status !== "finished" && t.status !== "draft")
    .reduce((s, t) => s + t.entry_fee * t.team_limit, 0);

  return (
    <>
      <div className="admin-head">
        <h1>รายการแข่งขัน</h1>
        <Link href="/admin/tournaments/new" className="btn gold">
          + เพิ่มรายการใหม่
        </Link>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="notice">
          ตอนนี้ยังไม่ได้เชื่อม Supabase — กำลังแสดง<b>ข้อมูลตัวอย่าง (seed)</b>{" "}
          ใส่คีย์ใน <code>.env.local</code> แล้วรัน <code>supabase/schema.sql</code> เพื่อใช้ฐานข้อมูลจริง
        </div>
      ) : null}

      <div className="kpis">
        <div className="kpi">
          <b className="tnum">{tournaments.length}</b>
          <span>รายการทั้งหมด</span>
        </div>
        <div className="kpi">
          <b className="tnum">{openCount}</b>
          <span>กำลังรับสมัคร</span>
        </div>
        <div className="kpi">
          <b className="tnum">{liveCount}</b>
          <span>ถ่ายทอดสดตอนนี้</span>
        </div>
        <div className="kpi">
          <b className="tnum">{formatBaht(revenue)}</b>
          <span>ค่าสมัครโดยประมาณ</span>
        </div>
      </div>

      <div className="tablescroll">
        <table className="atable">
          <thead>
            <tr>
              <th>ชื่อรายการ</th>
              <th>จังหวัด</th>
              <th>ประเภท</th>
              <th>วันแข่ง</th>
              <th>ทีม</th>
              <th>เงินรางวัล</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.province}</td>
                <td>{FORMAT_LABEL[t.format]}</td>
                <td className="tnum">{formatThaiDateRange(t.match_start, t.match_end)}</td>
                <td className="tnum">{t.team_limit}</td>
                <td className="tnum">{formatBaht(t.prize_total)}</td>
                <td>
                  <span className={`pill ${STATUS_META[t.status].className}`}>
                    {STATUS_META[t.status].label}
                  </span>
                </td>
                <td>
                  <Link href={`/tournament/${t.slug}`} className="rowbtn">
                    ดูหน้าเว็บ
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
