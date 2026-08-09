import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "หลังบ้าน",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/" className="brand">
          <Logo size={32} />
          <span>
            FDS <span className="hi">Cup</span>
          </span>
        </Link>

        <div className="grp">ภาพรวม</div>
        <Link href="/admin" className="on">แดชบอร์ด</Link>

        <div className="grp">จัดการข้อมูล</div>
        <Link href="/admin">รายการแข่งขัน</Link>
        <Link href="/admin/tournaments/new">+ เพิ่มรายการใหม่</Link>
        <Link href="/admin/teams">ทีม / นักเตะ</Link>
        <Link href="/venues">สนามแข่ง</Link>
        <Link href="/sponsors">สปอนเซอร์</Link>

        <div className="grp">ชุมชน</div>
        <Link href="/admin/community">จัดการกระทู้</Link>

        <div className="grp">ระบบ</div>
        <Link href="/live">ลิงก์ถ่ายทอดสด</Link>
        <Link href="/">← กลับหน้าเว็บ</Link>

        <div className="admin-user">
          {user?.email ? <span className="admin-email">{user.email}</span> : null}
          <form action="/auth/signout" method="post">
            <button type="submit" className="rowbtn" style={{ width: "100%" }}>
              ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
