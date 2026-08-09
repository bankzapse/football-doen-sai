import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTournamentBySlug, getTournaments } from "@/lib/data";
import { getThreadsForTournament, CATEGORY_LABEL, type ThreadCategory } from "@/lib/community";
import {
  formatBaht,
  formatThaiDate,
  formatThaiDateRange,
  timeAgo,
  STATUS_META,
  FORMAT_LABEL,
} from "@/lib/format";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=60";

export async function generateStaticParams() {
  const tournaments = await getTournaments();
  return tournaments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTournamentBySlug(slug);
  if (!t) return { title: "ไม่พบรายการ" };

  const desc = `ฟุตบอล ${FORMAT_LABEL[t.format]} ${t.province} แข่ง ${formatThaiDateRange(
    t.match_start,
    t.match_end
  )} รับ ${t.team_limit} ทีม ชิงเงินรางวัลรวม ${formatBaht(t.prize_total)} ชนะเลิศ ${formatBaht(
    t.prize_champion
  )}`;

  return {
    title: t.name,
    description: desc,
    openGraph: {
      title: t.name,
      description: desc,
      images: t.image_url ? [t.image_url] : undefined,
    },
    alternates: { canonical: `/tournament/${t.slug}` },
  };
}

/** แปลงลิงก์ YouTube เป็นลิงก์สำหรับฝัง (embed) */
function toYouTubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTournamentBySlug(slug);
  if (!t) notFound();

  const status = STATUS_META[t.status];
  const cover = t.image_url || FALLBACK_IMG;
  const embed = t.live_url ? toYouTubeEmbed(t.live_url) : null;
  const threads = await getThreadsForTournament(t.id);

  const prizeRows = [
    { label: "ชนะเลิศ", value: t.prize_champion },
    { label: "รองชนะเลิศ", value: t.prize_runnerup },
    { label: "อันดับ 3", value: t.prize_third },
  ].filter((r) => r.value);

  // JSON-LD (Schema.org SportsEvent) เพื่อให้ Google เข้าใจและแสดงผลค้นหาสวยขึ้น
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: t.name,
    sport: "Football",
    startDate: t.match_start,
    endDate: t.match_end || t.match_start,
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: t.venue?.name || t.province,
      address: {
        "@type": "PostalAddress",
        addressLocality: t.venue?.district || undefined,
        addressRegion: t.province,
        addressCountry: "TH",
      },
    },
    image: [cover],
    description: t.description || undefined,
    organizer: t.organizer_name
      ? { "@type": "Organization", name: t.organizer_name, telephone: t.organizer_phone || undefined }
      : undefined,
  };

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="detail-hero" style={{ backgroundImage: `url(${cover})` }}>
        <div className="wrap inner">
          <div className="badges">
            <span className={`tag ${status.className}`}>{status.label}</span>
            <span className="tag type">ฟุตบอล {FORMAT_LABEL[t.format]}</span>
          </div>
          <h1>{t.name}</h1>
          <div className="where">
            {t.venue?.name}
            {t.venue?.district ? ` · อ.${t.venue.district}` : ""} · จ.{t.province}
          </div>
          <div className="prize-hero">
            <span className="amt tnum">{formatBaht(t.prize_total)}</span>
            <span className="cur">เงินรางวัลรวม</span>
          </div>
        </div>
      </div>

      <main className="wrap">
        <div className="detail-grid">
          <div>
            <div className="info-grid">
              <div className="info">
                <div className="k">วันแข่งขัน</div>
                <div className="v">{formatThaiDateRange(t.match_start, t.match_end)}</div>
              </div>
              <div className="info">
                <div className="k">ปิดรับสมัคร</div>
                <div className="v">{t.reg_close ? formatThaiDate(t.reg_close) : "-"}</div>
              </div>
              <div className="info">
                <div className="k">จำนวนทีมที่รับ</div>
                <div className="v tnum">{t.team_limit} ทีม</div>
              </div>
              <div className="info">
                <div className="k">ค่าสมัคร / ประกันทีม</div>
                <div className="v tnum">
                  {formatBaht(t.entry_fee)}
                  {t.deposit ? ` + ${formatBaht(t.deposit)}` : ""}
                </div>
              </div>
              <div className="info">
                <div className="k">ชนะเลิศ</div>
                <div className="v gold tnum">{formatBaht(t.prize_champion)}</div>
              </div>
              <div className="info">
                <div className="k">สนามแข่ง</div>
                <div className="v" style={{ fontSize: 15 }}>
                  {t.venue?.name || "-"}
                  {t.venue?.size ? ` (${t.venue.size})` : ""}
                </div>
              </div>
            </div>

            {t.description ? (
              <div className="prose">
                <h2>รายละเอียดการแข่งขัน</h2>
                <p>{t.description}</p>
              </div>
            ) : null}

            {prizeRows.length > 0 ? (
              <div className="prose">
                <h2>เงินรางวัล</h2>
                <div className="prize-table">
                  {prizeRows.map((r) => (
                    <div className="r" key={r.label}>
                      <span>{r.label}</span>
                      <b className="tnum">{formatBaht(r.value)}</b>
                    </div>
                  ))}
                  <div className="r">
                    <span>รวมทั้งสิ้น</span>
                    <b className="tnum">{formatBaht(t.prize_total)}</b>
                  </div>
                </div>
              </div>
            ) : null}

            {embed ? (
              <div className="prose">
                <h2>ถ่ายทอดสด</h2>
                <div className="video-wrap">
                  <iframe
                    src={embed}
                    title={`ถ่ายทอดสด ${t.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}
          </div>

          <aside>
            <div className="sidecard">
              <h3>สนใจสมัคร / สอบถาม</h3>
              <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>
                ติดต่อผู้จัดการแข่งขันโดยตรง
              </p>
              <div className="contact">
                {t.organizer_name ? (
                  <div>
                    ผู้จัด: <b>{t.organizer_name}</b>
                  </div>
                ) : null}
                {t.organizer_phone ? (
                  <div>
                    โทร: <b>{t.organizer_phone}</b>
                  </div>
                ) : null}
                {t.organizer_line ? (
                  <div>
                    LINE: <b>{t.organizer_line}</b>
                  </div>
                ) : null}
              </div>
              {t.organizer_phone ? (
                <a href={`tel:${t.organizer_phone.replace(/-/g, "")}`} className="btn green block">
                  โทรหาผู้จัด
                </a>
              ) : null}
              {t.live_url ? (
                <a
                  href={t.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn ghost block"
                  style={{ marginTop: 8 }}
                >
                  ดูถ่ายทอดสด
                </a>
              ) : null}
            </div>
          </aside>
        </div>

        {/* กระทู้พูดคุย/หาคู่แข่ง เกี่ยวกับรายการนี้ */}
        <section style={{ paddingBottom: 20 }}>
          <div className="section-title">
            <h2>พูดคุย · หาทีม · หาคู่แข่ง เกี่ยวกับรายการนี้</h2>
            <Link href={`/community/new?tournament=${t.id}`} className="btn gold" style={{ marginLeft: "auto" }}>
              + ตั้งกระทู้
            </Link>
          </div>
          {threads.length === 0 ? (
            <p className="muted">ยังไม่มีกระทู้เกี่ยวกับรายการนี้ — เริ่มพูดคุยเป็นคนแรก</p>
          ) : (
            <div className="thread-list">
              {threads.map((th) => (
                <Link key={th.id} href={`/community/${th.id}`} className="thread-row">
                  <div className="thread-main">
                    <div className="thread-cat">
                      <span className="cat-tag">{CATEGORY_LABEL[th.category as ThreadCategory]}</span>
                    </div>
                    <div className="thread-title">{th.title}</div>
                    <div className="thread-meta muted">
                      โดย {th.author_name} · {timeAgo(th.created_at)}
                    </div>
                  </div>
                  <div className="thread-replies">
                    <b className="tnum">{th.reply_count}</b>
                    <span>ตอบ</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <p style={{ paddingBottom: 40 }}>
          <Link href="/" className="btn ghost">
            ← กลับหน้ารวมรายการ
          </Link>
        </p>
      </main>

      <Footer />
    </>
  );
}
