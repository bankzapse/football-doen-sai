import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "หลังบ้าน",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/" className="brand">
          <span className="logo">⚽</span>
          <span>
            เดินสาย<span className="hi">FC</span>
          </span>
        </Link>

        <div className="grp">ภาพรวม</div>
        <Link href="/admin" className="on">แดชบอร์ด</Link>

        <div className="grp">จัดการข้อมูล</div>
        <Link href="/admin">รายการแข่งขัน</Link>
        <Link href="/admin/tournaments/new">+ เพิ่มรายการใหม่</Link>
        <Link href="/venues">สนามแข่ง</Link>
        <Link href="/sponsors">สปอนเซอร์</Link>

        <div className="grp">ระบบ</div>
        <Link href="/live">ลิงก์ถ่ายทอดสด</Link>
        <Link href="/">← กลับหน้าเว็บ</Link>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
