import { getSessionsForCurrentUser } from '../lib/sessionLogging'
import { getCurrentWeekRange, computeWeeklySummary } from '../lib/weeklySummary'
import { buildCsvForCurrentUser } from '../lib/sessionsExport'
import SessionHistoryList from './SessionHistoryList'

interface WeeklySummaryViewProps {
  onClose: () => void
}

function formatMinutes(totalSeconds: number): string {
  if (!totalSeconds) return '0 min'
  const minutes = Math.round(totalSeconds / 60)
  return `${minutes} min`
}

export default function WeeklySummaryView({ onClose }: WeeklySummaryViewProps) {
  const sessions = getSessionsForCurrentUser()
  const range = getCurrentWeekRange()
  const summary = computeWeeklySummary(sessions, range)

  const hasSessions = summary.totalSessions > 0

  return (
    <section className="weekly-summary" aria-label="Weekly recovery summary">
      <header className="weekly-summary__header">
        <h2 className="weekly-summary__title">This week in recovery</h2>
        <p className="weekly-summary__subtitle">
          A simple snapshot of how you&apos;ve been taking care of your body.
        </p>
        {hasSessions && (
          <button
            type="button"
            className="weekly-summary__export"
            onClick={() => {
              const csv = buildCsvForCurrentUser()
              // Best-effort client-side download; safe to no-op in tests.
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'recovery-sessions.csv'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
          >
            Download CSV
          </button>
        )}
        <button
          type="button"
          className="weekly-summary__close"
          onClick={onClose}
        >
          Back to assistant
        </button>
      </header>

      {hasSessions ? (
        <>
          <section className="weekly-summary__highlights" aria-label="Weekly metrics">
            <div className="weekly-summary__metric">
              <span className="weekly-summary__metric-label">Sessions</span>
              <span className="weekly-summary__metric-value">{summary.totalSessions}</span>
            </div>
            <div className="weekly-summary__metric">
              <span className="weekly-summary__metric-label">Time in recovery</span>
              <span className="weekly-summary__metric-value">
                {formatMinutes(summary.totalRecoverySeconds)}
              </span>
            </div>
            {summary.topBodyRegions[0] && (
              <div className="weekly-summary__metric">
                <span className="weekly-summary__metric-label">Most common tightness</span>
                <span className="weekly-summary__metric-value">
                  {summary.topBodyRegions[0].region}
                </span>
              </div>
            )}
          </section>

          <SessionHistoryList sessions={sessions} />
        </>
      ) : (
        <section className="weekly-summary__empty" aria-label="No sessions yet">
          <p>
            No recovery sessions logged yet this week. Log in and complete a guided routine to see
            your patterns here.
          </p>
        </section>
      )}
    </section>
  )
}

