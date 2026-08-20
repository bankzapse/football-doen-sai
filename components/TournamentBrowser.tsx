"use client";

import { useMemo, useState } from "react";
import type { Tournament } from "@/lib/types";
import TournamentCard from "./TournamentCard";
import Icon3D from "@/components/Icon3D";

type StatusFilter = "all" | "registering" | "closing" | "live";

const STATUS_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "registering", label: "กำลังรับสมัคร" },
  { key: "closing", label: "ใกล้ปิดรับ" },
  { key: "live", label: "แข่งวันนี้" },
];

export default function TournamentBrowser({
  tournaments,
  viewsBySlug,
  gridCols = 2,
  gridRows = 0,
}: {
  tournaments: Tournament[];
  viewsBySlug?: Record<string, number>;
  gridCols?: number;
  gridRows?: number;
}) {
  const [q, setQ] = useState("");
  const [province, setProvince] = useState("");
  const [format, setFormat] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [showAll, setShowAll] = useState(false);

  const provinces = useMemo(
    () => Array.from(new Set(tournaments.map((t) => t.province))).sort(),
    [tournaments]
  );

  const filtered = tournaments.filter((t) => {
    const haystack = `${t.name} ${t.province} ${t.venue?.name ?? ""} ${t.venue?.district ?? ""}`.toLowerCase();
    const okQ = !q || haystack.includes(q.toLowerCase().trim());
    const okP = !province || t.province === province;
    const okF = !format || t.format === format;
    const okS = status === "all" || t.status === status;
    return okQ && okP && okF && okS;
  });

  return (
    <>
      <div className="filters">
        <div className="search">
          <span aria-hidden><Icon3D name="search" size={18} /></span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหารายการ / จังหวัด / สนาม เช่น พนัสนิคม, เงินแสน"
          />
        </div>
        <select className="sel" value={province} onChange={(e) => setProvince(e.target.value)}>
          <option value="">ทุกจังหวัด</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select className="sel" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="">ทุกประเภท</option>
          <option value="7">7 คน</option>
          <option value="9">9 คน</option>
          <option value="11">11 คน</option>
        </select>
        {STATUS_CHIPS.map((c) => (
          <button
            key={c.key}
            className={`chip ${status === c.key ? "on" : ""}`}
            onClick={() => setStatus(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="section-title">
        <h2>รายการแข่งขัน</h2>
        <span>แสดง {filtered.length} รายการ</span>
      </div>

      {(() => {
        const limit = gridRows > 0 ? gridCols * gridRows : Infinity;
        const visible = showAll ? filtered : filtered.slice(0, limit);
        const hidden = filtered.length - visible.length;
        if (filtered.length === 0) {
          return <p className="muted">ไม่พบรายการที่ตรงกับเงื่อนไข ลองเปลี่ยนตัวกรองดูครับ</p>;
        }
        return (
          <>
            <div className="cards" style={{ "--cols": gridCols } as React.CSSProperties}>
              {visible.map((t) => (
                <TournamentCard key={t.id} t={t} views={viewsBySlug?.[t.slug] ?? 0} />
              ))}
            </div>
            {hidden > 0 ? (
              <button className="btn ghost block" style={{ marginTop: 16 }} onClick={() => setShowAll(true)}>
                ดูทั้งหมด ({hidden} รายการที่เหลือ)
              </button>
            ) : null}
            {showAll && gridRows > 0 && filtered.length > gridCols * gridRows ? (
              <button className="btn ghost block" style={{ marginTop: 16 }} onClick={() => setShowAll(false)}>
                ย่อกลับ
              </button>
            ) : null}
          </>
        );
      })()}
    </>
  );
}
