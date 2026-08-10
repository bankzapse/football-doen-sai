import Link from "next/link";
import { notFound } from "next/navigation";
import ProvinceSelect from "@/components/ProvinceSelect";
import { getPlayerById, POSITIONS } from "@/lib/players";
import { updatePlayer } from "@/app/admin/actions";

export default async function EditPlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const p = await getPlayerById(id);
  if (!p) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>แก้ไขนักเตะ</h1>
        <Link href="/admin/players" className="btn ghost">
          ← กลับ
        </Link>
      </div>

      {error ? <div className="notice">บันทึกไม่สำเร็จ: {error}</div> : null}

      <form action={updatePlayer}>
        <input type="hidden" name="id" value={p.id} />
        <div className="formgrid">
          <div className="field">
            <label>ชื่อ-นามสกุล *</label>
            <input name="name" required defaultValue={p.name} />
          </div>
          <div className="field">
            <label>ชื่อเล่น</label>
            <input name="nickname" defaultValue={p.nickname ?? ""} />
          </div>
          <div className="field">
            <label>ตำแหน่ง</label>
            <select name="position" defaultValue={p.position}>
              {POSITIONS.map((op) => (
                <option key={op.key} value={op.key}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>จังหวัด</label>
            <ProvinceSelect defaultValue={p.province} />
          </div>
          <div className="field">
            <label>อายุ</label>
            <input name="age" type="number" min="10" max="70" defaultValue={p.age ?? ""} />
          </div>
          <div className="field">
            <label>ส่วนสูง (ซม.)</label>
            <input name="height" type="number" min="120" max="220" defaultValue={p.height ?? ""} />
          </div>
          <div className="field">
            <label>เท้าถนัด</label>
            <select name="foot" defaultValue={p.foot ?? ""}>
              <option value="">— ไม่ระบุ —</option>
              <option value="right">เท้าขวา</option>
              <option value="left">เท้าซ้าย</option>
              <option value="both">สองเท้า</option>
            </select>
          </div>
          <div className="field">
            <label>ค่าตัว / เรทต่อแมตช์</label>
            <input name="rate" defaultValue={p.rate ?? ""} />
          </div>
          <div className="field">
            <label>ช่องทางติดต่อ</label>
            <input name="contact" defaultValue={p.contact ?? ""} />
          </div>
          <div className="field">
            <label>อัปโหลดรูปใหม่จากเครื่อง</label>
            <input name="photo_file" type="file" accept="image/*" />
            <span className="hint">ถ้าไม่เลือกจะใช้รูปเดิม</span>
          </div>
          <div className="field">
            <label>หรือใส่ลิงก์รูป</label>
            <input name="photo_url" defaultValue={p.photo_url ?? ""} placeholder="https://..." />
            {p.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.photo_url}
                alt={p.name}
                style={{ marginTop: 8, maxHeight: 90, width: "auto", borderRadius: 8 }}
              />
            ) : null}
          </div>
          <div className="field full">
            <label>สถิติ / โปรไฟล์</label>
            <textarea name="bio" defaultValue={p.bio ?? ""} style={{ minHeight: 80 }} />
          </div>
          <div className="field">
            <label>สถานะ</label>
            <select name="status" defaultValue={p.status}>
              <option value="approved">แสดงบนเว็บ</option>
              <option value="pending">รออนุมัติ</option>
            </select>
          </div>
          <div className="field full" style={{ flexDirection: "row", gap: 10 }}>
            <button type="submit" className="btn green">
              บันทึกการแก้ไข
            </button>
            <Link href="/admin/players" className="btn ghost">
              ยกเลิก
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
