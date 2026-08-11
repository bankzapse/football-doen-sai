import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSponsors } from "@/lib/data";

export const metadata: Metadata = {
  title: "สปอนเซอร์",
  description: "พาร์ทเนอร์และสปอนเซอร์ของเดินสาย FC — ลงโฆษณาเข้าถึงคนวงการฟุตบอลเดินสายทั่วไทย",
};

const TIER_LABEL: Record<string, string> = {
  platinum: "พาร์ทเนอร์หลัก",
  gold: "สปอนเซอร์ทอง",
  standard: "สปอนเซอร์",
};

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
            ขอบคุณผู้สนับสนุนที่ทำให้วงการฟุตบอลเดินสายเติบโต — สนใจลงโฆษณากับเรา
            เข้าถึงแฟนบอลและทีมทั่วประเทศ ติดต่อ 064-642-2168
          </p>
        </div>

        {(["platinum", "gold", "standard"] as const).map((tier) =>
          byTier(tier).length ? (
            <section key={tier}>
              <div className="section-title">
                <h2>{TIER_LABEL[tier]}</h2>
              </div>
              <div className="sponsor-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", marginBottom: 30 }}>
                {byTier(tier).map((s) => (
                  <div key={s.id} className={`sponsor ${s.tier} size-${s.size ?? "sm"}`} style={{ aspectRatio: "16/9" }}>
                    {s.name}
                  </div>
                ))}
              </div>
            </section>
          ) : null
        )}

        <section className="cta-band" style={{ marginBottom: 50 }}>
          <div>
            <h2>อยากเป็นสปอนเซอร์?</h2>
            <p>มีแพ็กเกจโลโก้บนเว็บ ป้ายในสนาม และสปอตในไลฟ์ ติดต่อทีมงานเพื่อรับใบเสนอราคา</p>
          </div>
          <div className="cta-actions">
            <a href="tel:0646422168" className="btn gold">
              โทร 064-642-2168
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
