// app/(pages)/board/RequestDetailDrawer.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import {
  X,
  Wrench,
  Volume2,
  Palette,
  Receipt,
  Trees,
  Dumbbell,
  HelpCircle,
  Waves,
  ShieldCheck,
  Handshake,
  Landmark,
  LucideIcon,
  MapPin,
  FileText,
  Activity,
  Gavel,
  Lock,
  Info,
  Images,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import RequestThread from './RequestThread'
import TriagePanel from './TriagePanel'
import RequesterActionPanel from './RequesterActionPanel'
import ConfirmModal from './ConfirmModal'
import StarButton from './StarButton'

import {
  closeRequestAction,
  updatePrivateNoteAction,
} from './queryActions'

import { toggleVotingAction } from './votingActions'
import type { ServiceRequest } from '@/lib/types'

const CATEGORY_STYLE: Record<
  string,
  { icon: LucideIcon; bg: string; text: string }
> = {
  Maintenance: {
    icon: Wrench,
    bg: 'bg-orange-300',
    text: 'text-orange-950',
  },
  'Noise Complaint': {
    icon: Volume2,
    bg: 'bg-purple-300',
    text: 'text-purple-950',
  },
  'Architectural Change': {
    icon: Palette,
    bg: 'bg-[#8fd6c9]',
    text: 'text-teal-950',
  },
  Billing: {
    icon: Receipt,
    bg: 'bg-green-300',
    text: 'text-green-950',
  },
  'Common Area': {
    icon: Trees,
    bg: 'bg-blue-300',
    text: 'text-blue-950',
  },
  Amenity: {
    icon: Dumbbell,
    bg: 'bg-[#f0c179]',
    text: 'text-amber-950',
  },
  Landscaping: {
    icon: Trees,
    bg: 'bg-green-300',
    text: 'text-green-950',
  },
  'Pool & Aquatics': {
    icon: Waves,
    bg: 'bg-[#8fd6c9]',
    text: 'text-teal-950',
  },
  'Security & Safety': {
    icon: ShieldCheck,
    bg: 'bg-red-300',
    text: 'text-red-950',
  },
  'Vendor & Contract Management': {
    icon: Handshake,
    bg: 'bg-purple-300',
    text: 'text-purple-950',
  },
  'Governance & Board Operations': {
    icon: Landmark,
    bg: 'bg-indigo-300',
    text: 'text-indigo-950',
  },
  Other: {
    icon: HelpCircle,
    bg: 'bg-slate-300',
    text: 'text-slate-950',
  },
}

const STATUS_STYLE: Record<
  string,
  {
    bg: string
    text: string
    border: string
    label: string
  }
> = {
  New: {
    bg: 'bg-slate-200',
    text: 'text-slate-800',
    border: 'border-slate-300',
    label: 'New',
  },
  'Agent In Progress': {
    bg: 'bg-amber-200',
    text: 'text-amber-900',
    border: 'border-amber-300',
    label: 'In Progress',
  },
  'Awaiting Management Response': {
    bg: 'bg-blue-200',
    text: 'text-blue-900',
    border: 'border-blue-300',
    label: 'Awaiting Management',
  },
  'Awaiting Resident Info': {
    bg: 'bg-purple-200',
    text: 'text-purple-900',
    border: 'border-purple-300',
    label: 'Awaiting Info',
  },
  'Board Notified': {
    bg: 'bg-amber-200',
    text: 'text-amber-900',
    border: 'border-amber-300',
    label: 'Board Notified',
  },
  Resolved: {
    bg: 'bg-green-200',
    text: 'text-green-900',
    border: 'border-green-300',
    label: 'Resolved',
  },
  Closed: {
    bg: 'bg-green-200',
    text: 'text-green-900',
    border: 'border-green-300',
    label: 'Closed',
  },
  'Closed (AI)': {
    bg: 'bg-green-200',
    text: 'text-green-900',
    border: 'border-green-300',
    label: 'Closed (AI)',
  },
}

