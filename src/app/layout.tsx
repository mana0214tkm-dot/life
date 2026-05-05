import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ふわキラ日記',
  description: 'ADHD対応スケジュール管理',
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
