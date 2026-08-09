import type { TournamentStatus } from "./types";

const TH_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

const TH_MONTHS_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

/** แปลงวันที่ ISO เป็นรูปแบบไทย เช่น "29 ส.ค. 69" (พ.ศ. 2 หลัก) */
export function formatThaiDate(iso: string | null, full = false): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const day = d.getDate();
  const month = full ? TH_MONTHS_FULL[d.getMonth()] : TH_MONTHS[d.getMonth()];
  const beYear = d.getFullYear() + 543;
  return full ? `${day} ${month} ${beYear}` : `${day} ${month} ${beYear % 100}`;
}

/** ช่วงวันแข่ง เช่น "29–30 ส.ค. 69" หรือวันเดียว "6 ก.ย. 69" */
export function formatThaiDateRange(start: string, end: string | null): string {
  if (!end || end === start) return formatThaiDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    const beYear = e.getFullYear() + 543;
    return `${s.getDate()}–${e.getDate()} ${TH_MONTHS[e.getMonth()]} ${beYear % 100}`;
  }
  return `${formatThaiDate(start)} – ${formatThaiDate(end)}`;
}

/** เงินบาทแบบมีคอมมา เช่น 130000 -> "฿130,000" */
export function formatBaht(n: number | null | undefined, symbol = true): string {
  if (n == null) return "-";
  const s = n.toLocaleString("th-TH");
  return symbol ? `฿${s}` : s;
}

interface StatusMeta {
  label: string;
  className: string; // สำหรับ badge
}

export const STATUS_META: Record<TournamentStatus, StatusMeta> = {
  draft: { label: "ร่าง", className: "st-draft" },
  registering: { label: "กำลังรับสมัคร", className: "st-reg" },
  closing: { label: "ใกล้ปิดรับ", className: "st-soon" },
  live: { label: "แข่งวันนี้", className: "st-live" },
  finished: { label: "จบแล้ว", className: "st-done" },
};

export const FORMAT_LABEL: Record<string, string> = {
  "7": "7 คน",
  "9": "9 คน",
  "11": "11 คน",
};
