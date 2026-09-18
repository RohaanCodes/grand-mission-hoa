// app/(pages)/board/BoardDashboard.tsx
'use client'
import { useMemo, useState } from 'react'
import { Inbox, Clock, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Minus, Star, Copy, Timer } from 'lucide-react'
import DuplicatesPanel from './DuplicatesPanel'
import StarredPanel from './StarredPanel'
import TimelineChart from './TimelineChart'
import type { ServiceRequest } from '@/lib/types'

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']
const WAITING_STATUSES = ['Awaiting Management Response', 'Awaiting Resident Info', 'Board Notified']

const PERIOD_OPTIONS = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 365, label: '365 days' },
]

function withinDays(dateStr: string | undefined, days: number, now: Date): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - days)
  return d >= cutoff && d <= now
}

export default function BoardDashboard({
  requests,
  currentEmail,
  currentName = '',
  viewerRole = 'board',
}: {
  requests: ServiceRequest[]
  currentEmail: string
  currentName?: string
  viewerRole?: 'board' | 'management'
}) {
  const [periodDays, setPeriodDays] = useState<number>(7)
  const duplicateCount = requests.filter((r) => r.possible_duplicate).length

  const kpis = useMemo(() => {
    const now = new Date()

    const submittedInPeriod = requests.filter((r) => withinDays(r.submitted_date, periodDays, now))
    const totalInPeriod = submittedInPeriod.length
    const openInPeriod = submittedInPeriod.filter((r) => !CLOSED_STATUSES.includes(r.status || '')).length
    const waitingInPeriod = submittedInPeriod.filter((r) => WAITING_STATUSES.includes(r.status || '')).length

    const closedInPeriod = requests.filter((r) => withinDays(r.closed_date, periodDays, now))
    const closedCount = closedInPeriod.length

    const closedWithDates = closedInPeriod.filter((r) => r.submitted_date && r.closed_date)
    const avgCloseDays = closedWithDates.length > 0
      ? Math.round(
          closedWithDates.reduce((sum, r) => {
            const d = (new Date(r.closed_date!).getTime() - new Date(r.submitted_date!).getTime()) / 86400000
            return sum + Math.max(d, 0)
          }, 0) / closedWithDates.length
        )
      : null

    const prevStart = new Date(now)
    prevStart.setDate(prevStart.getDate() - periodDays * 2)
    const prevEnd = new Date(now)
    prevEnd.setDate(prevEnd.getDate() - periodDays)
    const closedPrevPeriod = requests.filter((r) => {
      if (!r.closed_date) return false
      const d = new Date(r.closed_date)
      return d >= prevStart && d < prevEnd
    }).length

    let closingTrend: { direction: 'up' | 'down' | 'flat'; percent: number | null } = { direction: 'flat', percent: null }
    if (closedPrevPeriod > 0) {
      const pct = Math.round(((closedCount - closedPrevPeriod) / closedPrevPeriod) * 100)
      closingTrend = { direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat', percent: pct }
    } else if (closedCount > 0) {
      closingTrend = { direction: 'up', percent: null }
    }

    return {
      totalInPeriod,
      openInPeriod,
      openPct: totalInPeriod > 0 ? Math.round((openInPeriod / totalInPeriod) * 100) : 0,
      waitingInPeriod,
      closedCount,
      closedPct: totalInPeriod > 0 ? Math.round((closedCount / totalInPeriod) * 100) : 0,
      avgCloseDays,
      closingTrend,
    }
  }, [requests, periodDays])

  const periodLabel = PERIOD_OPTIONS.find((p) => p.days === periodDays)?.label ?? '7 days'

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-end gap-3 mb-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => setPeriodDays(opt.days)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  periodDays === opt.days ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard icon={<Inbox className="w-4.5 h-4.5" />} value={kpis.totalInPeriod} label="Total Requests" sub={`in the last ${periodLabel}`} gradient="from-slate-500 to-slate-600" />
          <KpiCard icon={<Clock className="w-4.5 h-4.5" />} value={kpis.openInPeriod} label="Open" sub={`${kpis.openPct}% of period`} gradient="from-blue-400 to-blue-600" />
          <KpiCard icon={<AlertCircle className="w-4.5 h-4.5" />} value={kpis.waitingInPeriod} label="Needs Attention" sub="awaiting a response" gradient="from-amber-400 to-amber-600" />
          <KpiCard icon={<CheckCircle2 className="w-4.5 h-4.5" />} value={kpis.closedCount} label="Closed" sub={`${kpis.closedPct}% resolved`} gradient="from-emerald-400 to-emerald-500" />
          <KpiCard icon={<Timer className="w-4.5 h-4.5" />} value={kpis.avgCloseDays ?? '—'} label="Avg. Close Time" sub={kpis.avgCloseDays !== null ? (kpis.avgCloseDays === 1 ? 'day, on average' : 'days, on average') : 'no closures yet'} gradient="from-violet-400 to-violet-600" />
          <TrendKpiCard value={kpis.closedCount} label="Closing Rate" trend={kpis.closingTrend} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div>
          <TimelineChart requests={requests} periodDays={periodDays} />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 sm:px-6 py-5">
          <SectionHeader icon={<Star className="w-4.5 h-4.5" />} tone="amber" title="My Starred Items" />
          <StarredPanel requests={requests} currentEmail={currentEmail} currentName={currentName} viewerRole={viewerRole} />
        </div>
      </div>

      {duplicateCount > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl px-4 sm:px-6 py-5">
          <SectionHeader icon={<Copy className="w-4.5 h-4.5" />} tone="amber" title="Possible Duplicates" meta={`${duplicateCount} flagged for review`} />
          <DuplicatesPanel requests={requests} />
        </div>
      )}
    </div>
  )
}

function SectionHeader({
  icon,
  title,
  tone,
  meta,
}: {
  icon: React.ReactNode
  title: string
  tone: 'blue' | 'amber' | 'slate'
  meta?: string
}) {
  const iconClass = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-600',
  }[tone]

  return (
    <div className="flex items-center justify-between gap-2.5 mb-4 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-2.5">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass}`}>
          {icon}
        </span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {meta && <span className="text-xs text-slate-600 flex-shrink-0">{meta}</span>}
    </div>
  )
}

function KpiCard({
  icon,
  value,
  label,
  sub,
  gradient,
}: {
  icon: React.ReactNode
  value: number | string
  label: string
  sub: string
  gradient: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/90 leading-tight">{label}</span>
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
      </div>
      <p className="relative text-3xl font-bold leading-none mb-1.5">{value}</p>
      <p className="relative text-xs text-white/80">{sub}</p>
    </div>
  )
}

function TrendKpiCard({
  value,
  label,
  trend,
}: {
  value: number
  label: string
  trend: { direction: 'up' | 'down' | 'flat'; percent: number | null }
}) {
  const gradient = trend.direction === 'up' ? 'from-teal-400 to-teal-600' : trend.direction === 'down' ? 'from-rose-400 to-rose-600' : 'from-slate-400 to-slate-600'
  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus

  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/90 leading-tight">{label}</span>
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <TrendIcon className="w-4.5 h-4.5" />
        </span>
      </div>
      <p className="relative text-3xl font-bold leading-none mb-1.5">{value}</p>
      <p className="relative text-xs text-white/85 flex items-center gap-1">
        <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
        {trend.percent !== null ? `${Math.abs(trend.percent)}% vs prior period` : 'closed this period'}
      </p>
    </div>
  )
}