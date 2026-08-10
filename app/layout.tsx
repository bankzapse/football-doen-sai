import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

// Kanit ล้วน — สายจัดจ้าน สปอร์ต หนักแน่น ทั้งหัวข้อและเนื้อหา
const display = Kanit({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const sans = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://doensai.fc";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FDS Cup — ศูนย์รวมฟุตบอลเดินสายทั่วไทย",
    template: "%s | FDS Cup",
  },
  description:
    "รวมทุกรายการฟุตบอลเดินสาย 7 คน 9 คน 11 คน ทั่วไทย — เปิดรับสมัครวันไหน แข่งวันไหน กี่ทีม เงินรางวัลเท่าไหร่ พร้อมลิงก์ถ่ายทอดสด ครบในที่เดียว",
  keywords: [
    "ฟุตบอลเดินสาย", "ฟุตบอล 7 คน", "ฟุตบอล 9 คน", "รับสมัครฟุตบอล",
    "ทัวร์นาเมนต์ฟุตบอล", "เงินรางวัลฟุตบอล", "ถ่ายทอดสดฟุตบอล",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "FDS Cup",
    title: "FDS Cup — ศูนย์รวมฟุตบอลเดินสายทั่วไทย",
    description: "รวมทุกรายการฟุตบอลเดินสายทั่วไทย เปิดรับสมัคร ตารางแข่ง เงินรางวัล และถ่ายทอดสด",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
