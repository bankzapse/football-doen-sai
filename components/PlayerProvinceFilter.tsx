"use client";

import { useRouter, useSearchParams } from "next/navigation";

/** dropdown กรองจังหวัดในหน้า /players — เปลี่ยนแล้วเปลี่ยน URL (คงค่า pos เดิมไว้) */
export default function PlayerProvinceFilter({ provinces }: { provinces: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("province") ?? "";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString());
    if (e.target.value) next.set("province", e.target.value);
    else next.delete("province");
    router.push(`/players${next.toString() ? `?${next.toString()}` : ""}`);
  }

  return (
    <select className="sel" value={current} onChange={onChange} aria-label="เลือกจังหวัด">
      <option value="">ทุกจังหวัด</option>
      {provinces.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}
