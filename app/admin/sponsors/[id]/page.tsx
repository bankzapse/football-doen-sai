import Link from "next/link";
import { notFound } from "next/navigation";
import { getSponsorById } from "@/lib/data";
import { updateSponsor } from "@/app/admin/actions";

export default async function EditSponsorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const s = await getSponsorById(id);
  if (!s) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>แก้ไขสปอนเซอร์</h1>
        <Link href="/admin/sponsors" className="btn ghost">
          ← กลับ
        </Link>
      </div>

      {error ? <div className="notice">บันทึกไม่สำเร็จ: {error}</div> : null}

      <form action={updateSponsor}>
        <input type="hidden" name="id" value={s.id} />
        <div className="formgrid">
          <div className="field">
            <label>ชื่อสปอนเซอร์ *</label>
            <input name="name" required defaultValue={s.name} />
          </div>
          <div className="field">
            <label>ระดับ</label>
            <select name="tier" defaultValue={s.tier}>
              <option value="platinum">พาร์ทเนอร์หลัก (platinum)</option>
              <option value="gold">สปอนเซอร์ทอง (gold)</option>
              <option value="standard">สปอนเซอร์ (standard)</option>
            </select>
          </div>
          <div className="field">
            <label>ลิงก์โลโก้</label>
            <input name="logo_url" defaultValue={s.logo_url ?? ""} placeholder="https://..." />
          </div>
          <div className="field">
            <label>เว็บไซต์</label>
            <input name="website" defaultValue={s.website ?? ""} placeholder="https://..." />
          </div>
          <div className="field">
            <label>การแสดงผล</label>
            <select name="active" defaultValue={String(s.active)}>
              <option value="true">แสดงบนเว็บ</option>
              <option value="false">ซ่อนไว้ก่อน</option>
            </select>
          </div>
          <div className="field full" style={{ flexDirection: "row", gap: 10 }}>
            <button type="submit" className="btn green">
              บันทึกการแก้ไข
            </button>
            <Link href="/admin/sponsors" className="btn ghost">
              ยกเลิก
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
