import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://doensai.fc";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "เดินสาย FC — ศูนย์รวมฟุตบอลเดินสายทั่วไทย",
    template: "%s | เดินสาย FC",
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
    siteName: "เดินสาย FC",
    title: "เดินสาย FC — ศูนย์รวมฟุตบอลเดินสายทั่วไทย",
    description: "รวมทุกรายการฟุตบอลเดินสายทั่วไทย เปิดรับสมัคร ตารางแข่ง เงินรางวัล และถ่ายทอดสด",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
