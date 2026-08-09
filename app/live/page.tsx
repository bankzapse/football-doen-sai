import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTournaments } from "@/lib/data";
import { formatThaiDateRange, FORMAT_LABEL } from "@/lib/format";

export const metadata: Metadata = {
  title: "ถ่ายทอดสด",
  description: "รวมลิงก์ถ่ายทอดสดฟุตบอลเดินสายทั่วไทย ดูสดทุกสนามในที่เดียว",
};

export const revalidate = 120;

export default async function LivePage() {
  const tournaments = await getTournaments();
  const live = tournaments.filter((t) => t.status === "live" && t.live_url);
  const withLive = tournaments.filter((t) => t.live_url && t.status !== "live");

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="page-head">
          <h1>ถ่ายทอดสด</h1>
          <p>รวมลิงก์ไลฟ์ทุกสนามที่กำลังแข่งและที่จะถ่ายทอดเร็วๆ นี้</p>
        </div>

        <section>
          <div className="section-title">
            <h2>กำลังถ่ายทอดสด</h2>
            <span>{live.length} รายการ</span>
          </div>
          {live.length === 0 ? (
            <p className="muted">ตอนนี้ยังไม่มีการถ่ายทอดสด — กลับมาเช็กใหม่ในวันแข่งได้เลยครับ</p>
          ) : (
            <div className="tile-grid">
              {live.map((t) => (
                <div className="tile" key={t.id}>
                  <div
                    className="cover"
                    style={{ backgroundImage: `url(${t.image_url})` }}
                  />
                  <div className="body">
                    <h3>{t.name}</h3>
                    <p>
                      {t.venue?.name} · จ.{t.province}
                    </p>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <a href={t.live_url!} target="_blank" rel="noreferrer" className="btn green">
                        ดูสด ▶
                      </a>
                      <Link href={`/tournament/${t.slug}`} className="btn ghost">
                        รายละเอียด
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="section-title">
            <h2>มีถ่ายทอดสด (เร็วๆ นี้)</h2>
            <span>{withLive.length} รายการ</span>
          </div>
          <div className="tablescroll">
            <table className="data">
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>ประเภท</th>
                  <th>จังหวัด</th>
                  <th>วันแข่ง</th>
                  <th>ช่องทาง</th>
                </tr>
              </thead>
              <tbody>
                {withLive.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link href={`/tournament/${t.slug}`}>
                        <b>{t.name}</b>
                      </Link>
                    </td>
                    <td>{FORMAT_LABEL[t.format]}</td>
                    <td>{t.province}</td>
                    <td>{formatThaiDateRange(t.match_start, t.match_end)}</td>
                    <td>
                      <a href={t.live_url!} target="_blank" rel="noreferrer">
                        ลิงก์ไลฟ์
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div style={{ height: 40 }} />
      </main>
      <Footer />
    </>
  );
}
