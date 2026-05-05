export type Priority = 'high' | 'mid' | 'low'
export type RepeatType = '' | 'daily' | 'weekly'
export type Quadrant = '' | 'q1' | 'q2' | 'q3' | 'q4'
export type BlockColor = '' | 'accent2' | 'accent3'

export interface TaskStep {
  text: string
  done: boolean
}

export interface Task {
  id: number
  name: string
  priority: Priority
  repeat: RepeatType
  startTime: string
  dueDate: string
  dueTime: string
  duration: number
  quadrant: Quadrant
  memo: string
  importance: number  // 1-5
  urgency: number     // 1-5
  done: boolean
  createdAt: string
  timeSpent: number   // seconds
  steps: TaskStep[]
}

export interface TimeBlock {
  id: number
  name: string
  start: string   // "HH:MM"
  end: string     // "HH:MM"
  duration: number // minutes
  color: BlockColor
  buffer: boolean
  linkedTaskId: number | null
}

export interface NotItem {
  id: number
  text: string
}

export interface TrackingEntry {
  taskId: number
  taskName: string
  seconds: number
  date: string
  time: string
}

export type FilterType = 'all' | 'high' | 'undone' | 'done' | 'today' | 'daily' | 'weekly' | 'score'
export type NavSection =
  | 'today' | 'calendar' | 'timeblock' | 'priority'
  | 'matrix' | 'tracker' | 'notlist' | 'report'