import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getApprovedPlayers,
  getPlayerProvinces,
  POSITIONS,
  POSITION_LABEL,
  FOOT_LABEL,
} from "@/lib/players";
import PlayerProvinceFilter from "@/components/PlayerProvinceFilter";

export const metadata: Metadata = {
  title: "หานักเตะเดินสาย",
  description:
    "รวมนักเตะเดินสายทั่วไทยที่กำลังหาทีมลงแข่ง — ดูตำแหน่ง จังหวัด ค่าตัว/เรทต่อแมตช์ และช่องทางติดต่อ ชวนไปร่วมทีมได้เลย",
};

export const revalidate = 120;

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string; province?: string; ok?: string }>;
}) {
  const { pos, province, ok } = await searchParams;
  const [players, provinces] = await Promise.all([
    getApprovedPlayers({ position: pos, province }),
    getPlayerProvinces(),
  ]);

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="page-head">
          <h1>หานักเตะเดินสาย</h1>
          <p>
            นักเตะอิสระที่กำลังหาทีมไปลงแข่ง — เลือกดูตามตำแหน่ง/จังหวัด แล้วติดต่อชวนร่วมทีมได้เลย
            เป็นนักเตะอยากลงประกาศหาทีม?{" "}
            <Link href="/players/join" className="hi" style={{ fontWeight: 800 }}>
              ลงชื่อที่นี่
            </Link>
          </p>
        </div>

        {ok ? (
          <div className="notice ok">
            ส่งข้อมูลเรียบร้อย! โปรไฟล์จะแสดงบนเว็บหลังทีมงานตรวจอนุมัติ
          </div>
        ) : null}

        {/* ฟิลเตอร์ตำแหน่ง */}
        <div className="chip-row">
          <Link href="/players" className={`chip ${!pos ? "on" : ""}`}>
            ทุกตำแหน่ง
          </Link>
          {POSITIONS.map((p) => {
            const q = new URLSearchParams();
            q.set("pos", p.key);
            if (province) q.set("province", province);
            return (
              <Link
                key={p.key}
                href={`/players?${q.toString()}`}
                className={`chip ${pos === p.key ? "on" : ""}`}
              >
                {p.emoji} {p.label}
              </Link>
            );
          })}
        </div>

        {/* ฟิลเตอร์จังหวัด (dropdown) */}
        {provinces.length > 0 ? (
          <div style={{ marginTop: 10 }}>
            <PlayerProvinceFilter provinces={provinces} />
          </div>
        ) : null}

        <div className="section-title" style={{ marginTop: 20 }}>
          <h2>นักเตะ {players.length} คน</h2>
          <Link href="/players/join" className="btn gold" style={{ marginLeft: "auto" }}>
            + ลงชื่อหาทีม
          </Link>
        </div>

        {players.length === 0 ? (
          <p className="muted">ยังไม่มีนักเตะในเงื่อนไขนี้ — ลองเปลี่ยนตัวกรอง หรือเป็นคนแรกที่ลงชื่อ</p>
        ) : (
          <div className="fp-grid">
            {players.map((p) => (
              <div key={p.id} className="fp-card">
                <div
                  className="fp-photo"
                  style={
                    p.photo_url ? { backgroundImage: `url(${p.photo_url})` } : undefined
                  }
                >
                  {!p.photo_url ? <span>{POSITION_LABEL[p.position].charAt(0)}</span> : null}
                  <span className="fp-badge">{POSITION_LABEL[p.position]}</span>
                </div>
                <div className="fp-body">
                  <div className="fp-name">
                    {p.name}
                    {p.nickname ? <small> ({p.nickname})</small> : null}
                  </div>
                  <div className="fp-meta muted">
                    {[
                      p.province,
                      p.age ? `${p.age} ปี` : null,
                      p.height ? `${p.height} ซม.` : null,
                      p.foot ? FOOT_LABEL[p.foot] : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  {p.rate ? (
                    <div className="fp-rate">💰 ค่าตัว/เรท: {p.rate}</div>
                  ) : null}
                  {p.bio ? <p className="fp-bio">{p.bio}</p> : null}
                  {p.contact ? (
                    <div className="fp-contact">📞 {p.contact}</div>
                  ) : (
                    <div className="muted" style={{ fontSize: 13 }}>ไม่ระบุช่องทางติดต่อ</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 44 }} />
      </main>
      <Footer />
    </>
  );
}
