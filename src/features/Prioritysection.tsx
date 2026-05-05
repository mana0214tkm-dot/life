'use client'
import { useState } from 'react'
import { useStore }   from '@/store/useStore'
import { calcScore }  from '@/lib/utils'
import type { Task }  from '@/types'

type View = 'score' | 'avb'
const MEDALS = ['🥇', '🥈', '🥉']

export function PrioritySection() {
  const { tasks } = useStore()
  const [view, setView] = useState<View>('score')

  // ── A vs B state ──
  const [avbScores, setAvbScores] = useState<Record<number, number>>({})
  const [avbQueue,  setAvbQueue]  = useState<[number, number][]>([])
  const [avbIdx,    setAvbIdx]    = useState(0)
  const [avbDone,   setAvbDone]   = useState(false)

  const undone = tasks.filter(t => !t.done)
  const ranked = [...undone].sort((a, b) => calcScore(b) - calcScore(a))
  const maxScore = ranked[0] ? calcScore(ranked[0]) : 1

  const startAvb = () => {
    const scores: Record<number, number> = {}
    undone.forEach(t => (scores[t.id] = 0))
    const pairs: [number, number][] = []
    for (let i = 0; i < undone.length; i++)
      for (let j = i + 1; j < undone.length; j++)
        pairs.push([undone[i].id, undone[j].id])
    const shuffled = pairs.sort(() => Math.random() - 0.5)
      .slice(0, Math.min(pairs.length, undone.length * 2))
    setAvbScores(scores); setAvbQueue(shuffled); setAvbIdx(0); setAvbDone(false)
  }

  const choose = (winnerId: number) => {
    setAvbScores(s => ({ ...s, [winnerId]: (s[winnerId] || 0) + 1 }))
    const next = avbIdx + 1
    if (next >= avbQueue.length) setAvbDone(true)
    else setAvbIdx(next)
  }

  const avbRanked = Object.entries(avbScores).sort((a, b) => b[1] - a[1])
  const pair  = avbQueue[avbIdx]
  const taskA = pair ? tasks.find(t => t.id === pair[0]) : null
  const taskB = pair ? tasks.find(t => t.id === pair[1]) : null
  const pct   = avbQueue.length ? Math.round(avbIdx / avbQueue.length * 100) : 0

  const rankColor = (i: number) =>
    i === 0 ? '#f56a6a' : i === 1 ? '#f5a26a' : i === 2 ? 'var(--green)' : 'var(--muted)'

  return (
    <div>
      {/* tab switcher */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className={`pill ${view === 'score' ? 'active' : ''}`}
          onClick={() => setView('score')}>🏅 自動スコアランキング</button>
        <button className={`pill ${view === 'avb' ? 'active' : ''}`}
          onClick={() => { setView('avb'); if (!avbQueue.length) startAvb() }}>⚡ A vs B 比較</button>
      </div>

      {/* ── score view ── */}
      {view === 'score' && (
        <>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
            重要度 × 緊急度 × 締め切りで自動計算したスコア順です。
          </p>
          {ranked.length === 0
            ? <div className="empty"><div className="empty-icon">🏅</div>タスクがありません</div>
            : ranked.map((t, i) => {
                const score  = calcScore(t)
                const barPct = Math.round(score / maxScore * 100)
                const col    = rankColor(i)
                return (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--bg2)', marginBottom: 8,
                  }}>
                    <div style={{ fontSize: 18, width: 28, flexShrink: 0 }}>{MEDALS[i] ?? `${i + 1}.`}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 500, marginBottom: 4,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', gap: 8, marginBottom: 5 }}>
                        {t.importance && <span>重要度 {t.importance}</span>}
                        {t.urgency    && <span>・緊急度 {t.urgency}</span>}
                        {t.dueDate    && <span>　📅 {t.dueDate}</span>}
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: 'var(--bg3)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${barPct}%`,
                          background: col, borderRadius: 2, transition: 'width .4s',
                        }} />
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500,
                      color: col, flexShrink: 0,
                    }}>{score}</div>
                  </div>
                )
              })
          }
        </>
      )}

      {/* ── A vs B view ── */}
      {view === 'avb' && (
        <>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
            2つを比べて「こっちが先！」を選ぶだけで順位が決まります。
          </p>

          {!avbDone && avbQueue.length > 0 && (
            <>
              {/* progress */}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 11, color: 'var(--muted)', marginBottom: 5,
                }}>
                  <span>比較 {avbIdx + 1} / {avbQueue.length}</span>
                  <span>{pct}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--bg3)' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: 'var(--accent)', borderRadius: 2, transition: 'width .3s',
                  }} />
                </div>
              </div>

              {/* pair cards */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {([taskA, taskB] as (Task | null | undefined)[]).map((t, i) =>
                  t ? (
                    <button
                      key={i}
                      onClick={() => choose(t.id)}
                      style={{
                        flex: 1, minHeight: 120, borderRadius: 12,
                        border: '1.5px solid var(--border2)', background: 'var(--bg2)',
                        padding: '20px 16px', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center', gap: 8,
                        transition: 'all .15s', fontFamily: 'var(--sans)',
                      }}
                      onMouseOver={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = 'var(--accent)'
                        el.style.background  = 'rgba(124,106,245,0.08)'
                      }}
                      onMouseOut={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = 'var(--border2)'
                        el.style.background  = 'var(--bg2)'
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{t.name}</div>
                      {t.dueDate && <div style={{ fontSize: 11, color: 'var(--muted)' }}>📅 {t.dueDate}</div>}
                      <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>こっちが先！</div>
                    </button>
                  ) : null
                )}
              </div>
            </>
          )}

          {avbDone && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)', marginBottom: 12 }}>
                ✅ 優先順位が決まりました！
              </div>
              {avbRanked.map(([id, score], i) => {
                const t   = tasks.find(t => t.id === parseInt(id))
                const col = rankColor(i)
                if (!t) return null
                return (
                  <div key={id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--bg2)', marginBottom: 8,
                  }}>
                    <div style={{ fontSize: 18 }}>{MEDALS[i] ?? `${i + 1}.`}</div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: col }}>{score}勝</div>
                  </div>
                )
              })}
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={startAvb}>
                もう一度
              </button>
            </div>
          )}

          {!avbQueue.length && (
            <div className="empty">
              <div className="empty-icon">⚡</div>タスクが2件以上必要です
            </div>
          )}
        </>
      )}
    </div>
  )
}