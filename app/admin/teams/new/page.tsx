import Link from "next/link";
import TeamForm from "@/components/TeamForm";

export default async function NewTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <div className="admin-head">
        <h1>เพิ่มทีมใหม่</h1>
        <Link href="/admin/teams" className="btn ghost">← กลับ</Link>
      </div>

      {error === "nodb" ? (
        <div className="notice">ยังไม่ได้เชื่อม Supabase จึงบันทึกไม่ได้</div>
      ) : error ? (
        <div className="notice">บันทึกไม่สำเร็จ: {error}</div>
      ) : null}

      <div className="callout">
        เพิ่มข้อมูลทีมงาน (ผู้จัดการ/โค้ช) และรายชื่อนักเตะ — กรอกจากใบสมัครทีมที่ส่งเข้ามา แล้วกดบันทึก
      </div>

      <TeamForm />
    </>
  );
}
