// app/(pages)/board/TriagePanel.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ClipboardCheck,
  CheckCircle2,
} from 'lucide-react'
import { submitTriageAction } from './triageActions'

type UpdateType =
  | 'In Progress'
  | 'Resolved'
  | 'Need More Info From Resident'

export default function TriagePanel({
  requestIdNumber,
  currentName,
  currentEmail,
}: {
  requestIdNumber: number
  currentName: string
  currentEmail: string
}) {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const [updateType, setUpdateType] =
    useState<UpdateType>('In Progress')

  const [proposedSolution, setProposedSolution] =
    useState('')

  const [dueDate, setDueDate] = useState('')

  const [additionalNotes, setAdditionalNotes] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const [submitted, setSubmitted] =
    useState(false)

  /*
   * Reset the local panel state when the drawer changes
   * to another request.
   */
  useEffect(() => {
    setOpen(false)
    setSubmitted(false)
    setUpdateType('In Progress')
    setProposedSolution('')
    setDueDate('')
    setAdditionalNotes('')
    setSubmitting(false)
  }, [requestIdNumber])

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (submitting) return

    setSubmitting(true)

    try {
      await submitTriageAction({
        requestIdNumber,

        updateType,

        proposedSolution:
          updateType !==
          'Need More Info From Resident'
            ? proposedSolution
            : undefined,

        dueDate:
          updateType === 'In Progress' &&
          dueDate
            ? dueDate
            : undefined,

        additionalNotes:
          updateType ===
          'Need More Info From Resident'
            ? additionalNotes
            : undefined,

        askedByName: currentName,
        askedByEmail: currentEmail,
      })

      setOpen(false)
      setSubmitted(true)

      router.refresh()
    } catch (error) {
      console.error(
        'Failed to submit triage update:',
        error
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleToggle() {
    /*
     * If a previous submission succeeded, opening the
     * panel again clears the success message.
     */
    if (submitted) {
      setSubmitted(false)
    }

    setOpen((value) => !value)
  }

  function handleCancel() {
    setOpen(false)
  }

  return (
    /*
     * IMPORTANT:
     *
     * "contents" means this wrapper does not become an
     * independent flex item.
     *
     * The trigger button participates directly in the
     * parent's action-button row.
     *
     * The expanded form below uses:
     *
     *   basis-full
     *   order-last
     *
     * so it gets its own complete row AFTER Note and
     * Open Item for Vote.
     *
     * This is what prevents those buttons from moving.
     */
    <div className="contents">

      {/* =========================================================
          TRIAGE TRIGGER BUTTON
      ========================================================== */}
      <button
        type="button"
        onClick={handleToggle}
        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg px-3.5 py-2 transition-colors whitespace-nowrap"
      >
        <ClipboardCheck
          className="w-3.5 h-3.5"
          strokeWidth={2}
        />

        Submit Triage Update
      </button>

      {/* =========================================================
          SUCCESS MESSAGE
          
          Full-width second row so it never changes the position
          of the action buttons.
      ========================================================== */}
      {submitted && (
        <div className="basis-full order-last min-w-0">
          <div className="mt-2 w-full max-w-[420px] flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <CheckCircle2
              className="w-4 h-4 text-green-600 flex-shrink-0"
              strokeWidth={2}
            />

            <p className="text-xs text-green-700">
              Triage update sent. The resident will hear
              from us shortly.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================
          EXPANDED TRIAGE FORM
          
          IMPORTANT:
          
          basis-full = take an entire new row
          order-last  = appear AFTER all action buttons
          
          Therefore the layout becomes:
          
          [Triage] [Note] [Vote]
          [       Triage Form       ]
          
          instead of:
          
          [Triage Form] [Note] [Vote]
          
          This keeps the other buttons exactly where they were.
      ========================================================== */}
      {open && !submitted && (
        <div className="basis-full order-last min-w-0">
          <form
            onSubmit={handleSubmit}
            className="mt-2 w-full max-w-[420px] bg-white border border-slate-200 rounded-xl p-4 shadow-xl"
          >

            {/* =====================================================
                UPDATE TYPE
            ====================================================== */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Update Type
              </label>

              <div className="flex gap-1.5 min-w-0">
                {(
                  [
                    'In Progress',
                    'Resolved',
                    'Need More Info From Resident',
                  ] as const
                ).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setUpdateType(type)
                    }
                    className={`flex-1 min-w-0 text-[11px] font-medium py-1.5 px-2 rounded-lg transition-colors ${
                      updateType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type ===
                    'Need More Info From Resident'
                      ? 'Need More Info'
                      : type}
                  </button>
                ))}
              </div>
            </div>

            {/* =====================================================
                IN PROGRESS
            ====================================================== */}
            {updateType === 'In Progress' && (
              <>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    What's your plan to resolve this?
                  </label>

                  <textarea
                    required
                    rows={2}
                    value={proposedSolution}
                    onChange={(e) =>
                      setProposedSolution(
                        e.target.value
                      )
                    }
                    className="w-full min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Due date (optional)
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                    className="w-full min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </>
            )}

            {/* =====================================================
                RESOLVED
            ====================================================== */}
            {updateType === 'Resolved' && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  What was done?
                </label>

                <textarea
                  required
                  rows={3}
                  value={proposedSolution}
                  onChange={(e) =>
                    setProposedSolution(
                      e.target.value
                    )
                  }
                  className="w-full min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />

                <p className="text-[11px] text-slate-500 mt-1.5">
                  The resident will get an email asking
                  them to confirm this is fully resolved.
                </p>
              </div>
            )}

            {/* =====================================================
                NEED MORE INFO
            ====================================================== */}
            {updateType ===
              'Need More Info From Resident' && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  What information do you need?
                </label>

                <textarea
                  required
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) =>
                    setAdditionalNotes(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Please share a photo of the affected area"
                  className="w-full min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />

                <p className="text-[11px] text-slate-500 mt-1.5">
                  This will also appear as a question in
                  the request thread below, so it's tracked
                  here too.
                </p>
              </div>
            )}

            {/* =====================================================
                FORM ACTIONS
            ====================================================== */}
            <div className="flex items-center gap-2 pt-3">

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? 'Sending…'
                  : 'Send Update'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-2 disabled:opacity-50"
              >
                Cancel
              </button>

            </div>
          </form>
        </div>
      )}
    </div>
  )
}