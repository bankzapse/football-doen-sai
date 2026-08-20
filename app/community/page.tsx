import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getThreads, CATEGORIES, CATEGORY_LABEL, type ThreadCategory } from "@/lib/community";
import { timeAgo } from "@/lib/format";
import Icon3D from "@/components/Icon3D";

const CAT_ICON: Record<string, string> = {
  find_opponent: "handshake",
  join_tournament: "trophy",
  find_player: "shoe",
  buy_sell: "shirt",
  general: "chat",
};

export const metadata: Metadata = {
  title: "ชุมชนเดินสาย — หาคู่แข่ง หาทีม หานักเตะ",
  description:
    "บอร์ดชุมชนฟุตบอลเดินสาย หาคู่แข่ง หาทีมลงแข่ง หานักเตะเสริม ซื้อขายอุปกรณ์ และพูดคุยทั่วไป",
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; pending?: string }>;
}) {
  const { cat, pending } = await searchParams;
  const active = CATEGORIES.find((c) => c.key === cat)?.key;
  const threads = await getThreads(active);

  return (
    <>
      <Header />
      <main className="wrap">
        {pending ? (
          <div className="notice ok" style={{ marginTop: 16 }}>
            ส่งกระทู้แล้ว! เนื่องจากมีลิงก์หลายรายการ ระบบพักไว้ให้แอดมินตรวจสอบก่อนแสดง ขอบคุณครับ 🙏
          </div>
        ) : null}
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
          <div>
            <h1>ชุมชนเดินสาย</h1>
            <p>หาคู่แข่ง · หาทีมลงแข่ง · หานักเตะเสริม · ซื้อขายอุปกรณ์ · พูดคุยทั่วไป</p>
          </div>
          <Link href="/community/new" className="btn gold">
            + ตั้งกระทู้ใหม่
          </Link>
        </div>

        <div className="filters" style={{ marginTop: 8 }}>
          <Link href="/community" className={`chip ${!active ? "on" : ""}`}>
            ทั้งหมด
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/community?cat=${c.key}`}
              className={`chip ${active === c.key ? "on" : ""}`}
            >
              <Icon3D name={CAT_ICON[c.key] ?? "chat"} size={16} /> {c.label}
            </Link>
          ))}
        </div>

        {threads.length === 0 ? (
          <div className="panel" style={{ textAlign: "center", padding: 40 }}>
            <p className="muted">
              ยังไม่มีกระทู้ในหมวดนี้ — เป็นคนแรกที่ตั้งกระทู้เลย!
            </p>
            <Link href="/community/new" className="btn green">
              + ตั้งกระทู้ใหม่
            </Link>
          </div>
        ) : (
          <div className="thread-list">
            {threads.map((t) => (
              <Link key={t.id} href={`/community/${t.id}`} className="thread-row">
                <div className="thread-main">
                  <div className="thread-cat">
                    {t.pinned ? <span className="pin">ปักหมุด</span> : null}
                    <span className="cat-tag">{CATEGORY_LABEL[t.category as ThreadCategory]}</span>
                    {t.province ? <span className="muted"> · {t.province}</span> : null}
                  </div>
                  <div className="thread-title">{t.title}</div>
                  <div className="thread-meta muted">
                    โดย {t.author_name} · {timeAgo(t.created_at)}
                  </div>
                </div>
                <div className="thread-replies">
                  <b className="tnum">{t.reply_count}</b>
                  <span>ตอบ</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ height: 40 }} />
      </main>
      <Footer />
    </>
  );
}
