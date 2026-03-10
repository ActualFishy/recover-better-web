import { render, screen } from '@testing-library/react'
import * as sessionLogging from '../lib/sessionLogging'
import * as weeklySummary from '../lib/weeklySummary'
import * as sessionsExport from '../lib/sessionsExport'
import WeeklySummaryView from './WeeklySummaryView'

jest.mock('../lib/sessionLogging')
jest.mock('../lib/weeklySummary')
jest.mock('../lib/sessionsExport', () => ({
  buildCsvForCurrentUser: jest.fn(() => 'csv-content'),
}))

const mockGetSessionsForCurrentUser = sessionLogging.getSessionsForCurrentUser as jest.MockedFunction<
  typeof sessionLogging.getSessionsForCurrentUser
>
const mockGetCurrentWeekRange = weeklySummary.getCurrentWeekRange as jest.MockedFunction<
  typeof weeklySummary.getCurrentWeekRange
>
const mockComputeWeeklySummary = weeklySummary.computeWeeklySummary as jest.MockedFunction<
  typeof weeklySummary.computeWeeklySummary
>
const mockBuildCsvForCurrentUser = sessionsExport.buildCsvForCurrentUser as jest.Mock

describe('WeeklySummaryView', () => {
  beforeEach(() => {
    mockGetSessionsForCurrentUser.mockReset()
    mockGetCurrentWeekRange.mockReset()
    mockComputeWeeklySummary.mockReset()
    mockBuildCsvForCurrentUser.mockReset()

    mockGetCurrentWeekRange.mockReturnValue({
      start: new Date('2026-03-04T00:00:00.000Z'),
      end: new Date('2026-03-11T23:59:59.999Z'),
    })
  })

  it('shows empty state when there are no sessions', () => {
    mockGetSessionsForCurrentUser.mockReturnValue([])
    mockComputeWeeklySummary.mockReturnValue({
      totalSessions: 0,
      totalRecoverySeconds: 0,
      topBodyRegions: [],
      trainingContextCounts: {},
      sessionsByDay: {},
    })

    render(<WeeklySummaryView onClose={() => {}} />)

    expect(
      screen.getByText(/No recovery sessions logged yet this week/i)
    ).toBeInTheDocument()
  })

  it('renders metrics and history when sessions are present', () => {
    mockGetSessionsForCurrentUser.mockReturnValue([
      {
        userId: 'user@example.com',
        sessionId: 's1',
        dateTime: '2026-03-08T10:00:00.000Z',
        trainingContext: 'sprint',
        bodyRegion: 'hamstring',
        side: 'both',
        sensationType: 'tight',
        routineId: 'routine-hip',
        routineName: 'Hip recovery',
        durationMinutes: 5,
        totalDurationSeconds: 300,
        exerciseIds: ['figure-four'],
      },
    ])
    mockComputeWeeklySummary.mockReturnValue({
      totalSessions: 1,
      totalRecoverySeconds: 300,
      topBodyRegions: [{ region: 'hamstring', count: 1 }],
      trainingContextCounts: { sprint: 1 },
      sessionsByDay: { '2026-03-08': 1 },
    })

    render(<WeeklySummaryView onClose={() => {}} />)

    expect(screen.getByRole('heading', { name: /This week in recovery/i })).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getAllByText(/5 min/)).toHaveLength(2)
    expect(screen.getAllByText(/hamstring/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('heading', { name: /This week's sessions/i })).toBeInTheDocument()
  })

  it('calls CSV export helper when Download CSV is clicked', () => {
    mockGetSessionsForCurrentUser.mockReturnValue([
      {
        userId: 'user@example.com',
        sessionId: 's1',
        dateTime: '2026-03-08T10:00:00.000Z',
        trainingContext: 'sprint',
        bodyRegion: 'hamstring',
        side: 'both',
        sensationType: 'tight',
        routineId: 'routine-hip',
        routineName: 'Hip recovery',
        durationMinutes: 5,
        totalDurationSeconds: 300,
        exerciseIds: ['figure-four'],
      },
    ])
    mockComputeWeeklySummary.mockReturnValue({
      totalSessions: 1,
      totalRecoverySeconds: 300,
      topBodyRegions: [{ region: 'hamstring', count: 1 }],
      trainingContextCounts: { sprint: 1 },
      sessionsByDay: { '2026-03-08': 1 },
    })
    mockBuildCsvForCurrentUser.mockReturnValue('csv-content')

    render(<WeeklySummaryView onClose={() => {}} />)

    // Stub URL methods for this test environment.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(URL as any).createObjectURL = jest.fn(() => 'blob:mock-url')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(URL as any).revokeObjectURL = jest.fn()

    const exportButton = screen.getByRole('button', { name: /Download CSV/i })
    exportButton.click()
    expect(mockBuildCsvForCurrentUser).toHaveBeenCalled()
  })
})

