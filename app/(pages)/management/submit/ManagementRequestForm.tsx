// app/(pages)/management/submit/ManagementRequestForm.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { RequestCategory } from '@/lib/types'
import { submitManagementRequestAction } from './actions'
import RequestImagePicker, { PickedImage } from '../../board/RequestImagePicker'
import { uploadRequestImagesAction } from '../../board/requestImagesActions'

export default function ManagementRequestForm({ categories }: { categories: RequestCategory[] }) {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [proposedSolution, setProposedSolution] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [locationLink, setLocationLink] = useState('')
  const [votingOpen, setVotingOpen] = useState(false)
  const [starThis, setStarThis] = useState(false)
  const [images, setImages] = useState<PickedImage[]>([])
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

    if (result.success && result.recordId && images.length > 0) {
      await uploadRequestImagesAction(
        result.recordId,
        images.map((img) => ({
          base64Content: img.base64Content,
          filename: img.filename,
          contentType: img.contentType,
        }))
      )
    }

    setSubmitting(false)
    if (result.success) setSubmitted(true)
  }

  function handleLogAnother() {
    setCategory('')
    setDescription('')
    setProposedSolution('')
    setDueDate('')
    setEstimatedCost('')
    setLocationLink('')
    setVotingOpen(false)
    setStarThis(false)
    setImages([])
    setSubmitted(false)
  }

  return (
    <div>
      {/* Plain, static link — no sticky, no fixed, scrolls away with the
          rest of the page like any normal content. */}
      <Link
        href="/management/"
        className="group inline-flex items-center gap-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-4"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-200 group-hover:-translate-x-0.5 group-hover:border-slate-300">
          <ArrowLeft size={18} strokeWidth={2} />
        </span>
        Back to Dashboard
      </Link>

      {submitted ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 text-center space-y-6">
          <div className="space-y-2">
            <span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
            </span>
            <h2 className="text-xl font-semibold text-slate-900">Logged</h2>
            <p className="text-sm text-slate-500">You can view it on your dashboard.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleLogAnother}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 active:scale-[0.98]"
            >
              Log Another Item
            </button>
            <Link
              href="/management/"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-6 sm:px-8 py-5">
        <h2 className="text-white font-bold text-lg">Item Details</h2>
        <p className="text-blue-100 text-sm mt-0.5">Include a solution and timeline if you already have one</p>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
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

      <RequestImagePicker images={images} onChange={setImages} />

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
      </div>
        </form>
      )}
    </div>
  )
}