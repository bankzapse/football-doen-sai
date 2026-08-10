import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="brand">
          <Logo size={38} />
          <span>
            FDS <span className="hi">Cup</span>
            <small>FOOTBALL เดินสาย</small>
          </span>
        </Link>
        <nav className="nav">
          <Link href="/">รายการแข่ง</Link>
          <Link href="/live">ถ่ายทอดสด</Link>
          <Link href="/results">ผลแข่ง</Link>
          <Link href="/teams">ทีม</Link>
          <Link href="/players">หานักเตะ</Link>
          <Link href="/community">ชุมชน</Link>
          <Link href="/sponsors">สปอนเซอร์</Link>
        </nav>
        <div className="header-cta">
          <Link href="/#contact" className="btn gold">
            อยากจัดรายการ? ติดต่อเรา
          </Link>
        </div>
      </div>
    </header>
  );
}
