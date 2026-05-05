'use client'
import { useState, useEffect, useRef } from 'react'
import { useStore }    from '@/store/useStore'
import { formatHMS, TODAY_STR } from '@/lib/utils'

const POMODORO = 25 * 60

export function TrackerSection() {
  const { tasks, addTimeSpent, tracking, addTracking } = useStore()
  const undone = tasks.filter(t => !t.done)

  const [taskId,  setTaskId]  = useState('')
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      if (ref.current) clearInterval(ref.current)
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running])

  const pomodoros = Math.floor(seconds / POMODORO)
  const selectedTask = tasks.find(t => t.id === parseInt(taskId))

  const handleToggle = () => {
    if (running) {
      setRunning(false)
      if (selectedTask && seconds > 0) {
        addTimeSpent(selectedTask.id, seconds)
        addTracking({
          taskId: selectedTask.id,
          taskName: selectedTask.name,
          seconds,
          date: TODAY_STR,
          time: new Date().toTimeString().slice(0, 5),
        })
      }
    } else {
      setRunning(true)
    }
  }

  const handleReset = () => {
    setRunning(false)
    setSeconds(0)
  }

  return (
    <div>
      {/* timer card */}
      <div className="card" style={{ textAlign: 'center', padding: 28, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 42, color: 'var(--accent)', marginBottom: 8 }}>
          {formatHMS(seconds)}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          {selectedTask?.name ?? 'タスクを選択してください'}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
          <select
            aria-label="タスクを選択"
            value={taskId}
            onChange={e => setTaskId(e.target.value)}
            style={{ width: 200 }}
          >
            <option value="">── タスクを選択 ──</option>
            {undone.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className={`btn ${running ? 'btn-success' : 'btn-primary'}`} onClick={handleToggle}>
            {running ? '⏸ 一時停止' : '▶ スタート'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleReset}>リセット</button>
        </div>

        {/* pomodoro indicators */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Array.from({ length: Math.max(pomodoros + 1, 4) }, (_, i) => (
            <div key={i} style={{
              width: 16, height: 16, borderRadius: 3,
              background: 'var(--accent)',
              opacity: i < pomodoros ? 1 : 0.25,
            }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
          25分集中 × 5分休憩（ポモドーロ）
        </div>
      </div>

      {/* history */}
      <div className="card">
        <div className="card-title">今日のトラッキング履歴</div>
        {tracking.length === 0
          ? <div style={{ fontSize: 13, color: 'var(--muted)', padding: '8px 0' }}>記録なし</div>
          : tracking.slice(0, 8).map((e, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13,
              }}>
                <span>{e.taskName}</span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--green)' }}>
                  {Math.floor(e.seconds / 60)}m {e.seconds % 60}s
                </span>
              </div>
            ))
        }
      </div>
    </div>
  )
}