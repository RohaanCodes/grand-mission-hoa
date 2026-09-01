'use client'
import { useState } from 'react'
import type { RequestCategory } from '@/lib/types'
import { submitBoardRequestAction } from './actions'

export default function BoardRequestForm({ categories }: { categories: RequestCategory[] }) {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const result = await submitBoardRequestAction({ category, description })
    setSubmitting(false)
    if (result.success) setSubmitted(true)
  }

  if (submitted) {
    return <div className="bg-card border border-border rounded-lg p-6">Request submitted.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
      <label className="block">
        <span className="block text-sm font-medium mb-2">Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-border rounded-md px-4 py-2.5 bg-background"
        >
          <option value="">Not Sure / Let System Decide</option>
          {categories.map((c) => (
            <option key={c.id} value={c.category_name}>{c.category_name}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Description</span>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-border rounded-md px-4 py-2.5 bg-background"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-accent text-accent-foreground font-medium py-3 rounded-md disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Request'}
      </button>
    </form>
  )
}