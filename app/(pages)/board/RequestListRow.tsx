// app/(pages)/board/RequestListRow.tsx
'use client'
import { Wrench, Volume2, Palette, Receipt, Trees, Dumbbell, HelpCircle, Waves, ShieldCheck, Handshake, Landmark, ChevronRight, LucideIcon } from 'lucide-react'
import StarButton from './StarButton'
import type { ServiceRequest } from '@/lib/types'

const CATEGORY_STYLE: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  Maintenance: { icon: Wrench, color: '#ea580c', bg: '#ea580c12' },
  'Noise Complaint': { icon: Volume2, color: '#9333ea', bg: '#9333ea12' },
  'Architectural Change': { icon: Palette, color: '#0891b2', bg: '#0891b212' },
  Billing: { icon: Receipt, color: '#16a34a', bg: '#16a34a12' },
  'Common Area': { icon: Trees, color: '#2563eb', bg: '#2563eb12' },
  Amenity: { icon: Dumbbell, color: '#d97706', bg: '#d9770612' },
  Landscaping: { icon: Trees, color: '#16a34a', bg: '#16a34a12' },
  'Pool & Aquatics': { icon: Waves, color: '#0891b2', bg: '#0891b212' },
  'Security & Safety': { icon: ShieldCheck, color: '#dc2626', bg: '#dc262612' },
  'Vendor & Contract Management': { icon: Handshake, color: '#9333ea', bg: '#9333ea12' },
  'Governance & Board Operations': { icon: Landmark, color: '#4f46e5', bg: '#4f46e512' },
  Other: { icon: HelpCircle, color: '#64748b', bg: '#64748b12' },
}

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  New: { color: '#64748b', label: 'New' },
  'Agent In Progress': { color: '#d97706', label: 'In Progress' },
  'Awaiting Management Response': { color: '#2563eb', label: 'Awaiting Management' },
  'Awaiting Resident Info': { color: '#9333ea', label: 'Awaiting Info' },
  'Board Notified': { color: '#d97706', label: 'Board Notified' },
  Resolved: { color: '#16a34a', label: 'Resolved' },
  Closed: { color: '#16a34a', label: 'Closed' },
  'Closed (AI)': { color: '#16a34a', label: 'Closed (AI)' },
}

export default function RequestListRow({
  req,
  onClick,
  isSelected,
  currentEmail,
  currentName,
}: {
  req: ServiceRequest
  onClick: () => void
  isSelected: boolean
  currentEmail: string
  currentName: string
}) {
  const categoryName = req.final_category || req.category_resident_selected || 'Other'
  const catStyle = CATEGORY_STYLE[categoryName] || CATEGORY_STYLE.Other
  const Icon = catStyle.icon
  const statusKey = req.status || 'New'
  const statusStyle = STATUS_STYLE[statusKey] || { color: '#64748b', label: statusKey }

  return (
    <div
      className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
        isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
      }`}
    >
      <StarButton requestRecordId={req.id} currentEmail={currentEmail} currentName={currentName} />

      <button onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: catStyle.bg, color: catStyle.color }}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-900 truncate">{categoryName}</span>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusStyle.color }} />
            <span className="text-xs flex-shrink-0" style={{ color: statusStyle.color }}>{statusStyle.label}</span>
          </div>
          <p className="text-xs text-slate-700 truncate">
            {req.requester_name} &middot; {req.description}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" strokeWidth={2} />
      </button>
    </div>
  )
}