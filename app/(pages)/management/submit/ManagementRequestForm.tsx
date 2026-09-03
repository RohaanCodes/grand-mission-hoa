'use client'
import { useState } from 'react'
import type { RequestCategory } from '@/lib/types'
import { submitManagementRequestAction } from './actions'

export default function ManagementRequestForm({ categories }: { categories: RequestCategory[] }) {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [proposedSolution, setProposedSolution] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [locationLink, setLocationLink] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const result = await submitManagementRequestAction({
      category, description, proposedSolution, dueDate, estimatedCost,
      locationLink: locationLink || undefined,
    })
    setSubmitting(false)
    if (result.success) setSubmitted(true)
  }

  if (submitted) {
    return <div className="bg-card border border-border rounded-lg p-6">Logged. You can view it on your dashboard.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
      <label className="block">
        <span className="block text-sm font-medium mb-2">Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-border rounded-md px-4 py-2.5 bg-background">
          <option value="">Other</option>
          {categories.map((c) => <option key={c.id} value={c.category_name}>{c.category_name}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Description</span>
        <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-border rounded-md px-4 py-2.5 bg-background" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Proposed solution (optional)</span>
        <textarea rows={3} value={proposedSolution} onChange={(e) => setProposedSolution(e.target.value)} className="w-full border border-border rounded-md px-4 py-2.5 bg-background" />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-medium mb-2">Target date (optional)</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-border rounded-md px-4 py-2.5 bg-background" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-2">Est. cost (optional)</span>
          <input type="text" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} className="w-full border border-border rounded-md px-4 py-2.5 bg-background" />
        </label>
      </div>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Location link (optional)</span>
        <input
          type="url"
          placeholder="Paste a Google Maps link"
          value={locationLink}
          onChange={(e) => setLocationLink(e.target.value)}
          className="w-full border border-border rounded-md px-4 py-2.5 bg-background"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-accent text-accent-foreground font-medium py-3 rounded-md disabled:opacity-60"
      >
        {submitting ? 'Logging…' : 'Log Item'}
      </button>
    </form>
  )
}