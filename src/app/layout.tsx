import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'にがてノート',
  description: 'やることが苦手でも大丈夫。やさしい予定・タスク管理アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
