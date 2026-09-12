// app/(pages)/board/RequestsSection.tsx
'use client'
import { useState, useMemo } from 'react'
import { ListChecks, Rows3, LayoutGrid, List, Search } from 'lucide-react'
import InternalRequestCard from './InternalRequestCard'
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

export default function RequestsSection({
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
  const [viewMode, setViewMode] = useState<ViewMode>('grid1')
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

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
    result = result.filter((r) => matchesStatus(r.status, statusFilter))

    const query = searchTerm.trim().toLowerCase()
    if (query) {
      result = result.filter((r) => {
        const haystack = [
          r.final_category,
          r.category_resident_selected,
          r.description,
          r.requester_name,
          r.unit_address,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(query)
      })
    }

    return result
  }, [requests, sourceFilter, statusFilter, currentEmail, searchTerm])

  return (
    // No outer padded wrapper: the control bar and the card grid are now
    // siblings sitting directly in the page's own container, instead of
    // both being squeezed inside a second padded box on top of the page's
    // own padding.
    <div className="space-y-4">
      <div className="bg-blue-600 rounded-2xl px-5 sm:px-6 py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center">
            <ListChecks className="w-4 h-4" strokeWidth={2} />
          </span>
          <h2 className="text-base font-semibold text-white">Requests</h2>
          <span className="text-xs text-blue-100">{filtered.length} of {requests.length}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-1 bg-white/15 rounded-lg p-1 overflow-x-auto scrollbar-hide max-w-full">
            {SOURCE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSourceFilter(tab.key)}
                className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  sourceFilter === tab.key
                    ? 'bg-white text-blue-700'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-white/15 border border-white/20 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/40 [&>option]:text-slate-900"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-white/15 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid1')}
              title="One column"
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid1' ? 'bg-white text-blue-600' : 'text-white/70 hover:bg-white/10'}`}
            >
              <Rows3 className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => setViewMode('grid2')}
              title="Two columns"
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid2' ? 'bg-white text-blue-600' : 'text-white/70 hover:bg-white/10'}`}
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Compact list"
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600' : 'text-white/70 hover:bg-white/10'}`}
            >
              <List className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" strokeWidth={2} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by category, description, requester, or address…"
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <p className="text-slate-600 text-sm">No requests match these filters.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
          {filtered.map((req) => (
            <RequestListRow
              key={req.id}
              req={req}
              onClick={() => setSelectedRequest(req)}
              isSelected={selectedRequest?.id === req.id}
              currentEmail={currentEmail}
              currentName={currentName}
            />
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 ${viewMode === 'grid2' ? 'xl:grid-cols-2' : ''}`}>
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