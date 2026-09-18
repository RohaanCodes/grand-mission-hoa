// app/(pages)/board/RequestsSection.tsx
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid3x3, Grid2x2, Search, SlidersHorizontal, ChevronDown, ArrowLeft } from 'lucide-react'
import InternalRequestCard from './InternalRequestCard'
import RequestDetailDrawer from './RequestDetailDrawer'
import type { ServiceRequest } from '@/lib/types'

type SourceFilter = 'all' | 'mine' | 'board' | 'residents' | 'management'
type StatusFilter = 'open' | 'agent_in_progress' | 'awaiting_management' | 'awaiting_resident' | 'resolved' | 'closed_ai' | 'everything'
type ViewMode = 'compact' | 'comfortable'

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
  threadSummaries,
  viewerRole = 'board',
  backHref,
}: {
  requests: ServiceRequest[]
  currentEmail: string
  currentName?: string
  threadSummaries?: Record<number, { messageCount: number; participants: { name: string; email: string; photoUrl?: string }[] }>
  viewerRole?: 'board' | 'management'
  backHref?: string
}) {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open')
  // Default is the responsive 2→3→4 column grid ("compact"); the one
  // remaining toggle switches to a fixed 2-column, larger-card layout.
  const [viewMode, setViewMode] = useState<ViewMode>('compact')
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)

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

    result = [...result].sort((a, b) => {
      const aTime = a.submitted_date ? new Date(a.submitted_date).getTime() : 0
      const bTime = b.submitted_date ? new Date(b.submitted_date).getTime() : 0
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime
    })

    return result
  }, [requests, sourceFilter, statusFilter, currentEmail, searchTerm, sortOrder])

  const hasActiveFilters = sourceFilter !== 'all' || statusFilter !== 'open' || sortOrder !== 'newest'

  return (
    <div className="space-y-4">
      {/* Modern search bar + filter toggle, filters stay hidden until asked for */}
      <div className="flex items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            className="lg:hidden flex-shrink-0 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" strokeWidth={2} />
          </Link>
        )}

        <div className="relative flex-1">
          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center pointer-events-none">
            <Search className="w-4 h-4" strokeWidth={2.25} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search requests by category, description, requester, or address…"
            className="w-full bg-white border border-slate-200 rounded-full pl-14 pr-5 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-shadow"
          />
        </div>

        {/* The one remaining view toggle — compact (3-4 up) vs comfortable (2 up) */}
        <button
          onClick={() => setViewMode((v) => (v === 'compact' ? 'comfortable' : 'compact'))}
          title={viewMode === 'compact' ? 'Switch to 2-column layout' : 'Switch to default layout'}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          {viewMode === 'compact' ? (
            <Grid2x2 className="w-4.5 h-4.5" strokeWidth={2} />
          ) : (
            <Grid3x3 className="w-4.5 h-4.5" strokeWidth={2} />
          )}
        </button>

        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={`relative flex items-center gap-1.5 rounded-full px-5 py-3.5 text-sm font-semibold border shadow-sm transition-colors flex-shrink-0 ${
            filtersOpen
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && !filtersOpen && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
        </button>
      </div>

      {/* Collapsible filter panel — hidden by default */}
      <AnimatePresence initial={false}>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Source</p>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto scrollbar-hide max-w-full">
                  {SOURCE_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSourceFilter(tab.key)}
                      className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        sourceFilter === tab.key
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</p>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Sort</p>
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setSortOrder('newest')}
                      className={`px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                        sortOrder === 'newest' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => setSortOrder('oldest')}
                      className={`px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                        sortOrder === 'oldest' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Oldest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-slate-500">{filtered.length} of {requests.length} requests</p>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <p className="text-slate-600 text-sm">No requests match these filters.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 ${viewMode === 'compact' ? 'sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' : 'sm:grid-cols-2'}`}>
          {filtered.map((req, i) => (
            <InternalRequestCard
              key={req.id}
              req={req}
              index={i}
              currentName={currentName}
              currentEmail={currentEmail}
              onClick={() => setSelectedRequest(req)}
              size={viewMode === 'compact' ? 'default' : 'large'}
              threadSummary={req.request_id_number ? threadSummaries?.[req.request_id_number] : undefined}
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