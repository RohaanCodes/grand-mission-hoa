// app/(pages)/board/StarredPanel.tsx
'use client'
import { useState, useEffect } from 'react'
import { Star, ChevronRight } from 'lucide-react'
import { getStarredIdsAction } from './starActions'
import RequestDetailDrawer from './RequestDetailDrawer'
import type { ServiceRequest } from '@/lib/types'

const STATUS_COLOR: Record<string, string> = {
  New: '#64748b',
  'Agent In Progress': '#d97706',
  'Awaiting Management Response': '#2563eb',
  'Awaiting Resident Info': '#9333ea',
  'Board Notified': '#d97706',
  Resolved: '#16a34a',
  Closed: '#16a34a',
  'Closed (AI)': '#16a34a',
}

export default function StarredPanel({
  requests,
  currentEmail,
  currentName,
  viewerRole,
}: {
  requests: ServiceRequest[]
  currentEmail: string
  currentName: string
  viewerRole: 'board' | 'management'
}) {
  const [starredIds, setStarredIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)

  useEffect(() => {
    getStarredIdsAction(currentEmail).then((ids) => {
      setStarredIds(ids)
      setLoading(false)
    })
  }, [currentEmail])

  if (loading) return null

  const starred = requests.filter((r) => starredIds.includes(r.id))

  if (starred.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-slate-500">You haven't starred anything yet.</p>
        <p className="text-xs text-slate-400 mt-1">Star a request to keep it close at hand here.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Same neutral-box + colored-icon-circle pattern as the Timeline
          panel's own stat cards right next to this one, so the two panels
          read as a matched pair instead of two different visual ideas. */}
      <div className="space-y-2.5">
        {starred.map((req) => {
          const categoryName = req.final_category || req.category_resident_selected || 'Other'
          const statusKey = req.status || 'New'
          const color = STATUS_COLOR[statusKey] || '#64748b'
          const isClosed = ['Resolved', 'Closed', 'Closed (AI)'].includes(statusKey)
          const ageDays = req.submitted_date
            ? Math.max(0, Math.floor((Date.now() - new Date(req.submitted_date).getTime()) / 86400000))
            : null
          const ageLabel = ageDays === null ? null : ageDays === 0 ? 'Today' : ageDays === 1 ? '1 day' : `${ageDays} days`

          return (
            <button
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className="w-full text-left bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/70 rounded-xl p-3.5 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${color}1a`, color }}
                >
                  <Star className="w-4 h-4" fill={color} strokeWidth={0} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-slate-900">{categoryName}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      {statusKey}
                    </span>
                    {ageLabel && !isClosed && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">
                        {ageLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-1">
                    {req.requester_name}
                    {req.unit_address ? ` · ${req.unit_address}` : ''}
                  </p>
                  <p className="text-sm text-slate-700 line-clamp-1">{req.description}</p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 flex-shrink-0 mt-1 transition-colors" strokeWidth={2} />
              </div>
            </button>
          )
        })}
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