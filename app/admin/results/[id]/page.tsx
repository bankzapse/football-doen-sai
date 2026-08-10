import Link from "next/link";
import { notFound } from "next/navigation";
import { getTournamentById, getMatches, getStandings } from "@/lib/data";
import { setWinners, addMatch, deleteMatch, addStanding, deleteStanding, recalcStandings } from "@/app/admin/actions";

export default async function AdminResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTournamentById(id);
  if (!t) notFound();

  const matches = await getMatches(id);
  const standings = await getStandings(id);

  return (
    <>
      <div className="admin-head">
        <h1>ผลการแข่งขัน</h1>
        <Link href={`/tournament/${t.slug}`} className="btn ghost">ดูหน้าเว็บ</Link>
      </div>
      <div className="callout">รายการ: <b>{t.name}</b> — กรอกแชมป์ ตารางคะแนน และผลรายคู่ แล้วจะแสดงในหน้ารายการอัตโนมัติ</div>

      {/* ผู้ชนะ */}
      <h3 style={{ fontSize: 16, margin: "18px 0 8px" }}>ผู้ชนะ</h3>
      <form action={setWinners} className="formgrid">
        <input type="hidden" name="tournament_id" value={t.id} />
        <div className="field"><label>ชนะเลิศ</label><input name="champion" defaultValue={t.champion ?? ""} /></div>
        <div className="field"><label>รองชนะเลิศ</label><input name="runner_up" defaultValue={t.runner_up ?? ""} /></div>
        <div className="field"><label>อันดับ 3</label><input name="third_place" defaultValue={t.third_place ?? ""} /></div>
        <div className="field"><label>ดาวซัลโว</label><input name="top_scorer" defaultValue={t.top_scorer ?? ""} /></div>
        <div className="field full"><button type="submit" className="btn green">บันทึกผู้ชนะ</button></div>
      </form>

      {/* ตารางคะแนน */}
      <h3 style={{ fontSize: 16, margin: "26px 0 8px" }}>ตารางคะแนน ({standings.length} แถว)</h3>
      <div className="callout" style={{ borderLeftColor: "var(--gold)" }}>
        💡 กรอกผลรายคู่ด้านล่างพร้อม <b>ระบุกลุ่ม</b> ให้ครบ แล้วกดปุ่มนี้เพื่อให้ระบบ
        <b> คำนวณตารางคะแนนอัตโนมัติ</b> (แต้ม/ได้เสีย/อันดับ) — จะแทนที่ตารางคะแนนเดิมทั้งหมด
        <form action={recalcStandings} style={{ marginTop: 10 }}>
          <input type="hidden" name="tournament_id" value={t.id} />
          <button type="submit" className="btn green">⚙️ คำนวณตารางคะแนนจากผลรายคู่</button>
        </form>
      </div>
      {standings.length ? (
        <div className="tablescroll" style={{ marginBottom: 12 }}>
          <table className="atable tnum">
            <thead><tr><th>กลุ่ม</th><th>ทีม</th><th>แข่ง</th><th>ช</th><th>ส</th><th>พ</th><th>ได้-เสีย</th><th>แต้ม</th><th></th></tr></thead>
            <tbody>
              {standings.map((s) => (
                <tr key={s.id}>
                  <td>{s.group_name}</td><td>{s.team_name}</td><td>{s.played}</td><td>{s.win}</td><td>{s.draw}</td><td>{s.loss}</td><td>{s.gf}-{s.ga}</td><td><b>{s.points}</b></td>
                  <td>
                    <form action={deleteStanding}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="tournament_id" value={t.id} />
                      <button className="rowbtn" style={{ color: "var(--live)" }}>ลบ</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <form action={addStanding} className="formgrid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <input type="hidden" name="tournament_id" value={t.id} />
        <div className="field"><label>กลุ่ม</label><input name="group_name" defaultValue="กลุ่ม A" /></div>
        <div className="field"><label>ทีม</label><input name="team_name" placeholder="ชื่อทีม" /></div>
        <div className="field"><label>แข่ง</label><input name="played" inputMode="numeric" /></div>
        <div className="field"><label>ชนะ</label><input name="win" inputMode="numeric" /></div>
        <div className="field"><label>เสมอ</label><input name="draw" inputMode="numeric" /></div>
        <div className="field"><label>แพ้</label><input name="loss" inputMode="numeric" /></div>
        <div className="field"><label>ได้</label><input name="gf" inputMode="numeric" /></div>
        <div className="field"><label>เสีย</label><input name="ga" inputMode="numeric" /></div>
        <div className="field"><label>แต้ม</label><input name="points" inputMode="numeric" /></div>
        <div className="field full"><button type="submit" className="btn ghost">+ เพิ่มแถวตารางคะแนน</button></div>
      </form>

      {/* ผลรายคู่ */}
      <h3 style={{ fontSize: 16, margin: "26px 0 8px" }}>ผลรายคู่ ({matches.length})</h3>
      {matches.length ? (
        <div className="tablescroll" style={{ marginBottom: 12 }}>
          <table className="atable">
            <thead><tr><th>รอบ</th><th>เจ้าบ้าน</th><th>สกอร์</th><th>ทีมเยือน</th><th>หมายเหตุ</th><th></th></tr></thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id}>
                  <td>{m.round}</td><td>{m.team_home}</td>
                  <td className="tnum">{m.score_home ?? "-"} : {m.score_away ?? "-"}</td>
                  <td>{m.team_away}</td><td className="muted">{m.note ?? ""}</td>
                  <td>
                    <form action={deleteMatch}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="tournament_id" value={t.id} />
                      <button className="rowbtn" style={{ color: "var(--live)" }}>ลบ</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <form action={addMatch} className="formgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <input type="hidden" name="tournament_id" value={t.id} />
        <div className="field"><label>รอบ</label><input name="round" defaultValue="รอบแบ่งกลุ่ม" /></div>
        <div className="field"><label>กลุ่ม (สำหรับคำนวณคะแนน)</label><input name="group_name" placeholder="เช่น กลุ่ม A (เว้นว่างถ้าเป็นรอบน็อคเอาท์)" /></div>
        <div className="field"><label>ลำดับแสดง</label><input name="sort" inputMode="numeric" defaultValue="0" /></div>
        <div className="field"><label>หมายเหตุ</label><input name="note" placeholder="เช่น จุดโทษ 4-3" /></div>
        <div className="field"><label>ทีมเจ้าบ้าน</label><input name="team_home" /></div>
        <div className="field"><label>สกอร์ (เหย้า-เยือน)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input name="score_home" inputMode="numeric" style={{ width: "50%" }} />
            <input name="score_away" inputMode="numeric" style={{ width: "50%" }} />
          </div>
        </div>
        <div className="field"><label>ทีมเยือน</label><input name="team_away" /></div>
        <div className="field full"><button type="submit" className="btn ghost">+ เพิ่มผลรายคู่</button></div>
      </form>
      <div style={{ height: 30 }} />
    </>
  );
}
