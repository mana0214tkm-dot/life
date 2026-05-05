'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TimeBlock, NotItem, TrackingEntry, FilterType } from '@/types'
import { todayStr, calcScore, getStepTemplate } from '@/lib/utils'

interface AppState {
  tasks: Task[]
  blocks: TimeBlock[]
  notItems: NotItem[]
  tracking: TrackingEntry[]
  streakData: Record<string, number>
  filter: FilterType
  goalCount: number

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'timeSpent' | 'steps' | 'done'>) => void
  toggleTask: (id: number) => void
  deleteTask: (id: number) => void
  toggleStep: (taskId: number, stepIdx: number) => void
  decompose: (id: number) => void
  addTimeSpent: (id: number, seconds: number) => void
  setFilter: (f: FilterType) => void
  setGoal: (n: number) => void

  addBlock: (block: Omit<TimeBlock, 'id'>) => void
  deleteBlock: (id: number) => void

  addNotItem: (text: string) => void
  deleteNotItem: (id: number) => void

  addTracking: (entry: TrackingEntry) => void

  filtered: () => Task[]
  overdue: () => Task[]
  big3: () => Task[]
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      blocks: [],
      notItems: [],
      tracking: [],
      streakData: {},
      filter: 'all',
      goalCount: 3,

      addTask: (data) => set(s => ({
        tasks: [
          { ...data, id: Date.now(), done: false, createdAt: todayStr(), timeSpent: 0, steps: [] },
          ...s.tasks,
        ],
      })),

      toggleTask: (id) => set(s => {
        const task = s.tasks.find(t => t.id === id)
        const markingDone = task ? !task.done : false
        const today = todayStr()
        return {
          tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
          ...(markingDone && {
            streakData: { ...s.streakData, [today]: (s.streakData[today] || 0) + 1 },
          }),
        }
      }),

      deleteTask: (id) => set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

      toggleStep: (taskId, stepIdx) => set(s => ({
        tasks: s.tasks.map(t =>
          t.id !== taskId ? t : {
            ...t,
            steps: t.steps.map((st, i) => i === stepIdx ? { ...st, done: !st.done } : st),
          }
        ),
      })),

      decompose: (id) => set(s => ({
        tasks: s.tasks.map(t => {
          if (t.id !== id || t.steps.length > 0) return t
          return { ...t, steps: getStepTemplate(t.name).map(text => ({ text, done: false })) }
        }),
      })),

      addTimeSpent: (id, seconds) => set(s => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, timeSpent: t.timeSpent + seconds } : t),
      })),

      setFilter: (filter) => set({ filter }),
      setGoal: (goalCount) => set({ goalCount }),

      addBlock: (data) => set(s => ({
        blocks: [...s.blocks, { ...data, id: Date.now() }],
      })),
      deleteBlock: (id) => set(s => ({ blocks: s.blocks.filter(b => b.id !== id) })),

      addNotItem: (text) => set(s => ({
        notItems: [...s.notItems, { id: Date.now(), text }],
      })),
      deleteNotItem: (id) => set(s => ({ notItems: s.notItems.filter(n => n.id !== id) })),

      addTracking: (entry) => set(s => ({
        tracking: [entry, ...s.tracking].slice(0, 50),
      })),

      filtered: () => {
        const { tasks, filter } = get()
        const today = todayStr()
        switch (filter) {
          case 'high':   return tasks.filter(t => t.priority === 'high')
          case 'undone': return tasks.filter(t => !t.done)
          case 'done':   return tasks.filter(t => t.done)
          case 'today':  return tasks.filter(t => t.dueDate === today)
          case 'daily':  return tasks.filter(t => t.repeat === 'daily')
          case 'weekly': return tasks.filter(t => t.repeat === 'weekly')
          case 'score':  return [...tasks].filter(t => !t.done).sort((a, b) => calcScore(b) - calcScore(a))
          default:       return tasks
        }
      },

      overdue: () => {
        const { tasks } = get()
        const now = new Date()
        return tasks.filter(t =>
          !t.done && t.dueDate &&
          new Date(t.dueDate + (t.dueTime ? 'T' + t.dueTime : '')) < now
        )
      },

      big3: () => {
        const { tasks } = get()
        return [...tasks].filter(t => !t.done).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 3)
      },
    }),
    { name: 'fuwakira-schedule-v1' }
  )
)
