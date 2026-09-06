// app/(pages)/board/InternalRequestCard.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, Volume2, Palette, Receipt, Trees, Dumbbell, HelpCircle, Waves, ShieldCheck, Handshake, Landmark, Lock, MapPin, LucideIcon } from 'lucide-react'
import RequestThread from './RequestThread'
import ConfirmModal from './ConfirmModal'
import { closeRequestAction, updatePrivateNoteAction } from './queryActions'
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
  const statusStyle = STATUS_STYLE[statusKey] || { color: '#8a8a8a', label: statusKey }
  const isClosed = CLOSED_STATUSES.includes(statusKey)
  const allowClose = canClose(viewerRole, req)
  const hasNote = !!req.private_notes?.trim()
  const hasSolutionInfo = !!(req.proposed_solution || req.estimated_cost || req.management_due_date)
  const initial = req.requester_name?.charAt(0).toUpperCase() || '?'

  const metaParts = [
    req.unit_address,
    req.submitted_date ? new Date(req.submitted_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null,
  ].filter(Boolean)

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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
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
              <h3 className="font-serif text-[15px] text-foreground/90 leading-tight">{categoryName}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusStyle.color }} />
                <span className="text-xs font-medium" style={{ color: statusStyle.color }}>{statusStyle.label}</span>
              </div>
            </div>
          </div>

          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
            {initial}
          </div>
        </div>

        <div className="px-5 pb-4">
          <p className="text-xs text-foreground/45 mb-2">
            {req.requester_name}{metaParts.length > 0 ? ` · ${metaParts.join(' · ')}` : ''}
          </p>

          <p className="text-[14px] text-foreground/80 leading-relaxed">{req.description}</p>

          {req.location_link && (
            <a
              href={req.location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary/70 hover:text-primary mt-2"
            >
              <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
              View location
            </a>
          )}

          {hasSolutionInfo && (
            <div className="mt-3 bg-secondary/6 rounded-xl px-4 py-3">
              {req.proposed_solution && (
                <div className="mb-1.5 last:mb-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary/70 mb-1">
                    Proposed Solution
                  </p>
                  <p className="text-sm text-foreground/75">{req.proposed_solution}</p>
                </div>
              )}
              {(req.estimated_cost || req.management_due_date) && (
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5">
                  {req.estimated_cost && (
                    <span className="text-xs text-foreground/55">
                      <span className="font-medium text-foreground/70">Cost</span> {req.estimated_cost}
                    </span>
                  )}
                  {req.management_due_date && (
                    <span className="text-xs text-foreground/55">
                      <span className="font-medium text-foreground/70">Target</span>{' '}
                      {new Date(req.management_due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              )}
            </div>
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
                  <Lock className="w-3 h-3 text-foreground/35" strokeWidth={2} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground/40">
                    Private note, management only
                  </span>
                  {savingNote && <span className="text-[10px] text-foreground/35 ml-auto">Saving</span>}
                </div>
                <textarea
                  autoFocus
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Internal reference note"
                  rows={3}
                  className="w-full bg-amber-50/60 border border-amber-200/60 rounded-xl px-3 py-2 text-sm text-foreground/75 placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-amber-300/50 resize-none"
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

        {(viewerRole === 'management' || (allowClose && !isClosed)) && (
          <div className="flex items-center justify-end gap-1.5 px-4 py-2.5 bg-muted/30 border-t border-border/60">
            {viewerRole === 'management' && (
              <button
                onClick={() => setNoteOpen(true)}
                title={hasNote ? 'View private note' : 'Add private note'}
                className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 transition-colors ${
                  hasNote ? 'text-amber-700 bg-amber-100' : 'text-foreground/45 hover:bg-muted'
                }`}
              >
                <Lock className="w-3 h-3" strokeWidth={2} />
                Note
              </button>
            )}
            {allowClose && !isClosed && (
              <button
                onClick={() => setConfirming(true)}
                className="text-xs font-medium text-foreground/45 hover:text-destructive hover:bg-destructive/5 rounded-full px-3 py-1.5 transition-colors"
              >
                Close
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