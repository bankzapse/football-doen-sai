import Link from "next/link";
import type { Tournament } from "@/lib/types";
import {
  formatBaht,
  formatThaiDateRange,
  formatThaiDate,
  STATUS_META,
  FORMAT_LABEL,
} from "@/lib/format";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=60";

export default function TournamentCard({ t, views = 0 }: { t: Tournament; views?: number }) {
  const status = STATUS_META[t.status];
  const cover = t.image_url || FALLBACK_IMG;
  const finished = t.status === "finished";

  return (
    <article className="card">
      <Link
        href={`/tournament/${t.slug}`}
        className="card-cover"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div className="badges">
          <span className={`tag ${status.className}`}>{status.label}</span>
          <span className="tag type">{FORMAT_LABEL[t.format]}</span>
        </div>
        {views > 0 ? (
          <span className="views-badge tnum">👁 {views.toLocaleString("th-TH")}</span>
        ) : null}
        <h3>{t.name}</h3>
      </Link>

      <div className="prize">
        <span className="amt tnum">{formatBaht(t.prize_total, false)}</span>
        <span className="cur">บาท (รวม)</span>
        <div className="champ">
          {finished ? "แชมป์" : "ชนะเลิศ"}
          <b className="tnum">{formatBaht(t.prize_champion)}</b>
        </div>
      </div>

      <div className="meta">
        <div className="row">
          <b>{formatThaiDateRange(t.match_start, t.match_end)}</b>
          {t.reg_close && !finished ? (
            <span className="muted"> · ปิดรับ {formatThaiDate(t.reg_close)}</span>
          ) : null}
        </div>
        <div className="row">
          <b>{t.venue?.name ?? "-"}</b>
          <span className="muted">
            {t.venue?.district ? ` · ${t.venue.district}` : ""} จ.{t.province}
          </span>
        </div>
        <div className="row">
          รับ <b>{t.team_limit} ทีม</b>
          <span className="muted"> · ค่าสมัคร {formatBaht(t.entry_fee)}</span>
        </div>
      </div>

      <div className="foot">
        <Link href={`/tournament/${t.slug}`} className="btn green">
          {finished ? "ดูผลการแข่งขัน" : "รายละเอียด / สมัคร"}
        </Link>
        {t.live_url ? (
          <a href={t.live_url} target="_blank" rel="noreferrer" className="btn ghost">
            ดูสด
          </a>
        ) : null}
      </div>
    </article>
  );
}
