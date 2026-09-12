'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { NavSection } from '@/types'
import { useStore } from '@/store/useStore'

const NAV: { id: NavSection; icon: string; label: string }[] = [
  { id: 'today',     icon: '📋', label: '今日のタスク' },
  { id: 'calendar',  icon: '📅', label: 'カレンダー' },
  { id: 'timeblock', icon: '🕐', label: 'タイムブロック' },
  { id: 'priority',  icon: '🏅', label: '優先順位を決める' },
  { id: 'matrix',    icon: '🎯', label: 'アイゼンハワー' },
  { id: 'tracker',   icon: '⏱',  label: 'タイムトラッキング' },
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
  const streakData = useStore(s => s.streakData)
  const growthPoints = Object.values(streakData).reduce((total, count) => total + count, 0)
  const previousPoints = useRef(growthPoints)
  const [petCelebrating, setPetCelebrating] = useState(false)
  const growthStage = growthPoints >= 20 ? 3 : growthPoints >= 10 ? 2 : growthPoints >= 3 ? 1 : 0
  const growthStages = [
    { name: 'たまごロボ', icon: '🥚', next: 3 },
    { name: 'ひよこロボ', icon: '🐣', next: 10 },
    { name: 'おてつだいロボ', icon: '🤖', next: 20 },
    { name: 'そらとぶロボ', icon: '🚀', next: null },
  ] as const
  const growth = growthStages[growthStage]
  const progress = growth.next === null ? 100 : Math.min(100, (growthPoints / growth.next) * 100)

  useEffect(() => {
    if (previousPoints.current !== growthPoints) {
      setPetCelebrating(true)
      const timer = setTimeout(() => setPetCelebrating(false), 1100)
      previousPoints.current = growthPoints
      return () => clearTimeout(timer)
    }
    previousPoints.current = growthPoints
  }, [growthPoints])

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 12, overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 16px rgba(79,70,229,0.12)' }}>
            <Image src="/real-schedule-photo.svg" alt="Sidebar photo" width={32} height={32} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <span>にがてノート<span style={{ color: 'var(--green)', fontSize: 11, fontWeight: 400, marginLeft: 4 }}>✦</span></span>
        </div>
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

      {/* Growth pet */}
      <div className={`growth-pet${petCelebrating ? ' growth-pet-celebrating' : ''}`} aria-label={`成長中の${growth.name}。達成タスク${growthPoints}個`}>
        <div className="growth-pet-header">
          <span>育成ロボ</span>
          <span className="growth-pet-level">Lv.{growthStage + 1}</span>
        </div>
        <div className="growth-pet-stage">
          <div key={growthStage} className="growth-pet-icon" aria-hidden="true">
            {growth.icon}
          </div>
          {petCelebrating && <span className="growth-pet-speech" aria-live="polite">すごい！</span>}
          <div>
            <div className="growth-pet-name">{growth.name}</div>
            <div className="growth-pet-message">
              {growth.next === null ? '最高の相棒だね！' : `あと${growth.next - growthPoints}個で進化`}
            </div>
          </div>
        </div>
        <div className="growth-pet-track" aria-hidden="true">
          <div className="growth-pet-progress" style={{ width: `${progress}%` }} />
        </div>
        <div className="growth-pet-count">達成タスク {growthPoints}</div>
      </div>

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