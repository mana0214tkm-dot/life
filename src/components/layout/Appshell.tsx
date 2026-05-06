'use client'
import { useState } from 'react'
import type { NavSection } from '@/types'
import { Sidebar }          from './Sidebar'
import { Header }           from './Header'
import { TodaySection }     from '@/features/Todaysection'
import { CalendarSection }  from '@/features/Calendarsection'
import { TimeBlockSection } from '@/features/Timeblocksection'
import { PrioritySection }  from '@/features/Prioritysection'
import { MatrixSection }    from '@/features/Matrixsection'
import { TrackerSection }   from '@/features/Trackersection'
import { NotListSection }   from '@/features/Notlistsection'
import { ReportSection }    from '@/features/Reportsection'
import { FocusOverlay }     from '@/features/Focusoverlay'

export const SECTION_TITLES: Record<NavSection, string> = {
  today:     '今日のタスク',
  calendar:  'カレンダー',
  timeblock: 'タイムブロック',
  priority:  '優先順位を決める',
  matrix:    'アイゼンハワーマトリクス',
  tracker:   'タイムトラッキング',
  notlist:   'やらないことリスト',
  report:    '達成グラフ・振り返り',
}

export function AppShell() {
  const [section,   setSection]   = useState<NavSection>('today')
  const [focusOpen, setFocusOpen] = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  const navigate = (s: NavSection) => { setSection(s); setMenuOpen(false) }

  return (
    <div className="app-shell">
      {/* dim overlay — tap to close sidebar on mobile */}
      <div
        className={`sidebar-overlay${menuOpen ? ' visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      <Sidebar
        current={section}
        onNav={navigate}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="app-main">
        <Header title={SECTION_TITLES[section]} onMenuOpen={() => setMenuOpen(true)} />

        <main className="main-content">
          {section === 'today'     && <TodaySection onFocusOpen={() => setFocusOpen(true)} />}
          {section === 'calendar'  && <CalendarSection />}
          {section === 'timeblock' && <TimeBlockSection />}
          {section === 'priority'  && <PrioritySection />}
          {section === 'matrix'    && <MatrixSection />}
          {section === 'tracker'   && <TrackerSection />}
          {section === 'notlist'   && <NotListSection />}
          {section === 'report'    && <ReportSection />}
        </main>
      </div>

      {focusOpen && <FocusOverlay onClose={() => setFocusOpen(false)} />}
    </div>
  )
}