// app/(pages)/board/BoardDashboard.tsx
'use client'
import { useState, useMemo } from 'react'
import { Inbox, Clock, CheckCircle2, BarChart3, ListChecks } from 'lucide-react'
import RequestsList from '../profile/RequestsList'
import InsightsPanel from './InsightsPanel'
import type { ServiceRequest } from '@/lib/types'

type Filter = 'all' | 'mine' | 'board' | 'residents' | 'management'

const TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'mine', label: 'Mine' },
  { key: 'board', label: 'Board' },
  { key: 'residents', label: 'Residents' },
  { key: 'management', label: 'Management' },
]

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']

export default function BoardDashboard({
  requests,
  currentEmail,
  currentName,
  enableQueries = false,
viewerRole = 'board',
}: {
  requests: ServiceRequest[]
  currentEmail: string
  currentName?: string
  enableQueries?: boolean
  viewerRole?: 'board' | 'management'
}) {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    switch (filter) {
      case 'mine':
        return requests.filter((r) => r.requester_email?.toLowerCase() === currentEmail.toLowerCase())
      case 'board':
        return requests.filter((r) => r.submitted_via === 'Board Member')
      case 'residents':
        return requests.filter((r) => r.submitted_via === 'Resident')
      case 'management':
        return requests.filter((r) => r.submitted_via === 'Management Company')
      default:
        return requests
    }
  }, [requests, filter, currentEmail])

  const openCount = requests.filter((r) => !CLOSED_STATUSES.includes(r.status || '')).length
  const closedCount = requests.length - openCount

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ANALYTICS ISLAND */}
      <Panel icon={<BarChart3 className="w-4 h-4" strokeWidth={2} />} title="Analytics">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <StatCard icon={<Inbox className="w-5 h-5" strokeWidth={1.75} />} value={requests.length} label="Total" tone="primary" />
          <StatCard icon={<Clock className="w-5 h-5" strokeWidth={1.75} />} value={openCount} label="Open" tone="accent" />
          <StatCard icon={<CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />} value={closedCount} label="Closed" tone="secondary" />
        </div>
        <InsightsPanel requests={requests} />
      </Panel>

      {/* REQUESTS ISLAND */}
      <Panel
        icon={<ListChecks className="w-4 h-4" strokeWidth={2} />}
        title="Requests"
        subtitle={`${filtered.length} of ${requests.length}`}
        headerRight={
          <div className="flex items-center gap-1 bg-white/30 backdrop-blur-md rounded-full p-1 overflow-x-auto scrollbar-hide max-w-full">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  filter === tab.key
                    ? 'bg-white/90 text-primary shadow-sm'
                    : 'text-foreground/55 hover:text-foreground/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      >
        <RequestsList
  requests={filtered}
  showRequester
  enableQueries={enableQueries}
  currentName={currentName}
  currentEmail={currentEmail}
  viewerRole={viewerRole}
/>
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
    <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden">
      <div className="px-5 sm:px-8 py-5 border-b border-white/50 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </span>
          <h2 className="font-serif text-lg text-primary">{title}</h2>
          {subtitle && <span className="text-xs text-foreground/40">{subtitle}</span>}
        </div>
        {headerRight}
      </div>
      <div className="p-5 sm:p-8">{children}</div>
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
    <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${toneClasses}`}>
        {icon}
      </div>
      <div>
        <p className="font-serif text-xl sm:text-2xl text-primary leading-none mb-1">{value}</p>
        <p className="text-xs uppercase tracking-wide text-foreground/50">{label}</p>
      </div>
    </div>
  )
}