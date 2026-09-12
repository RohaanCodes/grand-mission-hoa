// app/(pages)/board/BoardDashboard.tsx
'use client'
import { Inbox, Clock, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Minus, Star, Copy, ListChecks, Timer } from 'lucide-react'
import DuplicatesPanel from './DuplicatesPanel'
import StarredPanel from './StarredPanel'
import OverviewActivityChart from './OverviewActivityChart'
import RecentRequestsTable from './RecentRequestsTable'
import type { ServiceRequest } from '@/lib/types'

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']
const WAITING_STATUSES = ['Awaiting Management Response', 'Awaiting Resident Info', 'Board Notified']

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
  const openCount = requests.filter((r) => !CLOSED_STATUSES.includes(r.status || '')).length
  const closedCount = requests.length - openCount
  const waitingCount = requests.filter((r) => WAITING_STATUSES.includes(r.status || '')).length
  const duplicateCount = requests.filter((r) => r.possible_duplicate).length

  const now = new Date()
  const thisMonthCount = requests.filter((r) => {
    if (!r.submitted_date) return false
    const d = new Date(r.submitted_date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const openPct = requests.length > 0 ? Math.round((openCount / requests.length) * 100) : 0
  const closedPct = requests.length > 0 ? Math.round((closedCount / requests.length) * 100) : 0

  const closedWithDates = requests.filter((r) => CLOSED_STATUSES.includes(r.status || '') && r.submitted_date && r.closed_date)
  const avgCloseDays = closedWithDates.length > 0
    ? Math.round(
        closedWithDates.reduce((sum, r) => {
          const days = (new Date(r.closed_date!).getTime() - new Date(r.submitted_date!).getTime()) / 86400000
          return sum + Math.max(days, 0)
        }, 0) / closedWithDates.length
      )
    : null

  // Closing rate: how many requests were closed this month vs last month
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const closedThisMonth = requests.filter((r) => {
    if (!r.closed_date) return false
    const d = new Date(r.closed_date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const closedLastMonth = requests.filter((r) => {
    if (!r.closed_date) return false
    const d = new Date(r.closed_date)
    return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear()
  }).length

  let closingTrend: { direction: 'up' | 'down' | 'flat'; percent: number | null } = { direction: 'flat', percent: null }
  if (closedLastMonth > 0) {
    const pct = Math.round(((closedThisMonth - closedLastMonth) / closedLastMonth) * 100)
    closingTrend = { direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat', percent: pct }
  } else if (closedThisMonth > 0) {
    closingTrend = { direction: 'up', percent: null } // no baseline last month to compare against
  }

  return (
    <div className="space-y-6">
      {/* Hero metric strip: the one place a card + shadow genuinely earns it */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <Stat icon={<Inbox className="w-4 h-4" />} value={requests.length} label="Total Requests" sub={`+${thisMonthCount} this month`} tone="slate" />
          <Stat icon={<Clock className="w-4 h-4" />} value={openCount} label="Open" sub={`${openPct}% of total`} tone="blue" />
          <Stat icon={<AlertCircle className="w-4 h-4" />} value={waitingCount} label="Needs Attention" sub="awaiting a response" tone="amber" />
          <Stat icon={<CheckCircle2 className="w-4 h-4" />} value={closedCount} label="Closed" sub={`${closedPct}% resolved`} tone="emerald" />
          <Stat icon={<Timer className="w-4 h-4" />} value={avgCloseDays ?? '—'} label="Avg. Close Time" sub={avgCloseDays !== null ? (avgCloseDays === 1 ? 'day, on average' : 'days, on average') : 'no closed requests yet'} tone="slate" />
          <TrendStat value={closedThisMonth} label="Closing Rate" trend={closingTrend} />
        </div>
      </div>

      {/* Actionable items get a colored accent border, not a gray card,
          so they visually separate themselves from purely informational
          content below without everything looking the same. */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl px-6 py-5">
          <SectionHeader icon={<TrendingUp className="w-4.5 h-4.5" />} tone="slate" title="Activity" />
          <OverviewActivityChart requests={requests} />
        </div>

        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl px-6 py-5">
          <SectionHeader icon={<Star className="w-4.5 h-4.5" />} tone="amber" title="Starred Items" />
          <StarredPanel requests={requests} currentEmail={currentEmail} currentName={currentName} viewerRole={viewerRole} />
        </div>
      </div>

      {duplicateCount > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl px-6 py-5">
          <SectionHeader icon={<Copy className="w-4.5 h-4.5" />} tone="amber" title="Possible Duplicates" meta={`${duplicateCount} flagged for review`} />
          <DuplicatesPanel requests={requests} />
        </div>
      )}

      {/* Purely informational, no card shadow, just a plain bordered area */}
      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5">
        <SectionHeader icon={<ListChecks className="w-4.5 h-4.5" />} tone="slate" title="Recent Requests" />
        <RecentRequestsTable requests={requests} basePath={viewerRole === 'management' ? '/management' : '/board'} />
      </div>
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

  const dividerClass = 'border-slate-200'

  return (
    <div className={`flex items-center justify-between gap-2.5 mb-4 pb-4 border-b ${dividerClass}`}>
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

function Stat({
  icon,
  value,
  label,
  sub,
  tone,
}: {
  icon: React.ReactNode
  value: number | string
  label: string
  sub: string
  tone: 'slate' | 'blue' | 'amber' | 'emerald'
}) {
  const toneClass = {
    slate: 'text-slate-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    emerald: 'text-emerald-600',
  }[tone]

  return (
    <div className="px-4 py-3 sm:py-0 first:pl-0">
      <div className={`flex items-start gap-1.5 mb-1 min-h-[2rem] ${toneClass}`}>
        <span className="mt-0.5">{icon}</span>
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide leading-tight">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{sub}</p>
    </div>
  )
}

function TrendStat({
  value,
  label,
  trend,
}: {
  value: number
  label: string
  trend: { direction: 'up' | 'down' | 'flat'; percent: number | null }
}) {
  const trendColor = trend.direction === 'up' ? 'text-emerald-600' : trend.direction === 'down' ? 'text-red-600' : 'text-slate-500'
  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus

  return (
    <div className="px-4 py-3 sm:py-0 first:pl-0">
      <div className="flex items-start gap-1.5 mb-1 min-h-[2rem] text-slate-600">
        <TrendIcon className="w-4 h-4 mt-0.5" />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide leading-tight">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
      <p className={`text-xs mt-1 flex items-center gap-1 font-medium ${trendColor}`}>
        <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
        {trend.percent !== null ? `${Math.abs(trend.percent)}% vs last month` : 'closed this month'}
      </p>
    </div>
  )
}