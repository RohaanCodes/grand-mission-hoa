// app/(pages)/board/InternalRequestCard.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, Volume2, Palette, Receipt, Trees, Dumbbell, HelpCircle, Lock, LucideIcon } from 'lucide-react'
import RequestStatusBadge from '../profile/RequestStatusBadge'
import RequestThread from './RequestThread'
import ConfirmModal from './ConfirmModal'
import { closeRequestAction, updatePrivateNoteAction } from './queryActions'
import type { ServiceRequest } from '@/lib/types'

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
  const Icon = categoryIcons[categoryName] || HelpCircle
  const isClosed = CLOSED_STATUSES.includes(req.status || '')
  const allowClose = canClose(viewerRole, req)
  const hasNote = !!req.private_notes?.trim()
  const hasSolutionInfo = !!(req.proposed_solution || req.estimated_cost || req.management_due_date)

  const metaParts = [
    req.requester_name,
    req.unit_address,
    req.submitted_date ? new Date(req.submitted_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null,
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
        className={`bg-card border border-border rounded-xl hover:shadow-md transition-shadow overflow-hidden border-l-4 ${
          isClosed ? 'border-l-secondary/50' : 'border-l-accent'
        }`}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-primary" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-base text-primary leading-tight">{categoryName}</h3>
              <p className="text-xs text-foreground/50 truncate">{metaParts.join(' · ')}</p>
            </div>
          </div>
          <RequestStatusBadge status={req.status || 'New'} />
        </div>

        <div className="px-5 pb-4">
          <p className="text-[15px] text-foreground/90 leading-relaxed">{req.description}</p>

          {hasSolutionInfo && (
            <div className="mt-3 bg-secondary/8 border border-secondary/20 rounded-lg px-3.5 py-3">
              {req.proposed_solution && (
                <div className="mb-2 last:mb-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-secondary/70 mb-0.5">
                    Proposed Solution
                  </p>
                  <p className="text-sm text-foreground/80">{req.proposed_solution}</p>
                </div>
              )}
              {(req.estimated_cost || req.management_due_date) && (
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5">
                  {req.estimated_cost && (
                    <span className="text-xs text-foreground/60">
                      <span className="font-medium text-foreground/75">Cost</span> {req.estimated_cost}
                    </span>
                  )}
                  {req.management_due_date && (
                    <span className="text-xs text-foreground/60">
                      <span className="font-medium text-foreground/75">Target date</span>{' '}
                      {new Date(req.management_due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
                  <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/40">
                    Private note, visible to management only
                  </span>
                  {savingNote && <span className="text-[11px] text-foreground/35 ml-auto">Saving</span>}
                </div>
                <textarea
                  autoFocus
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add a note for internal reference. Not visible to the board or resident."
                  rows={3}
                  className="w-full bg-amber-50/60 border border-amber-200/60 rounded-lg px-3 py-2 text-sm text-foreground/75 placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-amber-300/50 resize-none"
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

        {viewerRole === 'management' || (allowClose && !isClosed) ? (
          <div className="flex items-center justify-end gap-2 px-5 py-2.5 bg-muted/50 border-t border-border">
            {viewerRole === 'management' && (
              <button
                onClick={() => setNoteOpen(true)}
                className={`flex items-center gap-1 text-xs font-medium border rounded-full px-2.5 py-1 transition-colors ${
                  hasNote
                    ? 'text-amber-700 border-amber-300 bg-amber-50'
                    : 'text-foreground/50 border-border bg-card hover:bg-muted'
                }`}
              >
                <Lock className="w-2.5 h-2.5" strokeWidth={2} />
                Note
              </button>
            )}
            {allowClose && !isClosed && (
              <button
                onClick={() => setConfirming(true)}
                className="text-xs font-medium text-foreground/50 hover:text-destructive border border-border bg-card rounded-full px-2.5 py-1 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        ) : null}
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