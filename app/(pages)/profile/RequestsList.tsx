// app/(pages)/profile/RequestsList.tsx
'use client'
import { motion } from 'framer-motion'
import {
  Wrench,
  Volume2,
  Palette,
  Receipt,
  Trees,
  Dumbbell,
  HelpCircle,
  LucideIcon,
} from 'lucide-react'
import RequestStatusBadge from './RequestStatusBadge'
import type { ServiceRequest } from '@/lib/types'
import RequestThread from '../board/RequestThread'

const categoryIcons: Record<string, LucideIcon> = {
  Maintenance: Wrench,
  'Noise Complaint': Volume2,
  'Architectural Change': Palette,
  Billing: Receipt,
  'Common Area': Trees,
  Amenity: Dumbbell,
  Other: HelpCircle,
}

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']

export default function RequestsList({
  requests,
  showRequester = false,
  enableQueries = false,
  currentName = '',
  currentEmail = '',
  viewerRole,
}: {
  requests: ServiceRequest[]
  showRequester?: boolean
  enableQueries?: boolean
  currentName?: string
  currentEmail?: string
  viewerRole?: 'board' | 'management'
}) {
  if (requests.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-xl shadow-sm p-12 text-center">
        <HelpCircle className="w-8 h-8 text-foreground/20 mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-foreground/60">No requests to show.</p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {requests.map((req, i) => {
        const categoryName = req.final_category || req.category_resident_selected || 'Other'
        const Icon = categoryIcons[categoryName] || HelpCircle
        const isClosed = CLOSED_STATUSES.includes(req.status || '')
        const initial = req.requester_name?.charAt(0).toUpperCase() || '?'

        return (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className={`bg-white/55 backdrop-blur-md border border-white/60 rounded-xl shadow-sm hover:shadow-md hover:bg-white/70 transition-all p-6 border-l-4 ${
              isClosed ? 'border-l-secondary/50' : 'border-l-accent'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <span className="font-serif text-lg text-primary">{categoryName}</span>
                  <RequestStatusBadge status={req.status || 'New'} />
                </div>

                {showRequester && (
                  <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-full pl-1 pr-2.5 py-0.5 mb-2.5">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] font-semibold flex items-center justify-center">
                      {initial}
                    </span>
                    <span className="text-xs text-foreground/60">
                      {req.requester_name}{req.unit_address ? ` · ${req.unit_address}` : ''}
                    </span>
                  </div>
                )}

                <p className="text-foreground/75 text-sm leading-relaxed">{req.description}</p>

                {enableQueries && req.request_id_number && (
                  <RequestThread
  requestIdNumber={req.request_id_number}
  currentName={currentName}
  currentEmail={currentEmail}
  viewerRole={viewerRole}
/>
                )}

                {req.submitted_date && (
                  <p className="text-foreground/40 text-xs mt-3">
                    Submitted {new Date(req.submitted_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}