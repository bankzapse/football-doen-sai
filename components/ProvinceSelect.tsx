import { THAI_PROVINCES } from "@/lib/provinces";

/**
 * dropdown เลือกจังหวัด (77 จังหวัด) สำหรับฟอร์มที่ใช้ server action
 * เป็น <select name="province"> ธรรมดา — ส่งค่าได้เลยไม่ต้องใช้ JS
 */
export default function ProvinceSelect({
  defaultValue = "",
  required = false,
  name = "province",
}: {
  defaultValue?: string | null;
  required?: boolean;
  name?: string;
}) {
  const current = defaultValue ?? "";
  // เผื่อค่าที่บันทึกไว้เดิมไม่อยู่ในลิสต์ จะได้ไม่หาย
  const extra = current && !THAI_PROVINCES.includes(current) ? [current] : [];

  return (
    <select name={name} required={required} defaultValue={current}>
      <option value="">— เลือกจังหวัด —</option>
      {extra.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
      {THAI_PROVINCES.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}
