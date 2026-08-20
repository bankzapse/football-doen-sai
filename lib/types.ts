export type TournamentStatus =
  | "draft" // ร่าง (ยังไม่เผยแพร่)
  | "registering" // กำลังรับสมัคร
  | "closing" // ใกล้ปิดรับ
  | "live" // แข่งวันนี้ / ถ่ายทอดสด
  | "finished"; // จบแล้ว

export type Format = "7" | "9" | "11";

export interface Venue {
  id: string;
  name: string;
  province: string;
  district: string | null;
  size: string | null; // เช่น "70x50 เมตร"
  image_url: string | null;
  map_url: string | null;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  tier: "platinum" | "gold" | "standard";
  placement?: "side" | "bottom" | "both";
  size?: "sm" | "md" | "lg";
  plan_months?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  price?: number | null;
  website: string | null;
  active: boolean;
}

export interface Tournament {
  id: string;
  slug: string;
  name: string;
  format: Format;
  province: string;
  team_limit: number;
  entry_fee: number; // ค่าสมัคร
  deposit: number; // ประกันทีม / มัดจำ
  prize_total: number;
  prize_champion: number;
  prize_runnerup: number | null;
  prize_third: number | null;
  reg_open: string | null; // ISO date
  reg_close: string | null;
  match_start: string; // ISO date
  match_end: string | null;
  status: TournamentStatus;
  poster_url: string | null;
  image_url: string | null; // ภาพประกอบ/แบ็คกราวด์ (SEO)
  live_url: string | null; // ลิงก์ถ่ายทอดสด
  description: string | null;
  organizer_name: string | null;
  organizer_phone: string | null;
  organizer_line: string | null;
  venue_id: string | null;
  venue?: Venue | null;
  // ผลการแข่งขัน (สำหรับรายการที่จบแล้ว)
  champion?: string | null;
  runner_up?: string | null;
  third_place?: string | null;
  top_scorer?: string | null;
}

export interface Match {
  id: string;
  tournament_id: string;
  round: string;
  group_name: string | null;
  team_home: string;
  team_away: string;
  score_home: number | null;
  score_away: number | null;
  note: string | null;
  sort: number;
}

export interface Standing {
  id: string;
  tournament_id: string;
  group_name: string;
  team_name: string;
  played: number;
  win: number;
  draw: number;
  loss: number;
  gf: number;
  ga: number;
  points: number;
  sort: number;
}

export interface Team {
  id: string;
  name: string;
  province: string | null;
  logo_url: string | null;
  manager_name: string | null;
  coach_name: string | null;
  coach2_name: string | null;
  players?: Player[];
}

export interface Player {
  id: string;
  team_id: string;
  name: string;
  number: number | null;
  position: string | null;
  photo_url: string | null;
  sort: number;
}
