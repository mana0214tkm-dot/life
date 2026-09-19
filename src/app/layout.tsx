import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'にがて克服',
  description: '苦手なことも少しずつ克服できる、やさしい予定・タスク管理アプリ',
  openGraph: {
    title: 'にがて克服',
    description: '苦手なことも少しずつ克服できる、やさしい予定・タスク管理アプリ',
    siteName: 'にがて克服',
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
