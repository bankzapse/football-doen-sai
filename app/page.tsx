import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TournamentBrowser from "@/components/TournamentBrowser";
import { getTournaments, getSponsors } from "@/lib/data";
import { getTournamentViews, getSiteViewStats } from "@/lib/stats";
import { getRecentActiveThreads, CATEGORY_LABEL, type ThreadCategory } from "@/lib/community";
import { getApprovedPlayers, POSITION_LABEL } from "@/lib/players";
import {
  formatBaht,
  formatThaiDateRange,
  timeAgo,
  STATUS_META,
  FORMAT_LABEL,
} from "@/lib/format";

const TH_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

export const revalidate = 60; // อัปเดตข้อมูล/ยอดวิวอัตโนมัติทุก 60 วินาที

export default async function HomePage() {
  const [tournaments, sponsors, viewsMap, recentThreads, siteStats, allPlayers] = await Promise.all([
    getTournaments(),
    getSponsors(),
    getTournamentViews(),
    getRecentActiveThreads(6),
    getSiteViewStats(),
    getApprovedPlayers(),
  ]);
  const viewsBySlug = Object.fromEntries(viewsMap);
  const homePlayers = allPlayers.slice(0, 8);

  const live = tournaments.find((t) => t.status === "live" && t.live_url);
  const upcoming = tournaments
    .filter((t) => t.status !== "finished")
    .sort((a, b) => a.match_start.localeCompare(b.match_start))
    .slice(0, 4);

  const totalPrize = tournaments
    .filter((t) => t.status !== "finished")
    .reduce((s, t) => s + t.prize_total, 0);
  const provinceCount = new Set(tournaments.map((t) => t.province)).size;
  const openCount = tournaments.filter(
    (t) => t.status === "registering" || t.status === "closing"
  ).length;

  return (
    <>
      <Header />

      <main>
        <section className="hero wrap">
          <h1>
            ศูนย์รวม<span className="hi">ฟุตบอลเดินสาย</span>ทั่วไทย ที่เดียวจบ
          </h1>
          <p className="sub">
            รวมทุกรายการแข่งขัน 7 คน / 9 คน / 11 คน — เปิดรับสมัครวันไหน แข่งวันไหน กี่ทีม
            เงินรางวัลเท่าไหร่ ดูถ่ายทอดสดได้ครบในที่เดียว
          </p>
          <div className="stat-cards">
            <div className="stat-card accent-green">
              <div className="stat-ic">📋</div>
              <div className="stat-body">
                <b className="tnum">{openCount}</b>
                <span>รายการที่กำลังรับสมัคร</span>
              </div>
            </div>
            <div className="stat-card accent-teal">
              <div className="stat-ic">📍</div>
              <div className="stat-body">
                <b className="tnum">{provinceCount}</b>
                <span>จังหวัดทั่วไทย</span>
              </div>
            </div>
            <div className="stat-card accent-gold">
              <div className="stat-ic">🏆</div>
              <div className="stat-body">
                <b className="tnum gold-text">{formatBaht(totalPrize)}</b>
                <span>เงินรางวัลรวม</span>
              </div>
            </div>
            <div className="stat-card accent-slate">
              <div className="stat-ic">👁</div>
              <div className="stat-body">
                <b className="tnum">{(siteStats?.total ?? 0).toLocaleString("th-TH")}</b>
                <span>ยอดเข้าชมเว็บ</span>
              </div>
            </div>
          </div>

          {live ? (
            <div className="live-strip">
              <span className="live-badge">
                <span className="dot" />
                LIVE สด
              </span>
              <div>
                <Link href={`/tournament/${live.slug}`} className="lmatch">
                  {live.name}
                </Link>
                <div className="lmeta">
                  {live.venue?.name} · จ.{live.province}
                </div>
              </div>
              <div className="spacer live-actions">
                <Link href={`/tournament/${live.slug}`} className="btn ghost">
                  รายละเอียด
                </Link>
                <a href={live.live_url!} target="_blank" rel="noreferrer" className="btn green">
                  ดูสด ▶
                </a>
              </div>
            </div>
          ) : null}
        </section>

        <section className="wrap">
          <div className="grid-2">
            <div>
              <TournamentBrowser tournaments={tournaments} viewsBySlug={viewsBySlug} />
            </div>

            <aside>
              <div className="panel">
                <h4>สปอนเซอร์หลักของเว็บ</h4>
                <div className="sponsor-grid">
                  {sponsors.map((s) => (
                    <div key={s.id} className={`sponsor ${s.tier}`}>
                      {s.name}
                    </div>
                  ))}
                </div>
                <Link href="/sponsors" className="btn ghost block" style={{ marginTop: 12 }}>
                  เป็นสปอนเซอร์กับเรา →
                </Link>
              </div>

              <div className="panel">
                <h4>ปฏิทินใกล้แข่ง</h4>
                {upcoming.map((t) => {
                  const d = new Date(t.match_start);
                  return (
                    <Link key={t.id} href={`/tournament/${t.slug}`} className="upcoming">
                      <div className="datepill">
                        <b className="tnum">{String(d.getDate()).padStart(2, "0")}</b>
                        <span>{TH_MONTHS[d.getMonth()]}</span>
                      </div>
                      <div>
                        <div className="t">{t.name}</div>
                        <div className="p">
                          {formatBaht(t.prize_total)} · {t.province}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </aside>
          </div>

          {/* contact CTA */}
          <section className="cta-band" id="contact">
            <div>
              <h2>อยากจัดรายการแข่ง? ให้เราช่วยประชาสัมพันธ์</h2>
              <p>
                ส่งรายละเอียดมาทาง LINE หรือโทรหาเรา — <b>ทีมงานลงข้อมูลให้ครบทุกอย่าง</b>{" "}
                ทั้งหน้ารายการ ตารางแข่ง ลิงก์ถ่ายทอดสด และหน้า SEO ให้คนค้นเจอทั่วประเทศ
              </p>
            </div>
            <div className="cta-actions">
              <a href="#" className="btn green">
                แอด LINE
              </a>
              <a href="tel:0646422168" className="btn gold">
                โทร 064-642-2168
              </a>
            </div>
          </section>

          {/* SEO schedule table */}
          <section className="seo">
            <div className="section-title">
              <h2>ตารางแข่งขันทั้งหมด</h2>
              <span>อัปเดตอัตโนมัติจากหลังบ้าน</span>
            </div>
            <div className="tablescroll">
              <table className="data tnum">
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th>จังหวัด</th>
                    <th>ประเภท</th>
                    <th>วันแข่ง</th>
                    <th>รับ (ทีม)</th>
                    <th>เงินรางวัลรวม</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <Link href={`/tournament/${t.slug}`}>
                          <b>{t.name}</b>
                        </Link>
                      </td>
                      <td>{t.province}</td>
                      <td>{FORMAT_LABEL[t.format]}</td>
                      <td>{formatThaiDateRange(t.match_start, t.match_end)}</td>
                      <td>{t.team_limit}</td>
                      <td>
                        <b>{formatBaht(t.prize_total)}</b>
                      </td>
                      <td>{STATUS_META[t.status].label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* หานักเตะเดินสาย */}
          {homePlayers.length > 0 ? (
            <section style={{ margin: "44px 0" }}>
              <div className="section-title">
                <h2>หานักเตะเดินสาย</h2>
                <Link href="/players" style={{ marginLeft: "auto", fontSize: 14 }} className="muted">
                  ดูทั้งหมด →
                </Link>
              </div>
              <div className="home-players">
                {homePlayers.map((p) => (
                  <Link key={p.id} href={`/players/${p.id}`} className="hp-card">
                    <div
                      className="hp-photo"
                      style={p.photo_url ? { backgroundImage: `url(${p.photo_url})` } : undefined}
                    >
                      {!p.photo_url ? <span>{p.name.slice(0, 1)}</span> : null}
                      <span className="hp-pos">{POSITION_LABEL[p.position]}</span>
                    </div>
                    <div className="hp-body">
                      <b>
                        {p.name}
                        {p.nickname ? ` (${p.nickname})` : ""}
                      </b>
                      <span className="muted">
                        {[p.province, p.age ? `${p.age} ปี` : null].filter(Boolean).join(" · ")}
                      </span>
                      {p.rate ? <span className="hp-rate">💰 {p.rate}</span> : null}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* คุยกันในชุมชน — กระทู้ที่มีความเคลื่อนไหวล่าสุด */}
          {recentThreads.length > 0 ? (
            <section style={{ margin: "44px 0" }}>
              <div className="section-title">
                <h2>คุยกันในชุมชน</h2>
                <Link href="/community" style={{ marginLeft: "auto", fontSize: 14 }} className="muted">
                  ดูทั้งหมด →
                </Link>
              </div>
              <div className="community-feed">
                {recentThreads.map((t) => (
                  <Link key={t.id} href={`/community/${t.id}`} className="thread-row">
                    <div className="thread-main">
                      <div className="thread-cat">
                        <span className="cat-tag">{CATEGORY_LABEL[t.category as ThreadCategory]}</span>
                        {t.province ? <span className="muted"> · {t.province}</span> : null}
                      </div>
                      <div className="thread-title">{t.title}</div>
                      <div className="thread-meta muted">
                        โดย {t.author_name} · {timeAgo(t.created_at)}
                      </div>
                    </div>
                    <div className="thread-replies">
                      <b className="tnum">{t.reply_count}</b>
                      <span>ตอบ</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </main>

      <Footer />
    </>
  );
}
