'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { RequestCategory } from '@/lib/types'
import { submitBoardRequestAction } from './actions'

export default function BoardRequestForm({
  categories,
}: {
  categories: RequestCategory[]
}) {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [locationLink, setLocationLink] = useState('')
  const [votingOpen, setVotingOpen] = useState(false)
  const [starThis, setStarThis] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const result = await submitBoardRequestAction({
      category,
      description,
      locationLink: locationLink || undefined,
      votingOpen,
      starThis,
    })
    setSubmitting(false)
    if (result.success) {
      setSubmitted(true)
    }
  }

  function handleLogAnother() {
    setCategory('')
    setDescription('')
    setLocationLink('')
    setVotingOpen(false)
    setStarThis(false)
    setSubmitted(false)
  }

  return (
    <>
      <Link
        href="/board/"
        className="fixed top-24 left-6 z-40 group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 group-hover:-translate-x-0.5 group-hover:border-slate-300">
          <ArrowLeft size={16} strokeWidth={1.8} />
        </span>
        <span>Dashboard</span>
      </Link>

      {submitted ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 text-center space-y-6">
          <div className="space-y-2">
            <span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
            </span>
            <h2 className="text-xl font-semibold text-slate-900">Request submitted</h2>
            <p className="text-sm text-slate-500">Your request has been successfully submitted.</p>
          </div>
          <button
            type="button"
            onClick={handleLogAnother}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 active:scale-[0.98]"
          >
            Log Another Request
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 space-y-6"
        >
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-2">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            >
              <option value="">Not Sure / Let System Decide</option>
              {categories.map((c) => (
                <option key={c.id} value={c.category_name}>{c.category_name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-2">Description</span>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none resize-y transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-2">Location link (optional)</span>
            <input
              type="url"
              placeholder="Paste a Google Maps link"
              value={locationLink}
              onChange={(e) => setLocationLink(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </label>

          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={votingOpen}
              onChange={(e) => setVotingOpen(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 accent-blue-600"
            />
            <span className="font-medium text-slate-700">Open this for a board vote</span>
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
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      )}
    </>
  )
}