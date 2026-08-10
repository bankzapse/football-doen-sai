import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPlayerById, getPlayerHistory, POSITION_LABEL, FOOT_LABEL } from "@/lib/players";
import { formatThaiDate } from "@/lib/format";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getPlayerById(id);
  if (!p || p.status !== "approved") return { title: "นักเตะ" };
  return {
    title: `${p.name}${p.nickname ? ` (${p.nickname})` : ""} — โปรไฟล์นักเตะ`,
    description: `${POSITION_LABEL[p.position]}${p.province ? ` · ${p.province}` : ""} · ${p.bio ?? "นักเตะเดินสาย"}`,
    openGraph: { images: p.photo_url ? [p.photo_url] : undefined },
  };
}

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPlayerById(id);
  if (!p || p.status !== "approved") notFound();
  const history = await getPlayerHistory(id);

  // อายุ: คำนวณจากวันเกิดถ้ามี ไม่งั้นใช้ค่าที่กรอก
  let age = p.age;
  if (p.birthdate) {
    const d = new Date(p.birthdate);
    if (!isNaN(d.getTime())) age = Math.floor((Date.now() - d.getTime()) / 31557600000);
  }

  const facts = [
    p.birthdate ? { k: "วันเกิด", v: formatThaiDate(p.birthdate, true) } : null,
    age != null ? { k: "อายุ", v: `${age} ปี` } : null,
    p.height != null ? { k: "ส่วนสูง", v: `${p.height} ซม.` } : null,
    p.weight != null ? { k: "น้ำหนัก", v: `${p.weight} กก.` } : null,
    p.foot ? { k: "เท้าถนัด", v: FOOT_LABEL[p.foot] } : null,
    p.province ? { k: "จังหวัด", v: p.province } : null,
    p.rate ? { k: "ค่าตัว / เรท", v: p.rate } : null,
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 920 }}>
        <p style={{ margin: "18px 0 0" }}>
          <Link href="/players" className="muted">← หานักเตะเดินสาย</Link>
        </p>

        <div className="player-profile">
          <div className="pp-photo">
            {p.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photo_url} alt={p.name} />
            ) : (
              <span>{p.name.slice(0, 1)}</span>
            )}
          </div>
          <div className="pp-head">
            <div className="pp-pos-tag">{POSITION_LABEL[p.position]}</div>
            <h1>
              {p.name}
              {p.nickname ? <span className="pp-nick"> ({p.nickname})</span> : null}
            </h1>
            <div className="muted">
              {p.province ? `จ.${p.province}` : ""}
              {age != null ? ` · ${age} ปี` : ""}
              {p.foot ? ` · ${FOOT_LABEL[p.foot]}` : ""}
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <div>
            <div className="section-title"><h2>ข้อมูลส่วนตัว</h2></div>
            <div className="info-grid">
              {facts.map((f) => (
                <div className="info" key={f.k}>
                  <div className="k">{f.k}</div>
                  <div className="v" style={{ fontSize: 16 }}>{f.v}</div>
                </div>
              ))}
            </div>

            {p.bio ? (
              <div className="prose">
                <h2>โปรไฟล์ / สถิติ</h2>
                <p>{p.bio}</p>
              </div>
            ) : null}

            {history.length > 0 ? (
              <div className="prose">
                <h2>ประวัติการเล่น</h2>
                <div className="timeline">
                  {history.map((h) => (
                    <div className="tl-item" key={h.id}>
                      <div className="tl-dot" />
                      <div className="tl-body">
                        {h.period ? <span className="tl-period">{h.period}</span> : null}
                        <b>{h.club}</b>
                        {h.note ? <span className="tl-note muted"> · {h.note}</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside>
            <div className="sidecard">
              <h3>ติดต่อนักเตะ</h3>
              <div className="contact">
                {p.contact ? <div>{p.contact}</div> : null}
                {p.facebook ? (
                  <div>Facebook: <b>{p.facebook}</b></div>
                ) : null}
                {!p.contact && !p.facebook ? <div className="muted">ไม่มีข้อมูลติดต่อ</div> : null}
              </div>
              <Link href="/players" className="btn ghost block" style={{ marginTop: 8 }}>
                ดูนักเตะคนอื่น
              </Link>
            </div>
          </aside>
        </div>
        <div style={{ height: 40 }} />
      </main>
      <Footer />
    </>
  );
}
