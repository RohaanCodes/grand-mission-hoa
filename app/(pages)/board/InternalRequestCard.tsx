// app/(pages)/board/InternalRequestCard.tsx
'use client'
import { motion } from 'framer-motion'
import {
  Wrench, Volume2, Palette, Receipt, Trees, Dumbbell, HelpCircle, Waves, ShieldCheck,
  Handshake, Landmark, LucideIcon, Clock, Gavel, Copy, MessageSquareText,
} from 'lucide-react'
import StarButton from './StarButton'
import type { ServiceRequest } from '@/lib/types'

// Exact values from the approved reference: full-opacity -100→-200 tint,
// a matching divider, and the SAME hue driving icon, tint, divider, and
// the avatar bubble — one consistent accent per category, not a random
// per-person avatar color.
const CATEGORY_STYLE: Record<string, { icon: LucideIcon; iconColor: string; tint: string; divider: string; avatar: string }> = {
  Maintenance: { icon: Wrench, iconColor: 'text-orange-600', tint: 'from-orange-100 to-orange-200', divider: 'bg-orange-200/70', avatar: 'bg-orange-500' },
  'Noise Complaint': { icon: Volume2, iconColor: 'text-violet-600', tint: 'from-violet-100 to-violet-200', divider: 'bg-violet-200/70', avatar: 'bg-violet-500' },
  'Architectural Change': { icon: Palette, iconColor: 'text-sky-600', tint: 'from-sky-100 to-sky-200', divider: 'bg-sky-200/70', avatar: 'bg-sky-500' },
  Billing: { icon: Receipt, iconColor: 'text-emerald-600', tint: 'from-emerald-100 to-emerald-200', divider: 'bg-emerald-200/70', avatar: 'bg-emerald-500' },
  'Common Area': { icon: Trees, iconColor: 'text-blue-600', tint: 'from-blue-100 to-blue-200', divider: 'bg-blue-200/70', avatar: 'bg-blue-500' },
  Amenity: { icon: Dumbbell, iconColor: 'text-cyan-600', tint: 'from-cyan-100 to-cyan-200', divider: 'bg-cyan-200/70', avatar: 'bg-cyan-500' },
  Landscaping: { icon: Trees, iconColor: 'text-emerald-600', tint: 'from-emerald-100 to-emerald-200', divider: 'bg-emerald-200/70', avatar: 'bg-emerald-500' },
  'Pool & Aquatics': { icon: Waves, iconColor: 'text-sky-600', tint: 'from-sky-100 to-sky-200', divider: 'bg-sky-200/70', avatar: 'bg-sky-500' },
  'Security & Safety': { icon: ShieldCheck, iconColor: 'text-rose-600', tint: 'from-rose-100 to-rose-200', divider: 'bg-rose-200/70', avatar: 'bg-rose-500' },
  'Vendor & Contract Management': { icon: Handshake, iconColor: 'text-violet-600', tint: 'from-violet-100 to-violet-200', divider: 'bg-violet-200/70', avatar: 'bg-violet-500' },
  'Governance & Board Operations': { icon: Landmark, iconColor: 'text-indigo-600', tint: 'from-indigo-100 to-indigo-200', divider: 'bg-indigo-200/70', avatar: 'bg-indigo-500' },
  Other: { icon: HelpCircle, iconColor: 'text-gray-600', tint: 'from-gray-100 to-gray-200', divider: 'bg-gray-200/70', avatar: 'bg-gray-500' },
}

