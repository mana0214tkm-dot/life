'use client'
import { useState } from 'react'
import { useStore }   from '@/store/useStore'
import type { BlockColor, Task, TimeBlock } from '@/types'

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 6–23

function pad(n: number) { return String(n).padStart(2, '0') }

export function TimeBlockSection() {
  const { tasks, blocks, addBlock, deleteBlock } = useStore()
  const undone = tasks.filter((t: Task) => !t.done)

  const now    = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()

  const [taskId, setTaskId] = useState('')
  const [name,   setName]   = useState('')
  const [startH, setStartH] = useState(pad(now.getHours()))
  const [startM, setStartM] = useState('00')
  const [endH,   setEndH]   = useState(pad(now.getHours() + 1))
  const [endM,   setEndM]   = useState('00')
  const [color,  setColor]  = useState<BlockColor>('')
  const [buffer, setBuffer] = useState(false)

  const onSelectTask = (id: string) => {
    setTaskId(id)
    const t = tasks.find((t: Task) => t.id === parseInt(id))
    if (!t) return
    setName(t.name)
    if (t.duration) {
      const sm = nowMin
      const em = sm + t.duration
      setStartH(pad(Math.floor(sm / 60) % 24))
      setStartM(sm % 60 >= 30 ? '30' : '00')
      setEndH(pad(Math.floor(em / 60) % 24))
      setEndM(em % 60 >= 30 ? '30' : '00')
    }
  }

  const handleAdd = () => {
    const finalName = name.trim() || undone.find((t: Task) => t.id === parseInt(taskId))?.name || ''
    if (!finalName) { alert('タスクを選ぶか名前を入力してください'); return }
    const startMin = parseInt(startH) * 60 + parseInt(startM)
    const endMin   = parseInt(endH)   * 60 + parseInt(endM)
    if (endMin <= startMin) { alert('終了は開始より後にしてください'); return }
    addBlock({
      name: finalName,
      start: `${startH}:${startM}`, end: `${endH}:${endM}`,
      duration: endMin - startMin,
      color, buffer,
      linkedTaskId: parseInt(taskId) || null,
    })
    setName(''); setTaskId(''); setColor(''); setBuffer(false)
  }

  const blockStyle = (c: BlockColor) =>
    c === 'green'  ? { bg: 'rgba(94,232,176,0.12)',  border: 'var(--green)',  text: 'var(--green)' }  :
    c === 'orange' ? { bg: 'rgba(245,162,106,0.12)', border: 'var(--orange)', text: 'var(--orange)' } :
                     { bg: 'rgba(124,106,245,0.18)', border: 'var(--accent)', text: 'var(--accent)' }

  return (
    <div>
      {/* ── form ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">ブロックを追加</div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <select
            value={taskId}
            onChange={e => onSelectTask(e.target.value)}
            style={{ flex: 2, minWidth: 160 }}
            aria-label="タスクを選択"
          >
            <option value="">── タスクから選ぶ ──</option>
            {undone.map((t: Task) => (
              <option key={t.id} value={t.id}>
                {t.priority === 'high' ? '🔴' : t.priority === 'mid' ? '🟡' : '🟢'} {t.name}
                {t.duration ? ` (${t.duration}分)` : ''}
              </option>
            ))}
          </select>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--muted)' }}>
            または
          </span>
          <input
            style={{ flex: 2, minWidth: 120 }}
            placeholder="直接入力"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-label="ブロック名を直接入力"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* start */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>開始</label>
            <select value={startH} onChange={e => setStartH(e.target.value)} style={{ width: 72 }} aria-label="開始時">
              {HOURS.map(h => <option key={h} value={pad(h)}>{pad(h)}時</option>)}
            </select>
            <span style={{ color: 'var(--muted)' }}>:</span>
            <select value={startM} onChange={e => setStartM(e.target.value)} style={{ width: 62 }} aria-label="開始分">
              <option value="00">00</option><option value="30">30</option>
            </select>
          </div>

          {/* end */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>終了</label>
            <select value={endH} onChange={e => setEndH(e.target.value)} style={{ width: 72 }} aria-label="終了時">
              {HOURS.map(h => <option key={h} value={pad(h)}>{pad(h)}時</option>)}
            </select>
            <span style={{ color: 'var(--muted)' }}>:</span>
            <select value={endM} onChange={e => setEndM(e.target.value)} style={{ width: 62 }} aria-label="終了分">
              <option value="00">00</option><option value="30">30</option>
            </select>
          </div>

          <select value={color} onChange={e => setColor(e.target.value as BlockColor)} style={{ width: 110 }} aria-label="カラー">
            <option value="">紫（集中）</option>
            <option value="green">緑（健康）</option>
            <option value="orange">橙（学習）</option>
          </select>

          <label style={{
            fontSize: 12, color: 'var(--muted)',
            display: 'flex', alignItems: 'center', gap: 5,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            <input
              type="checkbox"
              checked={buffer}
              onChange={e => setBuffer(e.target.checked)}
              style={{ width: 'auto' }}
            />
            バッファ15分
          </label>

          <button className="btn btn-primary btn-sm" onClick={handleAdd}>＋ 追加</button>
        </div>
      </div>

      {/* ── time grid ── */}
      <div>
        {HOURS.flatMap(h =>
          [0, 30].map(m => {
            const slotMin = h * 60 + m
            const isHour  = m === 0
            const label   = `${pad(h)}:${pad(m)}`

            const slotBlocks = blocks.filter((b: TimeBlock) => {
              const [bh, bm] = b.start.split(':').map(Number)
              return bh * 60 + bm === slotMin
            })

            const isNow = nowMin >= slotMin && nowMin < slotMin + 30

            return (
              <div
                key={`${h}-${m}`}
                style={{
                  display: 'flex', minHeight: isHour ? 48 : 36,
                  borderBottom: isHour
                    ? '1px solid rgba(255,255,255,0.07)'
                    : '1px dashed rgba(255,255,255,0.04)',
                  position: 'relative',
                }}
              >
                {/* time label */}
                <div style={{
                  width: 44, flexShrink: 0, textAlign: 'right',
                  padding: '5px 6px 0', fontFamily: 'var(--mono)',
                  fontSize: isHour ? 10 : 9,
                  color: isHour ? 'var(--muted)' : 'rgba(107,107,128,0.5)',
                }}>{label}</div>

                {/* slot */}
                <div style={{ flex: 1, padding: '3px 6px', position: 'relative' }}>
                  {/* now line */}
                  {isNow && (
                    <div style={{
                      position: 'absolute', left: 0, right: 0, height: 2,
                      background: 'var(--danger)', zIndex: 5,
                      top: `${Math.round((nowMin - slotMin) / 30 * 100)}%`,
                    }}>
                      <div style={{
                        width: 8, height: 8, background: 'var(--danger)',
                        borderRadius: '50%', position: 'absolute', left: -4, top: -3,
                      }} />
                    </div>
                  )}

                  {/* blocks */}
                  {slotBlocks.map((b: TimeBlock) => {
                    const s = blockStyle(b.color)
                    return (
                      <div key={b.id}>
                        <div style={{
                          background: s.bg, borderLeft: `3px solid ${s.border}`,
                          borderRadius: '0 4px 4px 0', padding: '3px 8px',
                          fontSize: 12, color: s.text, marginBottom: 3,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                          <span>{b.name}{b.duration ? ` (${b.duration}分)` : ''}</span>
                          <button
                            onClick={() => deleteBlock(b.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}
                          >✕</button>
                        </div>
                        {b.buffer && (
                          <div style={{
                            background: 'rgba(107,107,128,0.1)',
                            borderLeft: '3px solid var(--muted)',
                            borderRadius: '0 4px 4px 0', padding: '3px 8px',
                            fontSize: 11, color: 'var(--muted)', marginBottom: 3,
                          }}>🛡 バッファ 15分</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}