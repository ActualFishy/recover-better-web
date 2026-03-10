import type { RecoverySession } from '../lib/sessionLogging'

interface SessionHistoryListProps {
  sessions: RecoverySession[]
}

export default function SessionHistoryList({ sessions }: SessionHistoryListProps) {
  if (sessions.length === 0) {
    return (
      <p className="history-list__empty">
        No recovery sessions logged yet for this week.
      </p>
    )
  }

  return (
    <section aria-label="Recovery sessions this week">
      <h3 className="history-list__title">This week&apos;s sessions</h3>
      <ul className="history-list">
        {sessions.map((s) => {
          const date = new Date(s.dateTime)
          const dateLabel = date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })

          return (
            <li key={s.sessionId} className="history-list__item">
              <div className="history-list__item-main">
                <span className="history-list__item-date">{dateLabel}</span>
                <span className="history-list__item-region">
                  {s.bodyRegion} · {s.trainingContext}
                </span>
              </div>
              <div className="history-list__item-meta">
                <span>{s.routineName}</span>
                <span>{s.durationMinutes} min</span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

