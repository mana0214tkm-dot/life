'use client'

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

export function Header({ title, onMenuOpen }: { title: string; onMenuOpen: () => void }) {
  const d = new Date()
  const label = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DAYS[d.getDay()]}）`

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px 12px',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <button
          type="button"
          className="menu-btn btn-icon"
          onClick={onMenuOpen}
          aria-label="メニューを開く"
          style={{ fontSize: 20, padding: '2px 6px', flexShrink: 0 }}
        >☰</button>
        <h1 style={{ fontSize: 17, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
      </div>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)',
        background: 'var(--bg3)', padding: '4px 10px',
        borderRadius: 6, border: '1px solid var(--border)',
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>{label}</div>
    </header>
  )
}