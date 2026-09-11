// app/(pages)/board/StarredPanel.tsx
'use client'
import { useState, useEffect } from 'react'
import { getStarredIdsAction } from './starActions'
import RequestListRow from './RequestListRow'
import RequestDetailDrawer from './RequestDetailDrawer'
import type { ServiceRequest } from '@/lib/types'

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
    return <p className="text-sm text-slate-600">You haven't starred anything yet.</p>
  }

  return (
    <div>
      <div className="divide-y divide-slate-200 -mx-6">
        {starred.map((req) => (
          <div key={req.id} className="px-6">
            <RequestListRow
              req={req}
              onClick={() => setSelectedRequest(req)}
              isSelected={selectedRequest?.id === req.id}
              currentEmail={currentEmail}
              currentName={currentName}
            />
          </div>
        ))}
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