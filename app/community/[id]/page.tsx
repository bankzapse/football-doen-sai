import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getThread, getReplies, CATEGORY_LABEL, type ThreadCategory } from "@/lib/community";
import { getTournamentById } from "@/lib/data";
import { addReplyAction } from "@/app/community/actions";
import { timeAgo } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = await getThread(id);
  return {
    title: t ? t.title : "กระทู้",
    description: t?.body.slice(0, 150),
    robots: { index: false },
  };
}

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const thread = await getThread(id);
  if (!thread) notFound();

  const replies = await getReplies(id);
  const linked = thread.tournament_id ? await getTournamentById(thread.tournament_id) : null;

  const replyError =
    error === "rate"
      ? "ตอบถี่เกินไป กรุณารอสักครู่ (ทุก 30 วินาที)"
      : error === "hourly"
      ? "ตอบครบจำนวนต่อชั่วโมงแล้ว ลองใหม่ภายหลัง"
      : error === "missing"
      ? "กรุณากรอกชื่อและข้อความ"
      : null;

  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 820 }}>
        <p style={{ margin: "18px 0 0" }}>
          <Link href="/community" className="muted">
            ← กลับชุมชน
          </Link>
        </p>

        <article className="thread-detail">
          <div className="thread-cat">
            <span className="cat-tag">{CATEGORY_LABEL[thread.category as ThreadCategory]}</span>
            {thread.province ? <span className="muted"> · {thread.province}</span> : null}
          </div>
          <h1>{thread.title}</h1>
          <div className="thread-meta muted">
            โดย <b style={{ color: "var(--text)" }}>{thread.author_name}</b> · {timeAgo(thread.created_at)}
            {thread.author_contact ? <> · ติดต่อ: <b style={{ color: "var(--pitch)" }}>{thread.author_contact}</b></> : null}
          </div>
          <p className="thread-body">{thread.body}</p>

          {linked ? (
            <Link href={`/tournament/${linked.slug}`} className="linked-card">
              <span className="muted">เกี่ยวกับรายการ</span>
              <b>{linked.name}</b>
            </Link>
          ) : null}
        </article>

        <section id="replies">
          <div className="section-title">
            <h2>ความคิดเห็น</h2>
            <span>{replies.length} รายการ</span>
          </div>

          <div className="reply-list">
            {replies.map((r) => (
              <div key={r.id} className="reply">
                <div className="reply-head">
                  <b>{r.author_name}</b>
                  <span className="muted">{timeAgo(r.created_at)}</span>
                </div>
                <p>{r.body}</p>
                {r.author_contact ? (
                  <div className="muted" style={{ fontSize: 12 }}>ติดต่อ: {r.author_contact}</div>
                ) : null}
              </div>
            ))}
            {replies.length === 0 ? <p className="muted">ยังไม่มีความคิดเห็น — มาตอบเป็นคนแรก</p> : null}
          </div>

          {replyError ? <div className="notice">{replyError}</div> : null}

          <form action={addReplyAction} className="reply-form">
            <input type="hidden" name="thread_id" value={thread.id} />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden />
            <div className="formgrid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="field">
                <label>ชื่อของคุณ *</label>
                <input name="author_name" required placeholder="ชื่อ/ชื่อทีม" />
              </div>
              <div className="field">
                <label>ช่องทางติดต่อ</label>
                <input name="author_contact" placeholder="LINE / เบอร์โทร" />
              </div>
              <div className="field full">
                <label>ความคิดเห็น *</label>
                <textarea name="body" required placeholder="พิมพ์ข้อความ…" />
              </div>
              <div className="field full">
                <button type="submit" className="btn green">
                  ส่งความคิดเห็น
                </button>
              </div>
            </div>
          </form>
        </section>
        <div style={{ height: 40 }} />
      </main>
      <Footer />
    </>
  );
}
