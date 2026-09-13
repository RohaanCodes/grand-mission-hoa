// app/(pages)/board/RequesterActionPanel.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, MessageCircleQuestion } from 'lucide-react'
import { submitInfoResponseAction, submitConfirmationAction } from './requesterActions'
import type { ServiceRequest } from '@/lib/types'

// Shows only when the person viewing this request IS the original requester,
// whether they're a resident, a board member, or management viewing their
// own submission. The automations that process these don't check role,
// only the requester's identity matters here.
export default function RequesterActionPanel({
  req,
  currentEmail,
}: {
  req: ServiceRequest
  currentEmail: string
}) {
  const router = useRouter()
  const [infoText, setInfoText] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isRequester = req.requester_email?.toLowerCase() === currentEmail.toLowerCase()
  const needsInfo = req.status === 'Awaiting Resident Info'
  const needsConfirmation = req.status === 'Resolved' && req.resident_confirmation === 'Pending'

  if (!isRequester || (!needsInfo && !needsConfirmation)) return null
  if (!req.request_id_number) return null

  async function handleSubmitInfo(e: React.FormEvent) {
    e.preventDefault()
    if (!infoText.trim() || submitting) return
    setSubmitting(true)
    await submitInfoResponseAction(req.request_id_number!, infoText)
    setSubmitting(false)
    setSubmitted(true)
    router.refresh()
  }

  async function handleConfirmation(confirmation: 'Confirmed - Issue is Fixed' | 'Disputed - Not Actually Fixed') {
    if (submitting) return
    setSubmitting(true)
    await submitConfirmationAction(req.request_id_number!, confirmation, notes || undefined)
    setSubmitting(false)
    setSubmitted(true)
    router.refresh()
  }

  if (submitted) {
    return (
      <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={2} />
        <p className="text-sm text-green-700">Thanks, that's been sent.</p>
      </div>
    )
  }

  if (needsInfo) {
    return (
      <form onSubmit={handleSubmitInfo} className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-1.5 text-blue-700">
          <MessageCircleQuestion className="w-4 h-4" strokeWidth={2} />
          <p className="text-sm font-semibold">Management needs more information</p>
        </div>
        {req.info_requested && <p className="text-sm text-slate-700">{req.info_requested}</p>}
        <textarea
          required
          rows={3}
          value={infoText}
          onChange={(e) => setInfoText(e.target.value)}
          placeholder="Type your answer here"
          className="w-full text-sm border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Submit Answer'}
        </button>
      </form>
    )
  }

  if (needsConfirmation) {
    return (
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2.5">
        <p className="text-sm font-semibold text-amber-700">Management marked this resolved, is it actually fixed?</p>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes, especially if you're disputing this"
          className="w-full text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleConfirmation('Confirmed - Issue is Fixed')}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            Yes, it's fixed
          </button>
          <button
            onClick={() => handleConfirmation('Disputed - Not Actually Fixed')}
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            No, reopen this
          </button>
        </div>
      </div>
    )
  }

  return null
}