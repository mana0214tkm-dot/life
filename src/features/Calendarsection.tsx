'use client'
import { useState } from 'react'
import { useStore }           from '@/store/useStore'
import { CAL_DAYS, CAL_MONTHS } from '@/lib/utils'

export function CalendarSection() {
  const { tasks, toggleTask } = useStore()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const [year,     setYear]     = useState(today.getFullYear())
  const [month,    setMonth]    = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)

  const changeMonth = (dir: number) => {
    let m = month + dir, y = year
    if (m < 0)  { m = 11; y-- }
    if (m > 11) { m = 0;  y++ }
    setMonth(m); setYear(y)
  }

  // group tasks by dueDate
  const byDate: Record<string, typeof tasks> = {}
  tasks.forEach(t => {
    if (!t.dueDate) return
    if (!byDate[t.dueDate]) byDate[t.dueDate] = []
    byDate[t.dueDate].push(t)
  })

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const totalCells  = Math.ceil((firstDay + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dn = i - firstDay + 1
    if (dn < 1 || dn > daysInMonth)
      return { day: dn < 1 ? daysInPrev + dn : dn - daysInMonth, other: true, ds: '' }
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(dn).padStart(2, '0')}`
    return { day: dn, other: false, ds }
  })

  const selTasks = selected ? byDate[selected] ?? [] : []
  const [sy, sm, sd] = (selected ?? '').split('-')

  return (
    <div>
      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => changeMonth(-1)}>← 前月</button>
        <div style={{ fontSize: 17, fontWeight: 500 }}>{year}年 {CAL_MONTHS[month]}</div>
        <button className="btn btn-ghost btn-sm" onClick={() => changeMonth(1)}>翌月 →</button>
      </div>

      {/* grid */}
      <table style={{
        width: '100%', borderCollapse: 'separate', borderSpacing: 3,
        tableLayout: 'fixed', marginBottom: 16,
      }}>
        <thead>
          <tr>
            {CAL_DAYS.map((d, i) => (
              <th key={d} style={{
                textAlign: 'center', fontSize: 11, fontWeight: 400,
                padding: '4px 0 8px',
                color: i === 0 ? '#f56a6a' : i === 6 ? 'var(--accent)' : 'var(--muted)',
              }}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: totalCells / 7 }, (_, row) => (
            <tr key={row}>
              {cells.slice(row * 7, row * 7 + 7).map((cell, col) => {
                const isToday = cell.ds === todayStr
                const isSel   = cell.ds === selected
                const ev      = cell.ds ? byDate[cell.ds] ?? [] : []
                return (
                  <td
                    key={col}
                    onClick={() => !cell.other && setSelected(cell.ds === selected ? null : cell.ds)}
                    style={{
                      verticalAlign: 'top', height: 70, borderRadius: 8,
                      padding: '5px 6px', cursor: cell.other ? 'default' : 'pointer',
                      opacity: cell.other ? 0.25 : 1,
                      border: isToday ? '1px solid var(--accent)'
                            : isSel   ? '1px solid var(--green)'
                            : '1px solid var(--border)',
                      background: isToday ? 'rgba(124,106,245,0.1)'
                                : isSel   ? 'rgba(94,232,176,0.07)'
                                : 'var(--bg2)',
                    }}
                  >
                    <span style={{
                      display: 'block', fontSize: 12, marginBottom: 3,
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? 'var(--accent)' : 'var(--text)',
                    }}>{cell.day}</span>
                    {ev.slice(0, 2).map(t => {
                      const bg  = t.priority === 'high' ? 'rgba(245,106,106,0.2)'
                                : t.priority === 'mid'  ? 'rgba(245,162,106,0.18)'
                                : 'rgba(94,232,176,0.15)'
                      const col = t.priority === 'high' ? '#f56a6a'
                                : t.priority === 'mid'  ? '#f5a26a' : '#5ee8b0'
                      return (
                        <div key={t.id} style={{
                          fontSize: 10, background: bg, color: col,
                          padding: '1px 4px', borderRadius: 3, marginTop: 2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          opacity: t.done ? 0.4 : 1,
                          textDecoration: t.done ? 'line-through' : 'none',
                        }}>{t.name}</div>
                      )
                    })}
                    {ev.length > 2 && (
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                        +{ev.length - 2}件
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* detail panel */}
      {selected && (
        <div className="card">
          <div className="card-title">
            📅 {sy}年{parseInt(sm)}月{parseInt(sd)}日
            {selTasks.length ? ` — ${selTasks.length}件` : ' — タスクなし'}
          </div>
          {selTasks.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>この日に締め切りのタスクはありません。</div>
          )}
          {selTasks.map(t => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              border: '1px solid var(--border)', background: 'var(--bg3)',
              marginBottom: 7, fontSize: 13,
            }}>
              <button
                onClick={() => toggleTask(t.id)}
                style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  border: t.done ? 'none' : '1.5px solid var(--border2)',
                  background: t.done ? 'var(--green)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#0f0f13', cursor: 'pointer',
                }}
              >{t.done ? '✓' : ''}</button>
              <span style={{
                flex: 1,
                textDecoration: t.done ? 'line-through' : 'none',
                color: t.done ? 'var(--muted)' : 'var(--text)',
              }}>{t.name}</span>
              <span className={`tag tag-${t.priority}`}>
                {t.priority === 'high' ? '高' : t.priority === 'mid' ? '中' : '低'}
              </span>
              {t.dueTime && (
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t.dueTime}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}