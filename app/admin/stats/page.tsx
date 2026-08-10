import Link from "next/link";
import { getSiteViewStats, getTournamentViews } from "@/lib/stats";
import { getAllTournamentsAdmin } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const [stats, tviews, tournaments] = await Promise.all([
    getSiteViewStats(),
    getTournamentViews(),
    getAllTournamentsAdmin(),
  ]);

  // จับคู่ยอดเข้าชมกับชื่อรายการ แล้วเรียงมาก→น้อย
  const rows = tournaments
    .map((t) => ({ name: t.name, slug: t.slug, views: tviews.get(t.slug) ?? 0 }))
    .sort((a, b) => b.views - a.views);

  const cards = [
    { label: "วันนี้ (24 ชม.)", value: stats?.today },
    { label: "7 วันล่าสุด", value: stats?.last7 },
    { label: "30 วันล่าสุด", value: stats?.last30 },
    { label: "ทั้งหมด", value: stats?.total },
  ];

  return (
    <>
      <div className="admin-head">
        <h1>สถิติการเข้าชม</h1>
        <Link href="/" className="btn ghost">
          ดูหน้าเว็บ
        </Link>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="notice">
          โหมดตัวอย่าง: สถิติจะเริ่มบันทึกเมื่อเชื่อม Supabase และรันไฟล์ SQL แล้ว
        </div>
      ) : null}

      <div className="stat-cards">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className="stat-value tnum">{(c.value ?? 0).toLocaleString("th-TH")}</div>
            <div className="stat-label muted">{c.label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, margin: "22px 0 10px" }}>ยอดเข้าชมรายรายการแข่ง</h3>
      <div className="tablescroll">
        <table className="atable">
          <thead>
            <tr>
              <th>รายการ</th>
              <th style={{ textAlign: "right" }}>ยอดเข้าชม</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug}>
                <td>
                  <Link href={`/tournament/${r.slug}`}>{r.name}</Link>
                </td>
                <td className="tnum" style={{ textAlign: "right" }}>
                  👁 {r.views.toLocaleString("th-TH")}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2} className="muted">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
