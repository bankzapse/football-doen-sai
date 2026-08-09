import Link from "next/link";
import { getTeams } from "@/lib/teams";
import { deleteTeam } from "@/app/admin/actions";

export default async function AdminTeamsPage() {
  const teams = await getTeams();

  return (
    <>
      <div className="admin-head">
        <h1>ทีม / นักเตะ</h1>
        <Link href="/admin/teams/new" className="btn gold">
          + เพิ่มทีมใหม่
        </Link>
      </div>

      <div className="tablescroll">
        <table className="atable">
          <thead>
            <tr>
              <th>ชื่อทีม</th>
              <th>จังหวัด</th>
              <th>โค้ช</th>
              <th>นักเตะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.id}>
                <td><Link href={`/teams/${t.id}`}>{t.name}</Link></td>
                <td>{t.province ?? "-"}</td>
                <td>{t.coach_name ?? "-"}</td>
                <td className="tnum">{t.players?.length ?? 0}</td>
                <td>
                  <form action={deleteTeam}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="rowbtn" style={{ color: "var(--live)" }}>ลบ</button>
                  </form>
                </td>
              </tr>
            ))}
            {teams.length === 0 ? (
              <tr><td colSpan={5} className="muted">ยังไม่มีทีม</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
