import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '人生ときめき',
  description: '毎日の小さな達成をときめきに変える、やさしい予定・タスク管理アプリ',
  openGraph: {
    title: '人生ときめき',
    description: '毎日の小さな達成をときめきに変える、やさしい予定・タスク管理アプリ',
    siteName: '人生ときめき',
    locale: 'ja_JP',
    type: 'website',
  },
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
