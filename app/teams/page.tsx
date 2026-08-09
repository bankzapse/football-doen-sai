import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTeams } from "@/lib/teams";

export const metadata: Metadata = {
  title: "ทีม",
  description: "ทำเนียบทีมฟุตบอลเดินสายทั่วไทย พร้อมรายชื่อผู้จัดการทีม โค้ช และนักเตะ",
};

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="page-head">
          <h1>ทำเนียบทีม</h1>
          <p>ทีมฟุตบอลเดินสายทั่วไทย ดูรายชื่อผู้จัดการ โค้ช และนักเตะแต่ละทีม</p>
        </div>

        {teams.length === 0 ? (
          <p className="muted">ยังไม่มีทีมในระบบ</p>
        ) : (
          <div className="tile-grid">
            {teams.map((t) => (
              <Link key={t.id} href={`/teams/${t.id}`} className="team-card">
                <div className="team-badge">{t.logo_url ? <img src={t.logo_url} alt={t.name} /> : t.name.slice(0, 2)}</div>
                <div>
                  <h3>{t.name}</h3>
                  <p className="muted">
                    {t.province ? `จ.${t.province}` : ""}
                    {t.players?.length ? ` · ${t.players.length} คน` : ""}
                  </p>
                  {t.coach_name ? <p className="muted" style={{ fontSize: 12 }}>โค้ช: {t.coach_name}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div style={{ height: 40 }} />
      </main>
      <Footer />
    </>
  );
}
