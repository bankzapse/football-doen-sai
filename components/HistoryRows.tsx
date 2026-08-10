"use client";

import { useState } from "react";
import type { PlayerHistory } from "@/lib/players";

type Row = { key: number; period: string; club: string; note: string };

/** แก้ไขประวัติการเล่น (สโมสรรายปี) — แถวเพิ่ม/ลบได้ */
export default function HistoryRows({ initial = [] }: { initial?: PlayerHistory[] }) {
  const seed: Row[] =
    initial.length > 0
      ? initial.map((h, i) => ({ key: i, period: h.period ?? "", club: h.club ?? "", note: h.note ?? "" }))
      : [{ key: 0, period: "", club: "", note: "" }];
  const [rows, setRows] = useState<Row[]>(seed);
  const [nextKey, setNextKey] = useState(seed.length);

  const add = () => {
    setRows((r) => [...r, { key: nextKey, period: "", club: "", note: "" }]);
    setNextKey((k) => k + 1);
  };
  const remove = (key: number) => setRows((r) => r.filter((x) => x.key !== key));
  const upd = (key: number, field: keyof Row, val: string) =>
    setRows((r) => r.map((x) => (x.key === key ? { ...x, [field]: val } : x)));

  return (
    <div className="history-rows">
      {rows.map((row) => (
        <div className="history-row" key={row.key}>
          <input
            name="history_period"
            className="hr-period"
            placeholder="2024–2025"
            value={row.period}
            onChange={(e) => upd(row.key, "period", e.target.value)}
          />
          <input
            name="history_club"
            className="hr-club"
            placeholder="ชื่อสโมสร"
            value={row.club}
            onChange={(e) => upd(row.key, "club", e.target.value)}
          />
          <input
            name="history_note"
            className="hr-note"
            placeholder="เช่น ไทยลีก 3 / เลื่อนชั้น"
            value={row.note}
            onChange={(e) => upd(row.key, "note", e.target.value)}
          />
          <button type="button" className="rowbtn" onClick={() => remove(row.key)} aria-label="ลบ">✕</button>
        </div>
      ))}
      <button type="button" className="btn ghost" onClick={add} style={{ marginTop: 8 }}>
        + เพิ่มประวัติสโมสร
      </button>
    </div>
  );
}
