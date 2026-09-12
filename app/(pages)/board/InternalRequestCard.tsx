// app/(pages)/board/InternalRequestCard.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Wrench, Volume2, Palette, Receipt, Trees, Dumbbell, HelpCircle, Waves, ShieldCheck, Handshake, Landmark, Lock, MapPin, Gavel, LucideIcon } from 'lucide-react'
import RequestThread from './RequestThread'
import ConfirmModal from './ConfirmModal'
import { closeRequestAction, updatePrivateNoteAction } from './queryActions'
import { toggleVotingAction } from './votingActions'
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

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']

function canClose(viewerRole: 'board' | 'management', req: ServiceRequest): boolean {
  if (viewerRole === 'management') return true
  return req.submitted_via === 'Board Member'
}

export default function InternalRequestCard({
  req,
  index,
  viewerRole,
  currentName,
  currentEmail,
}: {
  req: ServiceRequest
  index: number
  viewerRole: 'board' | 'management'
  currentName: string
  currentEmail: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [closing, setClosing] = useState(false)
  const [togglingVote, setTogglingVote] = useState(false)

  const [noteOpen, setNoteOpen] = useState(false)
  const [noteDraft, setNoteDraft] = useState(req.private_notes || '')
  const [savingNote, setSavingNote] = useState(false)
  const noteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!noteOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (noteRef.current && !noteRef.current.contains(e.target as Node)) {
        saveAndClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteOpen, noteDraft])

  const categoryName = req.final_category || req.category_resident_selected || 'Other'
  const catStyle = CATEGORY_STYLE[categoryName] || CATEGORY_STYLE.Other
  const Icon = catStyle.icon
  const statusKey = req.status || 'New'
  const statusStyle = STATUS_STYLE[statusKey] || { color: '#64748b', label: statusKey }
  const isClosed = CLOSED_STATUSES.includes(statusKey)
  const allowClose = canClose(viewerRole, req)
  const hasNote = !!req.private_notes?.trim()
  const hasSolutionInfo = !!(req.proposed_solution || req.estimated_cost || req.management_due_date)
  const initial = req.requester_name?.charAt(0).toUpperCase() || '?'

  const metaParts = [
    req.unit_address,
    req.submitted_date ? new Date(req.submitted_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null,
  ].filter(Boolean)

  const ageDays = req.submitted_date
    ? Math.max(0, Math.floor((Date.now() - new Date(req.submitted_date).getTime()) / 86400000))
    : null
  const ageLabel = ageDays === null ? null : ageDays === 0 ? 'Today' : ageDays === 1 ? '1 day' : `${ageDays} days`

  async function handleConfirmClose() {
    setClosing(true)
    await closeRequestAction(req.id)
    setClosing(false)
    setConfirming(false)
    router.refresh()
  }

  async function saveAndClose() {
    if (noteDraft !== (req.private_notes || '')) {
      setSavingNote(true)
      await updatePrivateNoteAction(req.id, noteDraft)
      setSavingNote(false)
    }
    setNoteOpen(false)
  }

  async function handleToggleVoting() {
    setTogglingVote(true)
    await toggleVotingAction(req.id, !req.voting_open)
    setTogglingVote(false)
    router.refresh()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        className="bg-white border border-slate-300 rounded-2xl shadow-[0_2px_8px_-2px_rgba(100,116,139,0.18),0_1px_3px_rgba(100,116,139,0.12)] hover:shadow-[0_8px_20px_-4px_rgba(100,116,139,0.25),0_2px_6px_rgba(100,116,139,0.15)] transition-shadow overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: catStyle.bg, color: catStyle.color }}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-slate-900 leading-tight">{categoryName}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusStyle.color }} />
                <span className="text-xs font-medium" style={{ color: statusStyle.color }}>{statusStyle.label}</span>
                {ageLabel && !isClosed && (
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {ageLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <StarButton requestRecordId={req.id} currentEmail={currentEmail} currentName={currentName} />
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
              {initial}
            </div>
          </div>
        </div>

        <div className="px-5 pb-4">
          <p className="text-xs text-slate-600 mb-2">
            {req.requester_name}{metaParts.length > 0 ? ` · ${metaParts.join(' · ')}` : ''}
          </p>

          <p className="text-[14px] text-slate-800 leading-relaxed">{req.description}</p>

          {req.location_link && (
            <a
              href={req.location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mt-2"
            >
              <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
              View location
            </a>
          )}

          {hasSolutionInfo && (
            <div className="mt-3 bg-green-50/60 rounded-xl px-4 py-3">
              {req.proposed_solution && (
                <div className="mb-1.5 last:mb-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700 mb-1">
                    Proposed Solution
                  </p>
                  <p className="text-sm text-slate-700">{req.proposed_solution}</p>
                </div>
              )}
              {(req.estimated_cost || req.management_due_date) && (
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5">
                  {req.estimated_cost && (
                    <span className="text-xs text-slate-500">
                      <span className="font-medium text-slate-600">Cost</span> {req.estimated_cost}
                    </span>
                  )}
                  {req.management_due_date && (
                    <span className="text-xs text-slate-500">
                      <span className="font-medium text-slate-600">Target</span>{' '}
                      {new Date(req.management_due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {req.voting_open && (
            <Link
              href={viewerRole === 'management' ? '/management/votes' : '/board/votes'}
              className="mt-3 flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 hover:bg-amber-100/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Gavel className="w-3.5 h-3.5 text-amber-700" strokeWidth={2} />
                <span className="text-xs font-medium text-amber-700">Open for board vote</span>
              </div>
              <span className="text-xs text-amber-700 underline underline-offset-2">View Vote</span>
            </Link>
          )}

          <AnimatePresence>
            {noteOpen && (
              <motion.div
                ref={noteRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden mt-3"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Lock className="w-3 h-3 text-slate-400" strokeWidth={2} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Private note, management only
                  </span>
                  {savingNote && <span className="text-[10px] text-slate-400 ml-auto">Saving</span>}
                </div>
                <textarea
                  autoFocus
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Internal reference note"
                  rows={3}
                  className="w-full bg-amber-50/60 border border-amber-200/60 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {req.request_id_number && (
            <RequestThread
              requestIdNumber={req.request_id_number}
              currentName={currentName}
              currentEmail={currentEmail}
              viewerRole={viewerRole}
            />
          )}
        </div>

        {(viewerRole === 'management' || viewerRole === 'board' || (allowClose && !isClosed)) && (
          <div className="flex items-center justify-end gap-1.5 px-4 py-2.5 bg-slate-50 border-t border-slate-200">
            {(viewerRole === 'management' || viewerRole === 'board') && (
              <button
                onClick={handleToggleVoting}
                disabled={togglingVote}
                className={`text-xs font-semibold rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 border ${
                  req.voting_open
                    ? 'text-blue-700 bg-blue-100 border-blue-200 hover:bg-blue-200'
                    : 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
              >
                {req.voting_open ? 'Close Vote' : 'Open Item for Vote'}
              </button>
            )}
            {viewerRole === 'management' && (
              <button
                onClick={() => setNoteOpen(true)}
                title={hasNote ? 'View private note' : 'Add private note'}
                className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 transition-colors border ${
                  hasNote
                    ? 'text-amber-700 bg-amber-100 border-amber-200 hover:bg-amber-200'
                    : 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Lock className="w-3 h-3" strokeWidth={2} />
                Note
              </button>
            )}
            {allowClose && !isClosed && (
              <button
                onClick={() => setConfirming(true)}
                className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-full px-3 py-1.5 transition-colors"
              >
                Close Request
              </button>
            )}
          </div>
        )}
      </motion.div>

      <ConfirmModal
        open={confirming}
        title="Close this request?"
        description="This marks the request as closed. This action can be reversed manually in Airtable if needed, but it will no longer show as open."
        confirmLabel="Close Request"
        onConfirm={handleConfirmClose}
        onCancel={() => setConfirming(false)}
        loading={closing}
      />
    </>
  )
}