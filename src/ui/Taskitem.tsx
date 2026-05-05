'use client'
import { useStore } from '@/store/useStore'
import type { Task } from '@/types'
import { priorityColor, priorityLabel } from '@/lib/utils'

export function TaskItem({ task: t }: { task: Task }) {
  const { toggleTask, deleteTask, decompose, toggleStep } = useStore()

  const hasSteps  = t.steps.length > 0
  const doneSteps = t.steps.filter(s => s.done).length
  const isOverdue =
    !t.done && t.dueDate &&
    new Date(t.dueDate + (t.dueTime ? 'T' + t.dueTime : '')) < new Date()

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 16px', marginBottom: 8,
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      opacity: t.done ? 0.48 : 1,
      transition: 'opacity 0.15s',
    }}>
      {/* ── checkbox ── */}
      <button
        onClick={() => toggleTask(t.id)}
        style={{
          flexShrink: 0, marginTop: 1,
          width: 20, height: 20, borderRadius: '50%',
          border: t.done ? 'none' : '1.5px solid var(--border2)',
          background: t.done ? 'var(--green)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: '#0f0f13', cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >{t.done ? '✓' : ''}</button>

      {/* ── body ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* name */}
        <div style={{
          fontSize: 14, marginBottom: 4,
          textDecoration: t.done ? 'line-through' : 'none',
          color: t.done ? 'var(--muted)' : 'var(--text)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{t.name}</div>

        {/* meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 11, color: 'var(--muted)' }}>
          {t.startTime && <span>🕐 {t.startTime}〜</span>}
          {t.dueDate && (
            <span style={{ color: isOverdue ? 'var(--danger)' : 'var(--muted)' }}>
              📅 {t.dueDate}{t.dueTime ? ` 〆${t.dueTime}` : ''}
            </span>
          )}
          {t.duration > 0 && <span>⏱ {t.duration}分</span>}
          {t.timeSpent > 0 && <span>⏳ {Math.round(t.timeSpent / 60)}分記録</span>}
        </div>

        {/* memo */}
        {t.memo && (
          <div style={{
            fontSize: 12, color: 'var(--muted)', marginTop: 5,
            borderLeft: '2px solid var(--border2)', paddingLeft: 8,
          }}>{t.memo}</div>
        )}

        {/* steps */}
        {hasSteps && (
          <div style={{
            marginTop: 8, padding: '8px 10px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6 }}>
              やること（クリックで完了）
            </div>
            {t.steps.map((s, i) => (
              <div
                key={i}
                onClick={() => toggleStep(t.id, i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 0', cursor: 'pointer',
                  borderBottom: i < t.steps.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${s.done ? 'var(--green)' : 'var(--border2)'}`,
                  background: s.done ? 'var(--green)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#0f0f13',
                }}>{s.done ? '✓' : ''}</div>
                <span style={{
                  fontSize: 12,
                  color: s.done ? 'var(--muted)' : 'var(--text)',
                  textDecoration: s.done ? 'line-through' : 'none',
                }}>{s.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* decompose button */}
        <button
          onClick={() => decompose(t.id)}
          style={{
            marginTop: 6, fontSize: 11, padding: '3px 8px',
            border: `1px solid ${hasSteps ? 'var(--green)' : 'var(--border2)'}`,
            borderRadius: 6, background: 'transparent',
            color: hasSteps ? 'var(--green)' : 'var(--muted)',
            cursor: 'pointer', fontFamily: 'var(--sans)',
          }}
        >
          {hasSteps
            ? `▾ ${doneSteps}/${t.steps.length} ステップ`
            : '＋ やることを分解'}
        </button>
      </div>

      {/* ── actions ── */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
        <span className={`tag tag-${t.priority}`}>{priorityLabel(t.priority)}</span>
        {t.repeat && (
          <span className="tag tag-repeat">
            {t.repeat === 'daily' ? '毎日' : '毎週'}
          </span>
        )}
        <button className="btn-icon" onClick={() => deleteTask(t.id)}>✕</button>
      </div>
    </div>
  )
}