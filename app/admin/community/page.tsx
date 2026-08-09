import Link from "next/link";
import { getThreads, CATEGORY_LABEL, type ThreadCategory } from "@/lib/community";
import { deleteThread, togglePinThread } from "@/app/admin/actions";
import { timeAgo } from "@/lib/format";

export default async function AdminCommunityPage() {
  const threads = await getThreads();

  return (
    <>
      <div className="admin-head">
        <h1>จัดการกระทู้</h1>
        <Link href="/community" className="btn ghost">
          ดูหน้าชุมชน
        </Link>
      </div>

      <div className="tablescroll">
        <table className="atable">
          <thead>
            <tr>
              <th>หัวข้อ</th>
              <th>หมวด</th>
              <th>ผู้โพสต์</th>
              <th>ตอบ</th>
              <th>เมื่อ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {threads.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link href={`/community/${t.id}`}>
                    {t.pinned ? "📌 " : ""}
                    {t.title}
                  </Link>
                </td>
                <td>{CATEGORY_LABEL[t.category as ThreadCategory]}</td>
                <td>{t.author_name}</td>
                <td className="tnum">{t.reply_count}</td>
                <td>{timeAgo(t.created_at)}</td>
                <td style={{ display: "flex", gap: 6 }}>
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
            ))}
            {threads.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">ยังไม่มีกระทู้</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