const CLOSED_STATUSES = [
  'Resolved',
  'Closed',
  'Closed (AI)',
]

function canClose(
  viewerRole: 'board' | 'management',
  req: ServiceRequest
): boolean {
  if (viewerRole === 'management') return true
  return req.submitted_via === 'Board Member'
}

function SectionLabel({
  icon: Icon,
  text,
}: {
  icon: LucideIcon
  text: string
}) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <Icon
        className="w-3.5 h-3.5 text-slate-400"
        strokeWidth={2}
      />

      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {text}
      </p>
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  if (!value) return null

  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-b-0">
      <span className="text-xs text-slate-500 flex-shrink-0">
        {label}
      </span>

      <span className="text-xs font-medium text-slate-800 text-right break-words min-w-0">
        {value}
      </span>
    </div>
  )
}

export default function RequestDetailDrawer({
  request,
  onClose,
  viewerRole,
  currentName,
  currentEmail,
}: {
  request: ServiceRequest | null
  onClose: () => void
  viewerRole: 'board' | 'management'
  currentName: string
  currentEmail: string
}) {
  const router = useRouter()

  const [confirming, setConfirming] = useState(false)
  const [closing, setClosing] = useState(false)
  const [togglingVote, setTogglingVote] = useState(false)

  const [noteOpen, setNoteOpen] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const [detailsOpen, setDetailsOpen] = useState(true)

  const [lightboxIndex, setLightboxIndex] =
    useState<number | null>(null)

  const noteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNoteDraft(request?.private_notes || '')
    setNoteOpen(false)
    setDetailsOpen(true)
    setLightboxIndex(null)
  }, [request?.id])

  if (!request) {
    return (
      <ConfirmModal
        open={confirming}
        title="Close this request?"
        description="This marks the request as closed. This action can be reversed manually in Airtable if needed, but it will no longer show as open."
        confirmLabel="Close Request"
        onConfirm={() => {}}
        onCancel={() => setConfirming(false)}
        loading={closing}
      />
    )
  }

  const req = request

  const categoryName =
    req.final_category ||
    req.category_resident_selected ||
    'Other'

  const catStyle =
    CATEGORY_STYLE[categoryName] || CATEGORY_STYLE.Other

  const CategoryIcon = catStyle.icon

  const statusKey = req.status || 'New'

  const statusStyle =
    STATUS_STYLE[statusKey] || STATUS_STYLE.New

  const isClosed =
    CLOSED_STATUSES.includes(statusKey)

  const allowClose =
    canClose(viewerRole, req)

  const hasNote =
    !!req.private_notes?.trim()

  const hasSolutionInfo = !!(
    req.proposed_solution ||
    req.estimated_cost ||
    req.management_due_date
  )

  async function handleConfirmClose() {
    setClosing(true)

    await closeRequestAction(req.id)

    setClosing(false)
    setConfirming(false)

    router.refresh()
  }

  async function saveNote() {
    if (
      noteDraft !==
      (req.private_notes || '')
    ) {
      setSavingNote(true)

      await updatePrivateNoteAction(
        req.id,
        noteDraft
      )

      setSavingNote(false)

      router.refresh()
    }
  }

  async function handleToggleVoting() {
    setTogglingVote(true)

    await toggleVotingAction(
      req.id,
      !req.voting_open
    )

    setTogglingVote(false)

    router.refresh()
  }

  return (
    <AnimatePresence>
      {request && (
        <>
          {/* =====================================================
              BACKDROP
          ====================================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50"
          />

          {/* =====================================================
              DRAWER
          ====================================================== */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.25,
            }}
            className="dashboard fixed top-0 right-0 h-full w-full sm:w-[480px] bg-slate-50 z-[60] overflow-y-auto overflow-x-hidden shadow-2xl"
          >
            {/* =================================================
                FROZEN TOP AREA
            ================================================== */}
            <div className="sticky top-0 z-50">

              {/* =================================================
                  PANEL HEADER
              ================================================== */}
              <div
                className={`relative px-4 sm:px-5 py-4 border-b border-black/5 ${catStyle.bg}`}
              >
                {/*
                  MOBILE HEADER LAYOUT

                  Category/reference occupy the left/top area.

                  Star + close are absolutely positioned in the
                  top-right corner so they never compete with the
                  category or status.

                  Desktop returns to the original flex layout.
                */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                  {/* =================================================
                      LEFT SIDE
                  ================================================== */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-16 sm:pr-0">

                    <span
                      className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0 ${catStyle.text}`}
                    >
                      <CategoryIcon
                        className="w-5 h-5"
                        strokeWidth={2}
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2
                        className={`text-base font-bold truncate ${catStyle.text}`}
                      >
                        {categoryName}
                      </h2>

                      {req.request_id_number && (
                        <p
                          className={`text-xs opacity-70 ${catStyle.text}`}
                        >
                          Reference #
                          {req.request_id_number}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* =================================================
                      MOBILE TOP-RIGHT CONTROLS

                      Only Star + Close are placed here on mobile.
                  ================================================== */}
                  <div className="absolute top-3 right-3 flex sm:hidden items-center gap-1.5">

                    {/* STAR */}
                    <span className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center">
                      <StarButton
                        requestRecordId={req.id}
                        currentEmail={currentEmail}
                        currentName={currentName}
                      />
                    </span>

                    {/* CLOSE */}
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close request details"
                      className={`w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors ${catStyle.text}`}
                    >
                      <X
                        className="w-4 h-4"
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  {/* =================================================
                      DESKTOP RIGHT HEADER CONTROLS

                      Completely unchanged from the desktop layout.
                  ================================================== */}
                  <div className="hidden sm:flex items-center justify-end gap-1.5 flex-shrink-0">

                    {/* STATUS */}
                    <span
                      className={`h-8 inline-flex items-center text-[10px] font-bold px-2.5 rounded-full border whitespace-nowrap ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {statusStyle.label}
                    </span>

                    {/* VOTE INDICATOR */}
                    {req.voting_open && (
                      <span
                        title="Open for board vote"
                        className={`w-8 h-8 rounded-full bg-white/60 flex items-center justify-center ${catStyle.text}`}
                      >
                        <Gavel
                          className="w-3.5 h-3.5"
                          strokeWidth={2.25}
                        />
                      </span>
                    )}

                    {/* STAR */}
                    <span className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center">
                      <StarButton
                        requestRecordId={req.id}
                        currentEmail={currentEmail}
                        currentName={currentName}
                      />
                    </span>

                    {/* CLOSE */}
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close request details"
                      className={`w-8 h-8 rounded-full hover:bg-white/40 flex items-center justify-center transition-colors ${catStyle.text}`}
                    >
                      <X
                        className="w-4 h-4"
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  {/* =================================================
                      MOBILE STATUS / VOTE ROW

                      Status remains below the category, while the
                      Star + Close controls stay in the top-right.
                  ================================================== */}
                  <div className="flex sm:hidden items-center gap-1.5 w-full">

                    {/* STATUS */}
                    <span
                      className={`h-8 inline-flex items-center text-[10px] font-bold px-2.5 rounded-full border whitespace-nowrap ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {statusStyle.label}
                    </span>

                    {/* VOTE INDICATOR */}
                    {req.voting_open && (
                      <span
                        title="Open for board vote"
                        className={`w-8 h-8 rounded-full bg-white/60 flex items-center justify-center ${catStyle.text}`}
                      >
                        <Gavel
                          className="w-3.5 h-3.5"
                          strokeWidth={2.25}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* =================================================
                  TOP ACTION AREA
              ================================================== */}
              <div className="relative bg-slate-50 px-4 sm:px-5 py-3 border-b border-slate-200">

                {/* Added relative so the mobile Note panel can
                    use the full available action-row width. */}
                <div className="relative flex items-center gap-2 flex-wrap min-w-0">

                  {/* =================================================
                      1. SUBMIT TRIAGE UPDATE
                  ================================================== */}
                  {viewerRole === 'management' &&
                    !isClosed &&
                    req.request_id_number && (
                      <TriagePanel
                        requestIdNumber={
                          req.request_id_number
                        }
                        currentName={
                          currentName
                        }
                        currentEmail={
                          currentEmail
                        }
                      />
                  )}

                  {/* =================================================
                      2. NOTE
                  ================================================== */}
                  {viewerRole === 'management' && (
                    <div className="static sm:relative shrink-0">

                      <button
                        type="button"
                        onClick={() =>
                          setNoteOpen((v) => !v)
                        }
                        title={
                          hasNote
                            ? 'View private note'
                            : 'Add private note'
                        }
                        className={`flex items-center gap-1.5 text-xs font-bold rounded-lg px-3.5 py-2 border transition-colors ${
                          hasNote
                            ? 'text-amber-900 bg-amber-300 border-amber-400 hover:bg-amber-400'
                            : 'text-amber-900 bg-amber-200 border-amber-300 hover:bg-amber-300'
                        }`}
                      >
                        <Lock
                          className="w-3.5 h-3.5"
                          strokeWidth={2}
                        />

                        Note
                      </button>

                      {/* =================================================
                          NOTE PANEL

                          MOBILE:
                          Uses the full action-row width and is constrained
                          equally from both left and right sides.

                          DESKTOP:
                          Remains centered under the Note button.
                      ================================================== */}
                      <AnimatePresence>
                        {noteOpen && (
                          <motion.div
                            ref={noteRef}
                            initial={{
                              opacity: 0,
                              y: -4,
                              scale: 0.98,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              y: -4,
                              scale: 0.98,
                            }}
                            transition={{
                              duration: 0.15,
                            }}
                            className="absolute top-[calc(100%+8px)] left-3 right-3 w-auto max-w-none sm:top-[calc(100%+8px)] sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[360px] sm:max-w-[360px] bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-20 box-border"
                          >
                            <div className="flex items-center gap-1.5 mb-1.5 min-w-0">

                              <Lock
                                className="w-3 h-3 text-slate-400 flex-shrink-0"
                                strokeWidth={2}
                              />

                              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 truncate">
                                Private note, management only
                              </span>

                              {savingNote && (
                                <span className="text-[10px] text-slate-400 ml-auto flex-shrink-0">
                                  Saving
                                </span>
                              )}
                            </div>

                            <textarea
                              autoFocus
                              value={noteDraft}
                              onChange={(e) =>
                                setNoteDraft(
                                  e.target.value
                                )
                              }
                              onBlur={saveNote}
                              placeholder="Internal reference note"
                              rows={3}
                              className="w-full min-w-0 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 resize-none"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* =================================================
                      3. OPEN ITEM FOR VOTE
                  ================================================== */}
                  {(viewerRole === 'management' ||
                    viewerRole === 'board') && (
                    <button
                      type="button"
                      onClick={
                        handleToggleVoting
                      }
                      disabled={
                        togglingVote
                      }
                      className={`shrink-0 text-xs font-bold rounded-lg px-3.5 py-2 border transition-colors disabled:opacity-50 ${
                        req.voting_open
                          ? 'text-blue-900 bg-blue-300 border-blue-400 hover:bg-blue-400'
                          : 'text-blue-900 bg-blue-200 border-blue-300 hover:bg-blue-300'
                      }`}
                    >
                      {req.voting_open
                        ? 'Close Vote'
                        : 'Open Item for Vote'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <div className="p-5 space-y-5 min-w-0">

              {/* =================================================
                  ACTIVITY
              ================================================== */}
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 min-w-0">

                <SectionLabel
                  icon={Activity}
                  text="Activity"
                />

                <div className="[&_button]:w-full [&_button]:justify-center [&_button]:rounded-lg [&_button]:px-4 [&_button]:py-2.5 [&_button]:font-semibold min-w-0">
                  <RequesterActionPanel
                    req={req}
                    currentEmail={
                      currentEmail
                    }
                  />
                </div>

                {req.request_id_number && (
                  <RequestThread
                    requestIdNumber={
                      req.request_id_number
                    }
                    currentName={
                      currentName
                    }
                    currentEmail={
                      currentEmail
                    }
                    viewerRole={
                      viewerRole
                    }
                  />
                )}
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-w-0">

                <SectionLabel
                  icon={FileText}
                  text="Description"
                />

                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                  {req.description}
                </p>

                {req.location_link && (
                  <a
                    href={
                      req.location_link
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mt-3"
                  >
                    <MapPin
                      className="w-3.5 h-3.5"
                      strokeWidth={2}
                    />

                    View location
                  </a>
                )}
              </div>

              {/* =================================================
                  IMAGES
              ================================================== */}
              {req.images &&
                req.images.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-w-0">

                    <SectionLabel
                      icon={Images}
                      text={`Photos (${req.images.length})`}
                    />

                    <div className="grid grid-cols-3 gap-2">
                      {req.images.map(
                        (img, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() =>
                              setLightboxIndex(
                                i
                              )
                            }
                            className="aspect-square rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity"
                          >
                            <img
                              src={
                                img.thumbnailUrl ||
                                img.url
                              }
                              alt={
                                img.filename
                              }
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* =================================================
                  DETAILS
              ================================================== */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-w-0">

                {/* DETAILS HEADER + TOGGLE */}
                <div className="flex items-center justify-between mb-3">

                  <div className="flex items-center gap-1.5">
                    <Info
                      className="w-3.5 h-3.5 text-slate-400"
                      strokeWidth={2}
                    />

                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Details
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDetailsOpen(
                        (value) => !value
                      )
                    }
                    title={
                      detailsOpen
                        ? 'Hide details'
                        : 'Show details'
                    }
                    aria-label={
                      detailsOpen
                        ? 'Hide details'
                        : 'Show details'
                    }
                    aria-expanded={
                      detailsOpen
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {detailsOpen ? (
                      <ChevronUp
                        className="w-4 h-4"
                        strokeWidth={2}
                      />
                    ) : (
                      <ChevronDown
                        className="w-4 h-4"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                </div>

                {/* DETAILS CONTENT */}
                <AnimatePresence initial={false}>
                  {detailsOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="overflow-hidden"
                    >

                      {/* SUBMITTER */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                          Submitter
                        </p>

                        <DetailRow
                          label="Name"
                          value={
                            req.requester_name
                          }
                        />

                        <DetailRow
                          label="Email"
                          value={
                            req.requester_email
                          }
                        />

                        {req.phone && (
                          <DetailRow
                            label="Phone"
                            value={
                              req.phone
                            }
                          />
                        )}

                        {req.unit_address && (
                          <DetailRow
                            label="Unit / Address"
                            value={
                              req.unit_address
                            }
                          />
                        )}

                        <DetailRow
                          label="Submitted via"
                          value={
                            req.submitted_via
                          }
                        />
                      </div>

                      {/* TIMELINE */}
                      <div className="mt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                          Timeline
                        </p>

                        <DetailRow
                          label="Submitted"
                          value={
                            req.submitted_date
                              ? new Date(
                                  req.submitted_date
                                ).toLocaleDateString(
                                  undefined,
                                  {
                                    month:
                                      'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  }
                                )
                              : undefined
                          }
                        />

                        <DetailRow
                          label="Last updated"
                          value={
                            req.last_updated
                              ? new Date(
                                  req.last_updated
                                ).toLocaleDateString(
                                  undefined,
                                  {
                                    month:
                                      'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  }
                                )
                              : undefined
                          }
                        />

                        {req.closed_date && (
                          <DetailRow
                            label="Closed"
                            value={
                              new Date(
                                req.closed_date
                              ).toLocaleDateString(
                                undefined,
                                {
                                  month:
                                    'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )
                            }
                          />
                        )}
                      </div>

                      {/* MANAGEMENT PLAN */}
                      {hasSolutionInfo && (
                        <div className="mt-3">

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                            Management Plan
                          </p>

                          {req.proposed_solution && (
                            <p className="text-sm text-slate-700 mb-2 leading-relaxed break-words">
                              {
                                req.proposed_solution
                              }
                            </p>
                          )}

                          <DetailRow
                            label="Estimated cost"
                            value={
                              req.estimated_cost
                            }
                          />

                          <DetailRow
                            label="Target date"
                            value={
                              req.management_due_date
                                ? new Date(
                                    req.management_due_date
                                  ).toLocaleDateString(
                                    undefined,
                                    {
                                      month:
                                        'short',
                                      day: 'numeric',
                                    }
                                  )
                                : undefined
                            }
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* =================================================
                  VOTING INFORMATION
              ================================================== */}
              {req.voting_open && (
                <Link
                  href={
                    viewerRole ===
                    'management'
                      ? '/management/votes'
                      : '/board/votes'
                  }
                  className="flex items-center justify-between gap-2 bg-amber-100 rounded-2xl px-4 py-3 hover:bg-amber-200/70 transition-colors"
                >
                  <div className="flex items-center gap-2">

                    <Gavel
                      className="w-4 h-4 text-amber-700"
                      strokeWidth={2}
                    />

                    <span className="text-sm font-medium text-amber-700">
                      Open for board vote
                    </span>
                  </div>

                  <span className="text-xs text-amber-700 underline underline-offset-2">
                    View Vote
                  </span>
                </Link>
              )}

              {/* =================================================
                  CLOSE REQUEST
              ================================================== */}
              {allowClose &&
                !isClosed && (
                  <button
                    type="button"
                    onClick={() =>
                      setConfirming(
                        true
                      )
                    }
                    className="w-full text-xs font-bold text-red-900 bg-red-200 border border-red-300 hover:bg-red-300 rounded-lg px-4 py-2.5 transition-colors"
                  >
                    Close Request
                  </button>
                )}
            </div>
          </motion.div>
        </>
      )}

      {/* ============================================================
          CLOSE CONFIRMATION
      ============================================================ */}
      <ConfirmModal
        open={confirming}
        title="Close this request?"
        description="This marks the request as closed. This action can be reversed manually in Airtable if needed, but it will no longer show as open."
        confirmLabel="Close Request"
        onConfirm={
          handleConfirmClose
        }
        onCancel={() =>
          setConfirming(false)
        }
        loading={closing}
      />

      {/* ============================================================
          LIGHTBOX
      ============================================================ */}
      <AnimatePresence>
        {lightboxIndex !== null &&
          req.images &&
          req.images[
            lightboxIndex
          ] && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center"
              onClick={() =>
                setLightboxIndex(
                  null
                )
              }
            >
              {/* CLOSE */}
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    null
                  )
                }
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X
                  className="w-5 h-5"
                  strokeWidth={2}
                />
              </button>

              {/* PREVIOUS */}
              {req.images.length >
                1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()

                    setLightboxIndex(
                      (i) =>
                        i! > 0
                          ? i! - 1
                          : req
                              .images!
                              .length -
                            1
                    )
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft
                    className="w-5 h-5"
                    strokeWidth={2}
                  />
                </button>
              )}

              {/* IMAGE */}
              <img
                src={
                  req.images[
                    lightboxIndex
                  ].url
                }
                alt={
                  req.images[
                    lightboxIndex
                  ].filename
                }
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              />

              {/* NEXT */}
              {req.images.length >
                1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()

                    setLightboxIndex(
                      (i) =>
                        i! <
                        req.images!
                          .length -
                          1
                          ? i! + 1
                          : 0
                    )
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight
                    className="w-5 h-5"
                    strokeWidth={2}
                  />
                </button>
              )}

              {/* COUNTER */}
              {req.images.length >
                1 && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs font-medium">
                  {lightboxIndex +
                    1}{' '}
                  /{' '}
                  {
                    req.images
                      .length
                  }
                </span>
              )}
            </motion.div>
          )}
      </AnimatePresence>
    </AnimatePresence>
  )
}