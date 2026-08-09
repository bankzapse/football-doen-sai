import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFinishedTournaments } from "@/lib/data";
import { formatThaiDateRange, formatBaht, FORMAT_LABEL } from "@/lib/format";

export const metadata: Metadata = {
  title: "ผลการแข่งขัน",
  description: "ผลการแข่งขันและแชมป์ฟุตบอลเดินสายทั่วไทย ย้อนหลังทุกรายการที่จบแล้ว",
};

export const revalidate = 300;

export default async function ResultsPage() {
  const finished = await getFinishedTournaments();

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="page-head">
          <h1>ผลการแข่งขัน</h1>
          <p>แชมป์และผลย้อนหลังทุกรายการที่จบการแข่งขันแล้ว</p>
        </div>

        {finished.length === 0 ? (
          <p className="muted">ยังไม่มีรายการที่จบการแข่งขัน</p>
        ) : (
          <div className="result-cards">
            {finished.map((t) => (
              <Link key={t.id} href={`/tournament/${t.slug}`} className="result-card">
                <div className="result-head">
                  <span className="tag type" style={{ background: "var(--surface-2)", color: "var(--muted)" }}>
                    {FORMAT_LABEL[t.format]} · จ.{t.province}
                  </span>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {formatThaiDateRange(t.match_start, t.match_end)}
                  </span>
                </div>
                <h3>{t.name}</h3>
                <div className="champ-row">
                  <span className="trophy">🏆</span>
                  <div>
                    <div className="muted" style={{ fontSize: 11 }}>แชมป์</div>
                    <b>{t.champion || "-"}</b>
                  </div>
                  <div className="prize-tag tnum">{formatBaht(t.prize_champion)}</div>
                </div>
                <div className="runner-row muted">
                  รองแชมป์: <b style={{ color: "var(--text)" }}>{t.runner_up || "-"}</b>
                  {t.top_scorer ? <> · ดาวซัลโว: <b style={{ color: "var(--text)" }}>{t.top_scorer}</b></> : null}
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
