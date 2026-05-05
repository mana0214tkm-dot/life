'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(`sched_${key}`)
      if (item) return JSON.parse(item)
    } catch {}
    return initialValue
  })
  const [loaded, setLoaded] = useState(() => {
    if (typeof window !== 'undefined') {
      return true
    }
    return false
  })

  const set = (val: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val
      try { localStorage.setItem(`sched_${key}`, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return [value, set, loaded] as const
}