'use client'
import { useStore } from '@/store/useStore'

const QUADRANTS = [
  { id: 'q2', label: '📌 重要・非緊急', sub: '計画・成長',  bg: 'rgba(124,106,245,0.06)', border: 'rgba(124,106,245,0.2)', text: 'var(--accent)' },
  { id: 'q1', label: '🔥 重要・緊急',   sub: '今すぐやる', bg: 'rgba(245,106,106,0.06)', border: 'rgba(245,106,106,0.2)', text: 'var(--danger)' },
  { id: 'q4', label: '😴 非重要・非緊急',sub: '後回し・削除', bg: 'rgba(107,107,128,0.05)', border: 'var(--border)',           text: 'var(--muted)'  },
  { id: 'q3', label: '📞 非重要・緊急', sub: '委任・短縮',  bg: 'rgba(245,162,106,0.06)', border: 'rgba(245,162,106,0.2)', text: 'var(--orange)' },
] as const

export function MatrixSection() {
  const { tasks, toggleTask } = useStore()

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
        タスク追加時に「マトリクス分類」を設定すると自動で振り分けられます。
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
        <span>← 緊急度 低</span><span>緊急度 高 →</span>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr', gap: 12, height: 360,
      }}>
        {QUADRANTS.map(q => {
          const items = tasks.filter(t => t.quadrant === q.id && !t.done)
          return (
            <div key={q.id} style={{
              borderRadius: 10, border: `1px solid ${q.border}`,
              background: q.bg, padding: '12px 14px', overflowY: 'auto',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: q.text,
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
              }}>
                {q.label}<br />
                <span style={{ fontWeight: 400, fontSize: 9 }}>{q.sub}</span>
              </div>
              {items.length === 0 && (
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>なし</div>
              )}
              {items.map(t => (
                <div key={t.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: 12, padding: '4px 8px', borderRadius: 5,
                  background: 'var(--bg3)', marginBottom: 5,
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {t.name}
                  </span>
                  <button
                    onClick={() => toggleTask(t.id)}
                    style={{
                      background: 'none', border: 'none', color: q.text,
                      cursor: 'pointer', fontSize: 12, flexShrink: 0, marginLeft: 6,
                    }}
                  >✓</button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}