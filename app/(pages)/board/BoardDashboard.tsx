// app/(pages)/board/BoardDashboard.tsx
'use client'
import { Inbox, Clock, AlertCircle, CheckCircle2, TrendingUp, Star, Copy, ListChecks } from 'lucide-react'
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

  return (
    <div className="space-y-6">
      {/* Hero metric strip: the one place a card + shadow genuinely earns it */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <Stat icon={<Inbox className="w-4 h-4" />} value={requests.length} label="Total Requests" sub={`+${thisMonthCount} this month`} tone="slate" />
          <Stat icon={<Clock className="w-4 h-4" />} value={openCount} label="Open" sub={`${openPct}% of total`} tone="blue" />
          <Stat icon={<AlertCircle className="w-4 h-4" />} value={waitingCount} label="Needs Attention" sub="awaiting a response" tone="amber" />
          <Stat icon={<CheckCircle2 className="w-4 h-4" />} value={closedCount} label="Closed" sub={`${closedPct}% resolved`} tone="emerald" />
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

        <div className="lg:col-span-3 bg-white border-l-4 border-l-amber-400 border-y border-r border-slate-200 rounded-2xl px-6 py-5">
          <SectionHeader icon={<Star className="w-4.5 h-4.5" />} tone="amber" title="Needs Your Attention" />
          <StarredPanel requests={requests} currentEmail={currentEmail} currentName={currentName} viewerRole={viewerRole} />
        </div>
      </div>

      {duplicateCount > 0 && (
        <div className="bg-white border-l-4 border-l-amber-400 border-y border-r border-slate-200 rounded-2xl px-6 py-5">
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
    amber: 'bg-amber-50 text-amber-600',
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

function Stat({
  icon,
  value,
  label,
  sub,
  tone,
}: {
  icon: React.ReactNode
  value: number
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
      <div className={`flex items-center gap-1.5 mb-1 ${toneClass}`}>
        {icon}
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{sub}</p>
    </div>
  )
}