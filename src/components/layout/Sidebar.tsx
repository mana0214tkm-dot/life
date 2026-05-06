'use client'
import { useState } from 'react'
import type { NavSection } from '@/types'

const NAV: { id: NavSection; icon: string; label: string }[] = [
  { id: 'today',     icon: '📋', label: '今日のタスク' },
  { id: 'calendar',  icon: '📅', label: 'カレンダー' },
  { id: 'timeblock', icon: '🕐', label: 'タイムブロック' },
  { id: 'priority',  icon: '🏅', label: '優先順位を決める' },
  { id: 'matrix',    icon: '🎯', label: 'アイゼンハワー' },
  { id: 'tracker',   icon: '⏱',  label: 'タイムトラッキング' },
  { id: 'notlist',   icon: '🚫', label: 'やらないこと' },
  { id: 'report',    icon: '📊', label: '達成グラフ' },
]

const MOODS = ['😫', '😐', '🙂', '😄', '🔥']

interface Props {
  current: NavSection
  onNav:   (s: NavSection) => void
  isOpen:  boolean
  onClose: () => void
}

export function Sidebar({ current, onNav, isOpen, onClose }: Props) {
  const [mood,  setMood]  = useState('')
  const [focus, setFocus] = useState(5)

  return (
    <aside className={`app-sidebar${isOpen ? ' open' : ''}`} style={{
      width: 220, flexShrink: 0,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '18px 16px 14px',
        fontSize: 15, fontWeight: 700, letterSpacing: '0.05em',
        color: 'var(--accent)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>にがてノート<span style={{ color: 'var(--green)', fontSize: 11, fontWeight: 400, marginLeft: 4 }}>✦</span></span>
        <button
          type="button"
          className="menu-btn btn-icon"
          onClick={onClose}
          aria-label="メニューを閉じる"
          style={{ fontSize: 16, padding: '2px 6px' }}
        >✕</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 12px', marginBottom: 2,
              border: 'none', borderRadius: 8, textAlign: 'left',
              fontSize: 13, cursor: 'pointer',
              background: current === item.id ? 'rgba(124,106,245,0.15)' : 'transparent',
              color:      current === item.id ? 'var(--accent)' : 'var(--muted)',
              fontWeight: current === item.id ? 500 : 400,
              fontFamily: 'var(--sans)',
              transition: 'all 0.12s',
            }}
          >
            <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', marginBottom: 6 }}>
          今日の気分
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 10 }}>
          {MOODS.map(e => (
            <button
              key={e}
              onClick={() => setMood(m => m === e ? '' : e)}
              style={{
                background: mood === e ? 'rgba(124,106,245,0.15)' : 'var(--bg3)',
                border:     `1px solid ${mood === e ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 6, padding: '3px 5px',
                fontSize: 14, cursor: 'pointer',
                transform: mood === e ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.1s',
              }}
            >{e}</button>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 10, color: 'var(--muted)', marginBottom: 4,
        }}>
          <label htmlFor="focus-level">集中力レベル</label>
          <span style={{ fontFamily: 'var(--mono)' }}>{focus}</span>
        </div>
        <input
          id="focus-level"
          type="range" min={1} max={10} value={focus}
          onChange={e => setFocus(+e.target.value)}
          title="集中力レベルを調整"
          style={{ accentColor: 'var(--green)' }}
        />
      </div>
    </aside>
  )
}