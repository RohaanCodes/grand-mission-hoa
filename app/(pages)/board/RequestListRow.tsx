// app/(pages)/board/RequestListRow.tsx
'use client'
import { Wrench, Volume2, Palette, Receipt, Trees, Dumbbell, HelpCircle, Waves, ShieldCheck, Handshake, Landmark, ChevronRight, LucideIcon } from 'lucide-react'
import type { ServiceRequest } from '@/lib/types'

const CATEGORY_STYLE: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  Maintenance: { icon: Wrench, color: '#b8724a', bg: '#b8724a15' },
  'Noise Complaint': { icon: Volume2, color: '#8a6fb0', bg: '#8a6fb015' },
  'Architectural Change': { icon: Palette, color: '#4a7a7a', bg: '#4a7a7a15' },
  Billing: { icon: Receipt, color: '#8a9a6f', bg: '#8a9a6f15' },
  'Common Area': { icon: Trees, color: '#5a8ab0', bg: '#5a8ab015' },
  Amenity: { icon: Dumbbell, color: '#c9a961', bg: '#c9a96115' },
  Landscaping: { icon: Trees, color: '#8a9a6f', bg: '#8a9a6f15' },
  'Pool & Aquatics': { icon: Waves, color: '#4a7a7a', bg: '#4a7a7a15' },
  'Security & Safety': { icon: ShieldCheck, color: '#b8724a', bg: '#b8724a15' },
  'Vendor & Contract Management': { icon: Handshake, color: '#8a6fb0', bg: '#8a6fb015' },
  'Governance & Board Operations': { icon: Landmark, color: '#1a3a52', bg: '#1a3a5215' },
  Other: { icon: HelpCircle, color: '#8a8a8a', bg: '#8a8a8a15' },
}

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  New: { color: '#8a8a8a', label: 'New' },
  'Agent In Progress': { color: '#c9a961', label: 'In Progress' },
  'Awaiting Management Response': { color: '#5a8ab0', label: 'Awaiting Management' },
  'Awaiting Resident Info': { color: '#8a6fb0', label: 'Awaiting Info' },
  'Board Notified': { color: '#c9a961', label: 'Board Notified' },
  Resolved: { color: '#8a9a6f', label: 'Resolved' },
  Closed: { color: '#8a9a6f', label: 'Closed' },
  'Closed (AI)': { color: '#8a9a6f', label: 'Closed (AI)' },
}

export default function RequestListRow({
  req,
  onClick,
  isSelected,
}: {
  req: ServiceRequest
  onClick: () => void
  isSelected: boolean
}) {
  const categoryName = req.final_category || req.category_resident_selected || 'Other'
  const catStyle = CATEGORY_STYLE[categoryName] || CATEGORY_STYLE.Other
  const Icon = catStyle.icon
  const statusKey = req.status || 'New'
  const statusStyle = STATUS_STYLE[statusKey] || { color: '#8a8a8a', label: statusKey }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
        isSelected ? 'bg-primary/8' : 'hover:bg-muted/50'
      }`}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: catStyle.bg, color: catStyle.color }}
      >
        <Icon className="w-4 h-4" strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-serif text-sm text-foreground/90 truncate">{categoryName}</span>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusStyle.color }} />
          <span className="text-xs flex-shrink-0" style={{ color: statusStyle.color }}>{statusStyle.label}</span>
        </div>
        <p className="text-xs text-foreground/50 truncate">
          {req.requester_name} &middot; {req.description}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-foreground/30 flex-shrink-0" strokeWidth={2} />
    </button>
  )
}