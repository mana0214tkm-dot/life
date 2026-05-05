'use client'
import { useState, useEffect, useRef } from 'react'
import { useStore }   from '@/store/useStore'
import { formatHMS }  from '@/lib/utils'

interface Props { onClose: () => void }

export function FocusOverlay({ onClose }: Props) {
  const { tasks, toggleTask } = useStore()

  const topTask = [...tasks]
    .filter(t => !t.done)
    .sort((a, b) => {
      const p: Record<string, number> = { high: 0, mid: 1, low: 2 }
      return (p[a.priority] ?? 1) - (p[b.priority] ?? 1)
    })[0]

  const [seconds, setSeconds] = useState(topTask?.duration ? topTask.duration * 60 : 300)
  const [running, setRunning] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    } else {
      if (ref.current) clearInterval(ref.current)
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running])

  const handleDone = () => {
    if (topTask) toggleTask(topTask.id)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,15,19,0.93)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 16, padding: '36px 44px',
        maxWidth: 480, width: '90%', textAlign: 'center',
      }}>
        <div style={{
          fontSize: 11, color: 'var(--muted)',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18,
        }}>
          🔬 フォーカスモード
        </div>

        <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>
          {topTask?.name ?? 'タスクがありません'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>
          {topTask?.memo || 'できるところからやってみよう！'}
        </div>

        <div style={{
          fontFamily: 'var(--mono)', fontSize: 52, fontWeight: 700,
          color: seconds === 0 ? 'var(--green)' : 'var(--accent)',
          marginBottom: 28, transition: 'color 0.3s',
        }}>
          {formatHMS(seconds)}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => setRunning(r => !r)}
          >
            {running ? '⏸ 一時停止' : '▶ スタート'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleDone}>✓ 完了！</button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>× 閉じる</button>
        </div>
      </div>
    </div>
  )
}
