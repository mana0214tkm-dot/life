'use client'
import { useState } from 'react'
import { useStore }   from '@/store/useStore'
import { TaskItem }   from '@/ui/Taskitem'
import { TODAY_STR }  from '@/lib/utils'
import type { Priority, RepeatType, Quadrant, FilterType } from '@/types'

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all',    label: 'すべて' },
  { id: 'high',   label: '🔴 高優先' },
  { id: 'undone', label: '未完了' },
  { id: 'done',   label: '完了' },
  { id: 'today',  label: '今日締め切り' },
  { id: 'daily',  label: '毎日' },
  { id: 'weekly', label: '毎週' },
  { id: 'score',  label: '🏅 スコア順' },
]

interface Props { onFocusOpen: () => void }

export function TodaySection({ onFocusOpen }: Props) {
  const {
    addTask, filtered, overdue, big3, toggleTask,
    filter, setFilter, goalCount, setGoal, tasks,
  } = useStore()

  // form state
  const [name,       setName]       = useState('')
  const [priority,   setPriority]   = useState<Priority>('mid')
  const [repeat,     setRepeat]     = useState<RepeatType>('')
  const [startTime,  setStartTime]  = useState('')
  const [dueDate,    setDueDate]    = useState(TODAY_STR)
  const [dueTime,    setDueTime]    = useState('')
  const [duration,   setDuration]   = useState('')
  const [quadrant,   setQuadrant]   = useState<Quadrant>('')
  const [memo,       setMemo]       = useState('')
  const [importance, setImportance] = useState(3)
  const [urgency,    setUrgency]    = useState(3)

  const clearForm = () => {
    setName(''); setMemo(''); setStartTime(''); setDueTime('')
    setDuration(''); setQuadrant(''); setPriority('mid'); setRepeat('')
    setImportance(3); setUrgency(3); setDueDate(TODAY_STR)
  }

  const handleAdd = () => {
    if (!name.trim()) return
    addTask({
      name: name.trim(), priority, repeat, startTime, dueDate,
      dueTime, duration: parseInt(duration) || 0, quadrant, memo,
      importance, urgency,
    })
    clearForm()
  }

  const doneTasks = tasks.filter(t => t.done).length
  const goalMet   = doneTasks >= goalCount
  const overdueList = overdue()
  const big3List    = big3()
  const list        = filtered()

  return (
    <div>
      {/* ── overdue banner ── */}
      {overdueList.length > 0 && (
        <div style={{
          background: 'rgba(245,106,106,0.1)',
          border: '1px solid rgba(245,106,106,0.3)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--danger)' }}>
            期限切れ {overdueList.length} 件：
            {overdueList.slice(0, 2).map(t => t.name).join('、')}
            {overdueList.length > 2 ? '…' : ''}
          </span>
        </div>
      )}

      {/* ── goal bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 16px', marginBottom: 16,
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: 10,
      }}>
        <span style={{ fontSize: 22 }}>🎯</span>
        <div style={{ flex: 1, fontSize: 13 }}>
          今日のゆるゴール：<strong>{goalCount} タスク</strong>
          <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8 }}>
            完了 {doneTasks}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: goalMet ? 'var(--green)' : 'var(--muted)' }}>
          {goalMet ? '🎉 達成！' : `あと ${goalCount - doneTasks}`}
        </span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            const n = parseInt(prompt('今日は何タスクでOK？', String(goalCount)) ?? '', 10)
            if (!isNaN(n) && n > 0) setGoal(n)
          }}
        >設定</button>
      </div>

      {/* ── big 3 ── */}
      {big3List.length > 0 && (
        <div style={{
          background: 'rgba(124,106,245,0.07)',
          border: '1px solid rgba(124,106,245,0.2)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--accent)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 10, display: 'flex', justifyContent: 'space-between',
          }}>
            ⚡ 今日のビッグ3 — これだけやれば OK
          </div>
          {big3List.map((t, i) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              marginBottom: i < big3List.length - 1 ? 6 : 0,
              opacity: t.done ? 0.5 : 1,
            }}>
              <span style={{
                fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)',
                color: 'var(--accent)', width: 20, flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{
                flex: 1, fontSize: 13,
                textDecoration: t.done ? 'line-through' : 'none',
                color: t.done ? 'var(--muted)' : 'var(--text)',
              }}>{t.name}</span>
              <button
                onClick={() => toggleTask(t.id)}
                style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  border: t.done ? 'none' : '1.5px solid var(--border2)',
                  background: t.done ? 'var(--green)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#0f0f13', cursor: 'pointer',
                }}
              >{t.done ? '✓' : ''}</button>
            </div>
          ))}
        </div>
      )}

      {/* ── ADHD toolbar ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={onFocusOpen}>🔬 フォーカスモード</button>
        <button className="btn btn-ghost btn-sm" onClick={onFocusOpen}>⏱ とりあえず5分</button>
      </div>

      {/* ── task form ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        {/* row 1: name + priority + repeat */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <input
            aria-label="タスク名"
            style={{ flex: 1, minWidth: 200 }}
            placeholder="タスク名を入力..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <select aria-label="優先度" value={priority} onChange={e => setPriority(e.target.value as Priority)} style={{ width: 90 }}>
            <option value="high">🔴 高</option>
            <option value="mid">🟡 中</option>
            <option value="low">🟢 低</option>
          </select>
          <select aria-label="繰り返し" value={repeat} onChange={e => setRepeat(e.target.value as RepeatType)} style={{ width: 110 }}>
            <option value="">繰り返しなし</option>
            <option value="daily">毎日</option>
            <option value="weekly">毎週</option>
          </select>
        </div>

        {/* row 2: dates / times / duration / quadrant */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <input aria-label="締め切り日" type="date"   value={dueDate}   onChange={e => setDueDate(e.target.value)}   style={{ width: 148 }} />
          <input aria-label="開始時刻"   type="time"   value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: 116 }} placeholder="開始時刻" />
          <input aria-label="締め切り時刻" type="time"   value={dueTime}   onChange={e => setDueTime(e.target.value)}   style={{ width: 116 }} placeholder="締め切り時刻" />
          <input aria-label="所要時間（分）" type="number" value={duration}  onChange={e => setDuration(e.target.value)}  style={{ width: 120 }} placeholder="所要時間(分)" />
          <select aria-label="マトリクス分類" value={quadrant} onChange={e => setQuadrant(e.target.value as Quadrant)} style={{ width: 138 }}>
            <option value="">マトリクス分類</option>
            <option value="q1">緊急×重要</option>
            <option value="q2">重要×非緊急</option>
            <option value="q3">緊急×非重要</option>
            <option value="q4">非緊急×非重要</option>
          </select>
        </div>

        {/* row 3: importance + urgency sliders */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {([
            ['重要度', importance, setImportance, 'var(--accent)'],
            ['緊急度', urgency,    setUrgency,    'var(--orange)'],
          ] as const).map(([label, val, setter, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 140 }}>
              <label style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{label}</label>
              <input
                aria-label={label}
                type="range" min={1} max={5} value={val}
                onChange={e => setter(+e.target.value)}
                style={{ flex: 1, accentColor: color }}
              />
              <span style={{ fontSize: 12, color, fontFamily: 'var(--mono)', width: 14, flexShrink: 0 }}>{val}</span>
            </div>
          ))}
          <div style={{
            fontSize: 12, background: 'var(--bg3)',
            border: '1px solid var(--border2)', borderRadius: 8,
            padding: '4px 12px', whiteSpace: 'nowrap',
          }}>
            スコア: <span style={{ fontWeight: 500, color: 'var(--green)' }}>{importance * urgency}</span>
          </div>
        </div>

        {/* row 4: memo */}
        <textarea
          aria-label="メモ"
          value={memo} onChange={e => setMemo(e.target.value)}
          placeholder="メモ（任意）"
          style={{ marginBottom: 10, minHeight: 48 }}
        />

        {/* row 5: actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={clearForm}>クリア</button>
          <button className="btn btn-primary"      onClick={handleAdd}>＋ 追加</button>
        </div>
      </div>

      {/* ── filters ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`pill ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >{f.label}</button>
        ))}
      </div>

      {/* ── task list ── */}
      {list.length === 0
        ? <div className="empty"><div className="empty-icon">✅</div>タスクがありません</div>
        : list.map(t => <TaskItem key={t.id} task={t} />)
      }
    </div>
  )
}