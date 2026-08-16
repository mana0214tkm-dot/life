'use client'
import { useState } from 'react'
import { useStore } from '@/store/useStore'

export function NotListSection() {
  const { notItems, addNotItem, deleteNotItem } = useStore()
  const [text, setText] = useState('')

  const handleAdd = () => {
    if (!text.trim()) return
    addNotItem(text.trim())
    setText('')
  }

  return (
    <div>
      {/* input */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          aria-label="やらないことを入力"
          placeholder="やらないことを入力（例: 仕事中にSNSを見る）"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button className="btn btn-primary" onClick={handleAdd}>追加</button>
      </div>

      {/* list */}
      {notItems.length === 0
        ? (
          <div className="empty">
            <div className="empty-icon">🚫</div>
            まだありません
          </div>
        )
        : notItems.map(n => (
          <div key={n.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '9px 12px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg2)', marginBottom: 8,
          }}>
            <span style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'line-through' }}>
              {n.text}
            </span>
            <button className="btn-icon" onClick={() => deleteNotItem(n.id)}>✕</button>
          </div>
        ))
      }

      {/* tip */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title">💡 効果</div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          「何をしない」を決めることで、脳のリソースが本当に大事なことに集中できます。
          1日5〜10項目が理想的です。
        </p>
      </div>
    </div>
  )
}