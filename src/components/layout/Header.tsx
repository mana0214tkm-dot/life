'use client'

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

export function Header({ title }: { title: string }) {
  const d = new Date()
  const label = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DAYS[d.getDay()]}）`

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px 12px',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
    }}>
      <h1 style={{ fontSize: 18, fontWeight: 500 }}>{title}</h1>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
        background: 'var(--bg3)', padding: '4px 10px',
        borderRadius: 6, border: '1px solid var(--border)',
      }}>{label}</div>
    </header>
  )
}