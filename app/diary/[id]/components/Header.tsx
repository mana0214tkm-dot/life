import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="headerInner">
        <Link href="/" className="logo kira">
          ふわキラ日記🎀
        </Link>

        <nav className="nav">
          <Link href="/">ホーム</Link>
          <Link href="/profile">プロフィール</Link>
          <Link href="/gallery">ギャラリー</Link>
        </nav>

        <div className="iconBtn" aria-label="search">🔎</div>
      </div>
    </header>
  );
}