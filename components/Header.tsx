import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="brand">
          <span className="logo">⚽</span>
          <span>
            เดินสาย<span className="hi">FC</span>
            <small>DOENSAI HUB</small>
          </span>
        </Link>
        <nav className="nav">
          <Link href="/">รายการแข่ง</Link>
          <Link href="/live">ถ่ายทอดสด</Link>
          <Link href="/venues">สนามแข่ง</Link>
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
