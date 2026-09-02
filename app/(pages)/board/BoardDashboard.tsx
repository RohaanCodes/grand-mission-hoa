// app/(pages)/board/BoardDashboard.tsx
'use client'
import { useState, useMemo } from 'react'
import { Inbox, Clock, CheckCircle2, BarChart3, ListChecks } from 'lucide-react'
import InternalRequestCard from './InternalRequestCard'
import InsightsPanel from './InsightsPanel'
import type { ServiceRequest } from '@/lib/types'

type SourceFilter = 'all' | 'mine' | 'board' | 'residents' | 'management'
type StatusFilter = 'all' | 'open' | 'new' | 'agent_in_progress' | 'awaiting_management' | 'awaiting_resident' | 'resolved_closed'

const SOURCE_TABS: { key: SourceFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'mine', label: 'Mine' },
  { key: 'board', label: 'Board' },
  { key: 'residents', label: 'Residents' },
  { key: 'management', label: 'Management' },
]

const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Any status' },
  { key: 'open', label: 'Open (not closed)' },
  { key: 'new', label: 'New' },
  { key: 'agent_in_progress', label: 'In Progress' },
  { key: 'awaiting_management', label: 'Awaiting Management' },
  { key: 'awaiting_resident', label: 'Awaiting Resident Info' },
  { key: 'resolved_closed', label: 'Resolved / Closed' },
]

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']

function matchesStatus(status: string | undefined, filter: StatusFilter): boolean {
  const s = status || 'New'
  switch (filter) {
    case 'open': return !CLOSED_STATUSES.includes(s)
    case 'new': return s === 'New'
    case 'agent_in_progress': return s === 'Agent In Progress'
    case 'awaiting_management': return s === 'Awaiting Management Response'
    case 'awaiting_resident': return s === 'Awaiting Resident Info'
    case 'resolved_closed': return CLOSED_STATUSES.includes(s)
    default: return true
  }
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
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = useMemo(() => {
    let result = requests
    switch (sourceFilter) {
      case 'mine':
        result = result.filter((r) => r.requester_email?.toLowerCase() === currentEmail.toLowerCase())
        break
      case 'board':
        result = result.filter((r) => r.submitted_via === 'Board Member')
        break
      case 'residents':
        result = result.filter((r) => r.submitted_via === 'Resident')
        break
      case 'management':
        result = result.filter((r) => r.submitted_via === 'Management Company')
        break
    }
    return result.filter((r) => matchesStatus(r.status, statusFilter))
  }, [requests, sourceFilter, statusFilter, currentEmail])

  const openCount = requests.filter((r) => !CLOSED_STATUSES.includes(r.status || '')).length
  const closedCount = requests.length - openCount

  return (
    <div className="space-y-5">
      {/* STATS ROW — no wrapping panel, just clean cards directly on the page */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={<Inbox className="w-5 h-5" strokeWidth={1.75} />} value={requests.length} label="Total" tone="primary" />
        <StatCard icon={<Clock className="w-5 h-5" strokeWidth={1.75} />} value={openCount} label="Open" tone="accent" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />} value={closedCount} label="Closed" tone="secondary" />
      </div>

      {/* ANALYTICS */}
      <Panel icon={<BarChart3 className="w-4 h-4" strokeWidth={2} />} title="Analytics">
        <InsightsPanel requests={requests} />
      </Panel>

      {/* REQUESTS */}
      <Panel
        icon={<ListChecks className="w-4 h-4" strokeWidth={2} />}
        title="Requests"
        subtitle={`${filtered.length} of ${requests.length}`}
        headerRight={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center gap-1 bg-primary/8 rounded-lg p-1 overflow-x-auto scrollbar-hide max-w-full">
              {SOURCE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSourceFilter(tab.key)}
                  className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    sourceFilter === tab.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-primary/60 hover:bg-primary/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="bg-accent/15 border border-accent/30 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-[#8a6d2f] focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-10 text-center">
            <p className="text-foreground/50 text-sm">No requests match these filters.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((req, i) => (
              <InternalRequestCard
                key={req.id}
                req={req}
                index={i}
                viewerRole={viewerRole}
                currentName={currentName}
                currentEmail={currentEmail}
              />
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

function Panel({
  icon,
  title,
  subtitle,
  headerRight,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  headerRight?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-border flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </span>
          <h2 className="font-serif text-base text-primary">{title}</h2>
          {subtitle && <span className="text-xs text-foreground/40">{subtitle}</span>}
        </div>
        {headerRight}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode
  value: number
  label: string
  tone: 'primary' | 'accent' | 'secondary'
}) {
  const toneClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/15 text-[#b8985a]',
    secondary: 'bg-secondary/10 text-secondary',
  }[tone]

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${toneClasses}`}>
        {icon}
      </div>
      <div>
        <p className="font-serif text-xl text-primary leading-none mb-1">{value}</p>
        <p className="text-xs uppercase tracking-wide text-foreground/50">{label}</p>
      </div>
    </div>
  )
}