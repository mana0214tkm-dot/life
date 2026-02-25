import "./globals.css";

export const metadata = {
  title: "ふわキラ日記",
  description: "ふわっとポジティブなアイドル風ブログ（雰囲気オリジナル）",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}