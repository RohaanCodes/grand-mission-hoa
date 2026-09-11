// app/(pages)/management/submit/ManagementRequestForm.tsx
'use client'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { RequestCategory } from '@/lib/types'
import { submitManagementRequestAction } from './actions'

export default function ManagementRequestForm({ categories }: { categories: RequestCategory[] }) {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [proposedSolution, setProposedSolution] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [locationLink, setLocationLink] = useState('')
  const [votingOpen, setVotingOpen] = useState(false)
  const [starThis, setStarThis] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const result = await submitManagementRequestAction({
      category, description, proposedSolution, dueDate, estimatedCost,
      locationLink: locationLink || undefined,
      votingOpen,
      starThis,
    })
    setSubmitting(false)
    if (result.success) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 text-center space-y-3">
        <span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
        </span>
        <p className="text-slate-700 font-medium">Logged. You can view it on your dashboard.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 space-y-6">
      <label className="block">
        <span className="block text-sm font-medium text-slate-700 mb-2">Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
          <option value="">Other</option>
          {categories.map((c) => <option key={c.id} value={c.category_name}>{c.category_name}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700 mb-2">Description</span>
        <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700 mb-2">Proposed solution (optional)</span>
        <textarea rows={3} value={proposedSolution} onChange={(e) => setProposedSolution(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-2">Target date (optional)</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-2">Est. cost (optional)</span>
          <input type="text" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
        </label>
      </div>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700 mb-2">Location link (optional)</span>
        <input
          type="url"
          placeholder="Paste a Google Maps link"
          value={locationLink}
          onChange={(e) => setLocationLink(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </label>
      <label className="flex items-center gap-2.5 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={votingOpen}
          onChange={(e) => setVotingOpen(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 accent-blue-600"
        />
        <span className="font-medium text-slate-700">Require a board vote on this</span>
      </label>
      <label className="flex items-center gap-2.5 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={starThis}
          onChange={(e) => setStarThis(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 accent-blue-600"
        />
        <span className="font-medium text-slate-700">Star this for yourself</span>
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60"
      >
        {submitting ? 'Logging…' : 'Log Item'}
      </button>
    </form>
  )
}