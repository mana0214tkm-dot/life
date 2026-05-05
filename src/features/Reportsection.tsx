'use client'
import { useStore } from '@/store/useStore'

const CIRCUMFERENCE = 2 * Math.PI * 36  // r=36

const REWARDS: [number, string, string][] = [
  [0,  'タスクを追加して達成しよう！', ''],
  [1,  '🌱 スタートを切りました！',    '初完了バッジ'],
  [5,  '⭐ 調子が出てきた！',          '5タスク達成'],
  [10, '🎯 10タスク突破！',            'ストライカーバッジ'],
  [20, '🚀 20タスク達成！',            '本格派バッジ'],
  [50, '💎 50タスク達成！',            'マスターバッジ'],
]

export function ReportSection() {
  const { tasks, streakData } = useStore()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const total = tasks.length
  const done  = tasks.filter(t => t.done).length
  const rate  = total ? Math.round(done / total * 100) : 0
  const offset = CIRCUMFERENCE - (rate / 100) * CIRCUMFERENCE

  // streak
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    if (streakData[ds]) streak++
    else if (i > 0) break
  }

  // priority counts
  const counts = {
    high: tasks.filter(t => t.priority === 'high').length,
    mid:  tasks.filter(t => t.priority === 'mid').length,
    low:  tasks.filter(t => t.priority === 'low').length,
  }
  const maxCount = Math.max(...Object.values(counts), 1)

  const reward = REWARDS.filter(r => done >= r[0]).at(-1)!

  return (
    <div>
      {/* summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {([
          ['総タスク数', total],
          ['完了済み',   done],
          ['達成率',     rate + '%'],
          ['連続達成日', streak + '🔥'],
        ] as const).map(([label, val]) => (
          <div key={label} className="card">
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--mono)' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* bar chart */}
        <div className="card">
          <div className="card-title">優先度別タスク数</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 90 }}>
            {([
              ['高', 'high', '#f56a6a'],
              ['中', 'mid',  '#f5a26a'],
              ['低', 'low',  'var(--green)'],
            ] as const).map(([label, key, color]) => {
              const h = Math.round(counts[key] / maxCount * 90)
              return (
                <div key={key} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 4, flex: 1,
                }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{counts[key]}</div>
                  <div style={{
                    width: '100%', background: color, minHeight: 2,
                    height: h, borderRadius: '4px 4px 0 0', transition: 'height .4s',
                  }} />
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* donut chart */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
            <svg width={90} height={90} viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={45} cy={45} r={36} fill="none" stroke="var(--bg3)" strokeWidth={12} />
              <circle
                cx={45} cy={45} r={36} fill="none"
                stroke="var(--accent)" strokeWidth={12}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset .4s' }}
              />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--green)' }}>
                {rate}%
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)' }}>完了率</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['var(--accent)', '完了'], ['var(--bg3)', '未完了']].map(([bg, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: bg, border: '1px solid var(--border2)' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* streak calendar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">連続達成カレンダー（直近14日）</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Array.from({ length: 14 }, (_, i) => {
            const d  = new Date(today); d.setDate(d.getDate() - 13 + i)
            const ds = d.toISOString().split('T')[0]
            const isToday  = ds === todayStr
            const hasDone  = !!streakData[ds]
            return (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: 6,
                border: `1px solid ${hasDone ? 'var(--green)' : isToday ? 'var(--accent)' : 'var(--border)'}`,
                background: hasDone ? 'rgba(94,232,176,0.15)' : 'var(--bg3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontFamily: 'var(--mono)',
                color: hasDone ? 'var(--green)' : isToday ? 'var(--accent)' : 'var(--muted)',
              }}>
                {d.getDate()}
              </div>
            )
          })}
        </div>
      </div>

      {/* reward */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(124,106,245,0.12),rgba(94,232,176,0.08))',
        border: '1px solid rgba(124,106,245,0.25)',
        borderRadius: 10, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
      }}>
        <span style={{ fontSize: 28 }}>🏆</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{reward[1]}</div>
          {reward[2] && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{reward[2]}</div>}
        </div>
      </div>

      {/* review table */}
      <div className="card">
        <div className="card-title">振り返り表</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: 'var(--muted)' }}>
              {['タスク名', '優先', '所要(分)', '状態'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 0 ? 'left' : 'center',
                  padding: '6px 8px', borderBottom: '1px solid var(--border)',
                  fontWeight: 400,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.slice(0, 20).map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '6px 8px' }}>{t.name}</td>
                <td style={{
                  textAlign: 'center', padding: '6px 8px',
                  color: t.priority === 'high' ? '#f56a6a' : t.priority === 'mid' ? '#f5a26a' : 'var(--green)',
                }}>
                  {t.priority === 'high' ? '高' : t.priority === 'mid' ? '中' : '低'}
                </td>
                <td style={{ textAlign: 'center', padding: '6px 8px', fontFamily: 'var(--mono)' }}>
                  {t.duration || '—'}
                </td>
                <td style={{
                  textAlign: 'center', padding: '6px 8px',
                  color: t.done ? 'var(--green)' : 'var(--muted)',
                }}>
                  {t.done ? '✓完了' : '未完了'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}