const STATUS_STYLE: Record<string, { dot: string; text: string; bg: string; ring: string; label: string }> = {
  New: { dot: 'bg-slate-500', text: 'text-slate-700', bg: 'bg-slate-50', ring: 'ring-slate-200/60', label: 'New' },
  'Agent In Progress': { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200/60', label: 'In Progress' },
  'Awaiting Management Response': { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', ring: 'ring-blue-200/60', label: 'Awaiting Management' },
  'Awaiting Resident Info': { dot: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50', ring: 'ring-purple-200/60', label: 'Awaiting Info' },
  'Board Notified': { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200/60', label: 'Board Notified' },
  Resolved: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200/60', label: 'Resolved' },
  Closed: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200/60', label: 'Closed' },
  'Closed (AI)': { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200/60', label: 'Closed (AI)' },
}

function initialsForName(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']

const AVATAR_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500']

function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function InternalRequestCard({
  req,
  index,
  currentName,
  currentEmail,
  onClick,
  size = 'default',
  threadSummary,
}: {
  req: ServiceRequest
  index: number
  currentName: string
  currentEmail: string
  onClick: () => void
  size?: 'default' | 'large'
  threadSummary?: { messageCount: number; participants: { name: string; email: string; photoUrl?: string }[] }
}) {
  const categoryName = req.final_category || req.category_resident_selected || 'Other'
  const catStyle = CATEGORY_STYLE[categoryName] || CATEGORY_STYLE.Other
  const CategoryIcon = catStyle.icon
  const statusKey = req.status || 'New'
  const statusStyle = STATUS_STYLE[statusKey] || STATUS_STYLE.New
  const isClosed = CLOSED_STATUSES.includes(statusKey)

  const ageDays = req.submitted_date
    ? Math.max(0, Math.floor((Date.now() - new Date(req.submitted_date).getTime()) / 86400000))
    : null
  const ageLabel = ageDays === null ? '—' : ageDays === 0 ? 'Today' : ageDays === 1 ? '1 day ago' : `${ageDays} days ago`

  const initials = initialsForName(req.requester_name || req.requester_email || '?')

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
      className={`group relative flex flex-col text-left overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${catStyle.tint} p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/40 ${
        size === 'large' ? 'min-h-[260px]' : 'min-h-[220px]'
      }`}
    >
      {/* Top row: icon + ref + badges */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-inset ring-black/5">
            <CategoryIcon className={`h-5 w-5 ${catStyle.iconColor}`} strokeWidth={2.2} />
          </div>
          {req.request_id_number && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">
              Ref #{req.request_id_number}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {req.voting_open && (
            <span title="Open for board vote" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 overflow-hidden">
              <motion.span
                animate={{ rotate: [0, -28, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }}
                style={{ transformOrigin: '85% 85%' }}
              >
                <Gavel className="h-[15px] w-[15px]" strokeWidth={2} />
              </motion.span>
            </span>
          )}
          {req.proposed_solution && (
            <span title="Management has proposed a solution" className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500">
              <MessageSquareText className="h-[15px] w-[15px]" strokeWidth={2} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          )}
          {req.possible_duplicate && (
            <span title="Possible duplicate" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500">
              <Copy className="h-[15px] w-[15px]" strokeWidth={2} />
            </span>
          )}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <StarButton requestRecordId={req.id} currentEmail={currentEmail} currentName={currentName} />
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-4 text-[15px] font-bold leading-snug text-slate-800 truncate">
        {categoryName}
      </h3>

      {/* Description — the AI-summarized 2-line version, not the raw
          submission. Falls back to the raw description for any request
          that hasn't been processed by the summarizer field yet. */}
      <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-inset ring-slate-200/60 flex-1">
        <p className={`text-[13px] leading-relaxed text-slate-600 ${size === 'large' ? 'line-clamp-4' : 'line-clamp-2'}`}>
          {req.description_summary || req.description}
        </p>
      </div>

      {/* Divider — matches the category's own hue, not a generic gray */}
      {/* Thread activity — avatar stack of who's asked something, plus a
          total message count. Only shows up if there's actually a thread. */}
      {threadSummary && threadSummary.messageCount > 0 && (
        <div className="flex items-center gap-1.5 mt-2.5">
          <span className="flex -space-x-1.5">
            {threadSummary.participants.slice(0, 3).map((p) =>
              p.photoUrl ? (
                <img
                  key={p.email}
                  src={p.photoUrl}
                  alt={p.name}
                  title={p.name}
                  className="w-5 h-5 rounded-full ring-2 ring-white object-cover"
                />
              ) : (
                <span
                  key={p.email}
                  title={p.name}
                  className={`w-5 h-5 rounded-full ring-2 ring-white flex items-center justify-center text-[8px] font-bold text-white ${colorForName(p.name)}`}
                >
                  {initialsForName(p.name)}
                </span>
              )
            )}
            {threadSummary.participants.length > 3 && (
              <span className="w-5 h-5 rounded-full ring-2 ring-white bg-slate-300 flex items-center justify-center text-[7px] font-bold text-slate-700">
                +{threadSummary.participants.length - 3}
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-500">{threadSummary.messageCount} message{threadSummary.messageCount === 1 ? '' : 's'}</span>
        </div>
      )}

      <div className={`my-4 h-px ${catStyle.divider}`} />

      {/* Bottom: requester + time, status badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${catStyle.avatar} text-[11px] font-bold text-white ring-2 ring-white/80`}>
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-medium text-slate-700 truncate">{req.requester_name}</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Clock className="h-3 w-3" strokeWidth={2.2} />
              {ageLabel}
            </span>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold flex-shrink-0 ${statusStyle.bg} ${statusStyle.text} ring-1 ring-inset ${statusStyle.ring}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
          {statusStyle.label}
        </span>
      </div>
    </motion.button>
  )
}