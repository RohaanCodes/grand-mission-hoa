// app/(pages)/board/ResolvedVoteCard.tsx
'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import VotingSection from './VotingSection'
import type { ServiceRequest } from '@/lib/types'

// Collapsed by default: category, status, a 2-line preview of the
// description. Expanding reveals the full description and the actual
// vote snapshot — and VotingSection only mounts (and fetches) once
// expanded, so a long resolved list doesn't fire off a request per card
// just sitting there collapsed.
export default function ResolvedVoteCard({
  req,
  viewerRole,
  currentEmail,
}: {
  req: ServiceRequest
  viewerRole: 'board' | 'management'
  currentEmail: string
}) {
  const [open, setOpen] = useState(false)
  const isApproved = req.vote_outcome === 'Approved'

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full text-left flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[15px] font-semibold text-slate-900 truncate">
              {req.final_category || req.category_resident_selected || 'Other'}
            </h3>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {req.vote_outcome}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-1.5">
            {req.requester_name}
            {req.unit_address ? ` · ${req.unit_address}` : ''}
          </p>
          <p className={`text-sm text-slate-600 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>
            {req.description}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
          <VotingSection requestRecordId={req.id} viewerRole={viewerRole} currentEmail={currentEmail} readOnly />
        </div>
      )}
    </div>
  )
}