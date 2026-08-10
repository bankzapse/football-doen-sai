import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <div className="brand" style={{ marginBottom: 10 }}>
            <Logo size={34} />
            <span>
              FDS <span className="hi">Cup</span>
            </span>
          </div>
          <p style={{ maxWidth: "34ch", margin: 0 }}>
            ศูนย์รวมฟุตบอลเดินสายทั่วไทย รวมทุกรายการ ตารางแข่ง เงินรางวัล และถ่ายทอดสด ในที่เดียว
          </p>
        </div>
        <div>
          <h5>รายการ</h5>
          <Link href="/">กำลังรับสมัคร</Link>
          <Link href="/live">แข่งวันนี้ / ถ่ายทอดสด</Link>
          <Link href="/results">ผลการแข่งขัน</Link>
          <Link href="/teams">ทำเนียบทีม</Link>
          <Link href="/players">หานักเตะเดินสาย</Link>
          <Link href="/venues">สนามแข่ง</Link>
        </div>
        <div>
          <h5>อยากจัดรายการ?</h5>
          <Link href="/#contact">ติดต่อทีมงาน</Link>
          <Link href="/sponsors">เป็นสปอนเซอร์</Link>
          <Link href="/admin">เข้าสู่หลังบ้าน</Link>
        </div>
        <div>
          <h5>ติดต่อ</h5>
          <a href="tel:0646422168">โทร 064-642-2168</a>
          <a href="#">LINE Official</a>
          <a href="#">Facebook</a>
        </div>
      </div>
    </footer>
  );
}
