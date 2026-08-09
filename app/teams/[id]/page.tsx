import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTeam } from "@/lib/teams";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const team = await getTeam(id);
  return {
    title: team ? `ทีม ${team.name}` : "ทีม",
    description: team ? `รายชื่อนักเตะและทีมงานของ ${team.name}` : undefined,
  };
}

export const revalidate = 300;

const POS_LABEL: Record<string, string> = { GK: "ผู้รักษาประตู", DF: "กองหลัง", MF: "กองกลาง", FW: "กองหน้า" };

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(id);
  if (!team) notFound();

  const players = team.players ?? [];
  const staff = [
    { role: "ผู้จัดการทีม", name: team.manager_name },
    { role: "ผู้ฝึกสอน", name: team.coach_name },
    { role: "ผู้ช่วยผู้ฝึกสอน", name: team.coach2_name },
  ].filter((s) => s.name);

  return (
    <>
      <Header />
      <main className="wrap">
        <p style={{ margin: "18px 0 0" }}>
          <Link href="/teams" className="muted">← ทำเนียบทีม</Link>
        </p>

        <div className="team-hero">
          <div className="team-badge lg">{team.logo_url ? <img src={team.logo_url} alt={team.name} /> : team.name.slice(0, 2)}</div>
          <div>
            <h1>{team.name}</h1>
            <p className="muted">
              {team.province ? `จ.${team.province}` : ""} · {players.length} นักเตะ
            </p>
          </div>
        </div>

        {staff.length ? (
          <>
            <div className="section-title"><h2>ทีมงาน</h2></div>
            <div className="staff-grid">
              {staff.map((s) => (
                <div key={s.role} className="staff-card">
                  <div className="muted" style={{ fontSize: 11 }}>{s.role}</div>
                  <b>{s.name}</b>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <div className="section-title" style={{ marginTop: 26 }}><h2>รายชื่อนักเตะ</h2><span>{players.length} คน</span></div>
        {players.length === 0 ? (
          <p className="muted">ยังไม่มีรายชื่อนักเตะ</p>
        ) : (
          <div className="player-grid">
            {players.map((p) => (
              <div key={p.id} className="player-card">
                <div className="player-photo">
                  {p.photo_url ? <img src={p.photo_url} alt={p.name} /> : <span className="num">{p.number ?? "-"}</span>}
                </div>
                <div className="player-info">
                  <b>{p.name}</b>
                  <span className="muted">
                    {p.number != null ? `#${p.number}` : ""}
                    {p.position ? ` · ${POS_LABEL[p.position] ?? p.position}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 40 }} />
      </main>
      <Footer />
    </>
  );
}
