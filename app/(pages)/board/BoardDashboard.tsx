// app/(pages)/board/BoardDashboard.tsx
'use client'
import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Inbox, Clock, CheckCircle2, BarChart3, ListChecks, ChevronDown, Rows3, LayoutGrid, List } from 'lucide-react'
import InternalRequestCard from './InternalRequestCard'
import InsightsPanel from './InsightsPanel'
import TimelineChart from './TimelineChart'
import DuplicatesPanel from './DuplicatesPanel'
import RequestListRow from './RequestListRow'
import RequestDetailDrawer from './RequestDetailDrawer'
import type { ServiceRequest } from '@/lib/types'

type SourceFilter = 'all' | 'mine' | 'board' | 'residents' | 'management'
type StatusFilter = 'open' | 'agent_in_progress' | 'awaiting_management' | 'awaiting_resident' | 'resolved' | 'closed_ai' | 'everything'
type ViewMode = 'grid1' | 'grid2' | 'list'

const SOURCE_TABS: { key: SourceFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'mine', label: 'Mine' },
  { key: 'board', label: 'Board' },
  { key: 'residents', label: 'Residents' },
  { key: 'management', label: 'Management' },
]

const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: 'open', label: 'Open (not yet resolved)' },
  { key: 'agent_in_progress', label: 'In Progress' },
  { key: 'awaiting_management', label: 'Awaiting Management Response' },
  { key: 'awaiting_resident', label: 'Awaiting Info From Resident' },
  { key: 'resolved', label: 'Resolved / Closed (Verified)' },
  { key: 'closed_ai', label: 'Closed Automatically by AI' },
  { key: 'everything', label: 'Everything (Including Closed)' },
]

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']

function matchesStatus(status: string | undefined, filter: StatusFilter): boolean {
  const s = status || 'New'
  switch (filter) {
    case 'open': return !CLOSED_STATUSES.includes(s)
    case 'agent_in_progress': return s === 'Agent In Progress'
    case 'awaiting_management': return s === 'Awaiting Management Response'
    case 'awaiting_resident': return s === 'Awaiting Resident Info'
    case 'resolved': return s === 'Resolved' || s === 'Closed'
    case 'closed_ai': return s === 'Closed (AI)'
    case 'everything': return true
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open')
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid1')
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)

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
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={<Inbox className="w-5 h-5" strokeWidth={1.75} />} value={requests.length} label="Total" tone="primary" />
        <StatCard icon={<Clock className="w-5 h-5" strokeWidth={1.75} />} value={openCount} label="Open" tone="accent" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />} value={closedCount} label="Closed" tone="secondary" />
      </div>

      <DuplicatesPanel requests={requests} />

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setAnalyticsOpen((v) => !v)}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="w-4 h-4" strokeWidth={2} />
            </span>
            <h2 className="font-serif text-base text-primary">Analytics</h2>
            <span className="text-xs text-foreground/40 hidden sm:inline">{analyticsOpen ? 'Click to hide' : 'Click to show'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-foreground/50 transition-transform flex-shrink-0 ${analyticsOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {analyticsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-5 sm:p-6 border-t border-border">
                <InsightsPanel requests={requests} />
                <div className="mt-6 pt-6 border-t border-border">
                  <TimelineChart requests={requests} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-border flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ListChecks className="w-4 h-4" strokeWidth={2} />
            </span>
            <h2 className="font-serif text-base text-primary">Requests</h2>
            <span className="text-xs text-foreground/40">{filtered.length} of {requests.length}</span>
          </div>
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

            {/* VIEW MODE TOGGLE */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid1')}
                title="One column"
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid1' ? 'bg-card shadow-sm text-primary' : 'text-foreground/40 hover:text-foreground/60'}`}
              >
                <Rows3 className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('grid2')}
                title="Two columns"
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid2' ? 'bg-card shadow-sm text-primary' : 'text-foreground/40 hover:text-foreground/60'}`}
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="Compact list"
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-card shadow-sm text-primary' : 'text-foreground/40 hover:text-foreground/60'}`}
              >
                <List className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {filtered.length === 0 ? (
            <div className="bg-muted/50 rounded-lg p-10 text-center">
              <p className="text-foreground/50 text-sm">No requests match these filters.</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="divide-y divide-border">
              {filtered.map((req) => (
                <RequestListRow
                  key={req.id}
                  req={req}
                  onClick={() => setSelectedRequest(req)}
                  isSelected={selectedRequest?.id === req.id}
                />
              ))}
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-3 ${viewMode === 'grid2' ? 'xl:grid-cols-2' : ''}`}>
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
        </div>
      </div>

      <RequestDetailDrawer
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        viewerRole={viewerRole}
        currentName={currentName}
        currentEmail={currentEmail}
      />
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
    primary: 'bg-primary/8 border-primary/15',
    accent: 'bg-accent/12 border-accent/25',
    secondary: 'bg-secondary/10 border-secondary/20',
  }[tone]

  const iconClasses = {
    primary: 'bg-primary text-primary-foreground',
    accent: 'bg-[#c9a961] text-white',
    secondary: 'bg-secondary text-secondary-foreground',
  }[tone]

  const valueClasses = {
    primary: 'text-primary',
    accent: 'text-[#8a6d2f]',
    secondary: 'text-secondary',
  }[tone]

  return (
    <div className={`border rounded-xl p-4 flex items-center gap-3.5 shadow-sm ${toneClasses}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClasses}`}>
        {icon}
      </div>
      <div>
        <p className={`font-serif text-xl leading-none mb-1 ${valueClasses}`}>{value}</p>
        <p className="text-xs uppercase tracking-wide text-foreground/50">{label}</p>
      </div>
    </div>
  )
}