import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getVenues } from "@/lib/data";

export const metadata: Metadata = {
  title: "สนามแข่ง",
  description: "รวมสนามฟุตบอลเดินสายทั่วไทย พร้อมจังหวัด ขนาดสนาม และแผนที่",
};

const FALLBACK =
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=60";

export default async function VenuesPage() {
  const venues = await getVenues();

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="page-head">
          <h1>สนามแข่ง</h1>
          <p>รวมสนามที่ใช้จัดฟุตบอลเดินสายทั่วประเทศ</p>
        </div>

        <div className="tile-grid">
          {venues.map((v) => (
            <div className="tile" key={v.id}>
              <div
                className="cover"
                style={{ backgroundImage: `url(${v.image_url || FALLBACK})` }}
              />
              <div className="body">
                <h3>{v.name}</h3>
                <p>
                  {v.district ? `อ.${v.district} · ` : ""}จ.{v.province}
                  {v.size ? ` · ${v.size}` : ""}
                </p>
                {v.map_url ? (
                  <a
                    href={v.map_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn ghost"
                    style={{ marginTop: 12 }}
                  >
                    ดูแผนที่
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
