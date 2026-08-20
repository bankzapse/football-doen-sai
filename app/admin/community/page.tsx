import Link from "next/link";
import { getThreadsAdmin, CATEGORY_LABEL, type ThreadCategory } from "@/lib/community";
import { deleteThread, togglePinThread, approveThread } from "@/app/admin/actions";
import { timeAgo } from "@/lib/format";
import Icon3D from "@/components/Icon3D";

export default async function AdminCommunityPage() {
  const threads = await getThreadsAdmin();
  const pendingCount = threads.filter((t) => t.status === "pending").length;

  return (
    <>
      <div className="admin-head">
        <h1>จัดการกระทู้</h1>
        <Link href="/community" className="btn ghost">ดูหน้าชุมชน</Link>
      </div>

      {pendingCount > 0 ? (
        <div className="notice">
          มี <b>{pendingCount}</b> กระทู้รอตรวจสอบ (ระบบพักไว้เพราะมีลิงก์เยอะผิดปกติ) — กด “อนุมัติ” เพื่อให้แสดงบนเว็บ
        </div>
      ) : null}

      <div className="tablescroll">
        <table className="atable">
          <thead>
            <tr>
              <th>หัวข้อ</th>
              <th>หมวด</th>
              <th>ผู้โพสต์</th>
              <th>สถานะ</th>
              <th>ตอบ</th>
              <th>เมื่อ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {threads.map((t) => {
              const pending = t.status === "pending";
              return (
                <tr key={t.id} style={pending ? { background: "color-mix(in srgb, var(--gold) 8%, transparent)" } : undefined}>
                  <td style={{ maxWidth: 320 }}>
                    <Link href={`/community/${t.id}`}>
                      {t.pinned ? <Icon3D name="pushpin" size={14} /> : null}{t.pinned ? " " : ""}
                      {t.title}
                    </Link>
                    <div className="muted" style={{ fontSize: 12, whiteSpace: "normal" }}>
                      {t.body.slice(0, 90)}
                      {t.body.length > 90 ? "…" : ""}
                    </div>
                  </td>
                  <td>{CATEGORY_LABEL[t.category as ThreadCategory]}</td>
                  <td>{t.author_name}</td>
                  <td>
                    {pending ? (
                      <span className="pill st-soon">รอตรวจ</span>
                    ) : (
                      <span className="pill st-reg">แสดงอยู่</span>
                    )}
                  </td>
                  <td className="tnum">{t.reply_count}</td>
                  <td>{timeAgo(t.created_at)}</td>
                  <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {pending ? (
                      <form action={approveThread}>
                        <input type="hidden" name="id" value={t.id} />
                        <button className="rowbtn" style={{ color: "var(--pitch)" }}>อนุมัติ</button>
                      </form>
                    ) : null}
                    <form action={togglePinThread}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="pinned" value={String(t.pinned)} />
                      <button className="rowbtn">{t.pinned ? "เลิกปักหมุด" : "ปักหมุด"}</button>
                    </form>
                    <form action={deleteThread}>
                      <input type="hidden" name="id" value={t.id} />
                      <button className="rowbtn" style={{ color: "var(--live)" }}>ลบ</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {threads.length === 0 ? (
              <tr><td colSpan={7} className="muted">ยังไม่มีกระทู้</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
