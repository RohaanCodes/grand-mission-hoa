// app/(pages)/board/TriagePanel.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardCheck, CheckCircle2 } from 'lucide-react'
import { submitTriageAction } from './triageActions'

type UpdateType = 'In Progress' | 'Resolved' | 'Need More Info From Resident'

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
  const [updateType, setUpdateType] = useState<UpdateType>('In Progress')
  const [proposedSolution, setProposedSolution] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await submitTriageAction({
      requestIdNumber,
      updateType,
      proposedSolution: updateType !== 'Need More Info From Resident' ? proposedSolution : undefined,
      dueDate: updateType === 'In Progress' && dueDate ? dueDate : undefined,
      additionalNotes: updateType === 'Need More Info From Resident' ? additionalNotes : undefined,
      askedByName: currentName,
      askedByEmail: currentEmail,
    })
    setSubmitting(false)
    setSubmitted(true)
    router.refresh()
  }

  if (submitted) {
    return (
      <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={2} />
        <p className="text-sm text-green-700">Triage update sent. The resident will hear from us shortly.</p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-full px-3 py-1.5 transition-colors"
      >
        <ClipboardCheck className="w-3.5 h-3.5" strokeWidth={2} />
        Submit Triage Update
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Update Type</label>
        <div className="flex gap-1.5">
          {(['In Progress', 'Resolved', 'Need More Info From Resident'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUpdateType(type)}
              className={`flex-1 text-[11px] font-medium py-1.5 px-2 rounded-lg transition-colors ${
                updateType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type === 'Need More Info From Resident' ? 'Need More Info' : type}
            </button>
          ))}
        </div>
      </div>

      {updateType === 'In Progress' && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">What's your plan to resolve this?</label>
            <textarea
              required
              rows={2}
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Due date (optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </>
      )}

      {updateType === 'Resolved' && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">What was done?</label>
          <textarea
            required
            rows={3}
            value={proposedSolution}
            onChange={(e) => setProposedSolution(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <p className="text-[11px] text-slate-500 mt-1.5">
            The resident will get an email asking them to confirm this is fully resolved.
          </p>
        </div>
      )}

      {updateType === 'Need More Info From Resident' && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">What information do you need?</label>
          <textarea
            required
            rows={2}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g. Please share a photo of the affected area"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <p className="text-[11px] text-slate-500 mt-1.5">
            This will also appear as a question in the request thread below, so it's tracked here too.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send Update'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}