import type { Task } from '../types'

export function calcScore(t: Task): number {
  const imp = t.importance || 3
  const urg = t.urgency || 3
  let deadline = 0
  if (t.dueDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = (new Date(t.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    deadline =
      diff <= 0  ? 10 :
      diff <= 1  ? 8  :
      diff <= 3  ? 6  :
      diff <= 7  ? 4  :
      diff <= 14 ? 2  : 1
  }
  return imp * urg + deadline
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export const TODAY_STR = new Date().toISOString().split('T')[0]

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

export const formatHMS = formatTime

export function priorityColor(priority: string): string {
  return priority === 'high' ? '#f56a6a' : priority === 'mid' ? '#f5a26a' : '#5ee8b0'
}

export function priorityLabel(priority: string): string {
  return priority === 'high' ? '高' : priority === 'mid' ? '中' : '低'
}

export const CAL_DAYS = ['日', '月', '火', '水', '木', '金', '土']
export const CAL_MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

export const STEP_TEMPLATES: Record<string, string[]> = {
  default: ['内容を確認する', '必要な情報を集める', '下書き・作業開始する', '見直し・仕上げる', '完了確認する'],
  report:  ['データを集める', '構成を考える', '書き始める', '見直し・修正する', '提出する'],
  mail:    ['宛先・件名を確認する', '要点を箇条書きする', '本文を書く', '読み返す', '送信する'],
}

export function getStepTemplate(name: string): string[] {
  if (name.includes('報告') || name.includes('レポート')) return STEP_TEMPLATES.report
  if (name.includes('メール') || name.includes('返信')) return STEP_TEMPLATES.mail
  return STEP_TEMPLATES.default
}
