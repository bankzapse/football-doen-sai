import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSponsors } from "@/lib/data";

export const metadata: Metadata = {
  title: "สปอนเซอร์",
  description: "พาร์ทเนอร์และสปอนเซอร์ของ FDS Cup — ลงโฆษณาเข้าถึงคนวงการฟุตบอลเดินสายทั่วไทย มีแพ็กเกจรายเดือน/3เดือน/6เดือน/รายปี",
};

const TIER_LABEL: Record<string, string> = {
  platinum: "พาร์ทเนอร์หลัก",
  gold: "สปอนเซอร์ทอง",
  standard: "สปอนเซอร์",
};

const PACKAGES = [
  { name: "รายเดือน", months: "1 เดือน", note: "ทดลองลงสั้นๆ", tag: "" },
  { name: "3 เดือน", months: "3 เดือน", note: "ครอบคลุม 1 ทัวร์นาเมนต์", tag: "ยอดนิยม" },
  { name: "6 เดือน", months: "6 เดือน", note: "ต่อเนื่องครึ่งปี", tag: "" },
  { name: "รายปี", months: "12 เดือน", note: "คุ้มที่สุด แสดงตลอดปี", tag: "คุ้มสุด" },
];

const SPONSOR_PHONE = "089-261-6445";
const SPONSOR_PHONE_TEL = "0892616445";
const LINE_OA = "https://line.me/R/ti/p/@016emkmk"; // LINE OA FDS Cup (Basic ID @016emkmk)

export const revalidate = 300;

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  const byTier = (tier: string) => sponsors.filter((s) => s.tier === tier);

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="page-head">
          <h1>สปอนเซอร์ & พาร์ทเนอร์</h1>
          <p>
            ขอบคุณผู้สนับสนุนที่ทำให้วงการฟุตบอลเดินสายเติบโต — สนใจลงโฆษณา เข้าถึงแฟนบอลและทีมทั่วประเทศ
            ติดต่อ <b>คุณแบงค์ {SPONSOR_PHONE}</b> หรือทัก LINE OA
          </p>
        </div>

        {sponsors.length > 0 &&
          (["platinum", "gold", "standard"] as const).map((tier) =>
            byTier(tier).length ? (
              <section key={tier}>
                <div className="section-title">
                  <h2>{TIER_LABEL[tier]}</h2>
                </div>
                <div className="sponsor-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", marginBottom: 30 }}>
                  {byTier(tier).map((s) => (
                    <div key={s.id} className={`sponsor ${s.tier} size-${s.size ?? "sm"}`} style={{ aspectRatio: "16/9" }}>
                      {s.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.logo_url} alt={s.name} />
                      ) : (
                        s.name
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null
          )}

        {/* แพ็กเกจสปอนเซอร์ */}
        <section>
          <div className="section-title">
            <h2>แพ็กเกจลงสปอนเซอร์</h2>
            <span>เลือกรอบที่เหมาะกับคุณ</span>
          </div>
          <div className="pkg-grid">
            {PACKAGES.map((p) => (
              <div key={p.name} className={`pkg-card ${p.tag ? "featured" : ""}`}>
                {p.tag ? <span className="pkg-tag">{p.tag}</span> : null}
                <div className="pkg-name">{p.name}</div>
                <div className="pkg-months">{p.months}</div>
                <div className="pkg-note muted">{p.note}</div>
                <div className="pkg-price muted">สอบถามราคา</div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
            * ทุกแพ็กเกจ: โลโก้บนเว็บ (แถบขวา/แถบล่าง) + ระบบนับวันหมดอายุอัตโนมัติ — สอบถามรายละเอียด/ราคาได้ที่ทีมงาน
          </p>
        </section>

        <section className="cta-band" style={{ marginBottom: 50 }}>
          <div>
            <h2>อยากเป็นสปอนเซอร์?</h2>
            <p>เลือกแพ็กเกจ (รายเดือน / 3 / 6 / รายปี) ระบุวันเริ่ม ระบบนับวันหมดอายุให้อัตโนมัติ — ติดต่อรับใบเสนอราคา</p>
          </div>
          <div className="cta-actions">
            <a href={`tel:${SPONSOR_PHONE_TEL}`} className="btn gold">
              โทร {SPONSOR_PHONE} (คุณแบงค์)
            </a>
            <a href={LINE_OA} target="_blank" rel="noreferrer" className="btn green">
              แอด LINE OA
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
