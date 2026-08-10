import Link from "next/link";
import { notFound } from "next/navigation";
import { getVenueById } from "@/lib/data";
import { updateVenue } from "@/app/admin/actions";

export default async function EditVenuePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const v = await getVenueById(id);
  if (!v) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>แก้ไขสนาม</h1>
        <Link href="/admin/venues" className="btn ghost">
          ← กลับ
        </Link>
      </div>

      {error ? <div className="notice">บันทึกไม่สำเร็จ: {error}</div> : null}

      <form action={updateVenue}>
        <input type="hidden" name="id" value={v.id} />
        <div className="formgrid">
          <div className="field">
            <label>ชื่อสนาม *</label>
            <input name="name" required defaultValue={v.name} />
          </div>
          <div className="field">
            <label>จังหวัด *</label>
            <input name="province" required defaultValue={v.province} />
          </div>
          <div className="field">
            <label>อำเภอ</label>
            <input name="district" defaultValue={v.district ?? ""} />
          </div>
          <div className="field">
            <label>ขนาดสนาม</label>
            <input name="size" defaultValue={v.size ?? ""} />
          </div>
          <div className="field">
            <label>ลิงก์รูปภาพ</label>
            <input name="image_url" defaultValue={v.image_url ?? ""} placeholder="https://..." />
          </div>
          <div className="field">
            <label>ลิงก์แผนที่ (Google Maps)</label>
            <input name="map_url" defaultValue={v.map_url ?? ""} placeholder="https://maps.google.com/..." />
          </div>
          <div className="field full" style={{ flexDirection: "row", gap: 10 }}>
            <button type="submit" className="btn green">
              บันทึกการแก้ไข
            </button>
            <Link href="/admin/venues" className="btn ghost">
              ยกเลิก
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
