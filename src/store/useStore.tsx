'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Task, TimeBlock, NotItem, TrackingEntry, FilterType } from '@/types'
import { calcScore, todayStr, getStepTemplate } from '@/lib/utils'

type AddTaskInput = Omit<Task, 'id' | 'done' | 'createdAt' | 'timeSpent' | 'steps'>

interface Store {
  tasks: Task[]
  addTask(data: AddTaskInput): void
  toggleTask(id: number): void
  deleteTask(id: number): void
  decompose(id: number): void
  toggleStep(id: number, stepIndex: number): void
  filtered(): Task[]
  overdue(): Task[]
  big3(): Task[]
  filter: FilterType
  setFilter(f: FilterType): void
  goalCount: number
  setGoal(n: number): void
  streakData: Record<string, boolean>
  blocks: TimeBlock[]
  addBlock(data: Omit<TimeBlock, 'id'>): void
  deleteBlock(id: number): void
  notItems: NotItem[]
  addNotItem(text: string): void
  deleteNotItem(id: number): void
  tracking: TrackingEntry[]
  addTimeSpent(id: number, seconds: number): void
  addTracking(entry: TrackingEntry): void
}

const Ctx = createContext<Store | null>(null)

function load<T>(key: string, init: T): T {
  try {
    const raw = localStorage.getItem(`sched_${key}`)
    if (raw) return JSON.parse(raw) as T
  } catch {}
  return init
}

function save<T>(key: string, val: T): void {
  try { localStorage.setItem(`sched_${key}`, JSON.stringify(val)) } catch {}
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks,      setTasksState]    = useState<Task[]>(() => load('tasks', []))
  const [blocks,     setBlocksState]   = useState<TimeBlock[]>(() => load('blocks', []))
  const [notItems,   setNotItemsState] = useState<NotItem[]>(() => load('notItems', []))
  const [tracking,   setTrackingState] = useState<TrackingEntry[]>(() => load('tracking', []))
  const [filter,     setFilterState]   = useState<FilterType>(() => load<FilterType>('filter', 'all'))
  const [goalCount,  setGoalState]     = useState<number>(() => load('goal', 3))
  const [streakData, setStreakState]   = useState<Record<string, boolean>>(() => load('streak', {}))

  const setTasks    = (v: Task[])                  => { setTasksState(v);    save('tasks',    v) }
  const setBlocks   = (v: TimeBlock[])             => { setBlocksState(v);   save('blocks',   v) }
  const setNotItems = (v: NotItem[])               => { setNotItemsState(v); save('notItems', v) }
  const setTracking = (v: TrackingEntry[])         => { setTrackingState(v); save('tracking', v) }
  const setFilter   = (v: FilterType)              => { setFilterState(v);   save('filter',   v) }
  const setGoal     = (v: number)                  => { setGoalState(v);     save('goal',     v) }
  const setStreak   = (v: Record<string, boolean>) => { setStreakState(v);   save('streak',   v) }

  const addTask = (data: AddTaskInput) => {
    setTasks([...tasks, {
      ...data, id: Date.now(), done: false,
      createdAt: new Date().toISOString(), timeSpent: 0, steps: [],
    }])
  }

  const toggleTask = (id: number) => {
    const next = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(next)
    if (next.find(t => t.id === id)?.done) {
      setStreak({ ...streakData, [todayStr()]: true })
    }
  }

  const deleteTask = (id: number) => setTasks(tasks.filter(t => t.id !== id))

  const decompose = (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task || task.steps.length > 0) return
    const steps = getStepTemplate(task.name).map(text => ({ text, done: false }))
    setTasks(tasks.map(t => t.id === id ? { ...t, steps } : t))
  }

  const toggleStep = (id: number, stepIndex: number) => {
    setTasks(tasks.map(t =>
      t.id !== id ? t : {
        ...t,
        steps: t.steps.map((s, i) => i === stepIndex ? { ...s, done: !s.done } : s),
      }
    ))
  }

  const filtered = (): Task[] => {
    const today = todayStr()
    switch (filter) {
      case 'high':   return tasks.filter(t => t.priority === 'high')
      case 'undone': return tasks.filter(t => !t.done)
      case 'done':   return tasks.filter(t => t.done)
      case 'today':  return tasks.filter(t => t.dueDate === today)
      case 'daily':  return tasks.filter(t => t.repeat === 'daily')
      case 'weekly': return tasks.filter(t => t.repeat === 'weekly')
      case 'score':  return [...tasks].sort((a, b) => calcScore(b) - calcScore(a))
      default:       return tasks
    }
  }

  const overdue = (): Task[] => {
    const now = new Date()
    return tasks.filter(t =>
      !t.done && t.dueDate &&
      new Date(t.dueDate + (t.dueTime ? 'T' + t.dueTime : '')) < now
    )
  }

  const big3 = (): Task[] =>
    [...tasks].filter(t => !t.done).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 3)

  const addBlock    = (data: Omit<TimeBlock, 'id'>) => setBlocks([...blocks, { id: Date.now(), ...data }])
  const deleteBlock = (id: number) => setBlocks(blocks.filter(b => b.id !== id))

  const addNotItem    = (text: string) => setNotItems([...notItems, { id: Date.now(), text }])
  const deleteNotItem = (id: number)   => setNotItems(notItems.filter(n => n.id !== id))

  const addTimeSpent = (id: number, seconds: number) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, timeSpent: t.timeSpent + seconds } : t))

  const addTracking = (entry: TrackingEntry) =>
    setTracking([entry, ...tracking].slice(0, 50))

  return (
    <Ctx.Provider value={{
      tasks, addTask, toggleTask, deleteTask, decompose, toggleStep,
      filtered, overdue, big3,
      filter, setFilter, goalCount, setGoal,
      streakData, blocks, addBlock, deleteBlock,
      notItems, addNotItem, deleteNotItem,
      tracking, addTimeSpent, addTracking,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useStore(): Store {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
