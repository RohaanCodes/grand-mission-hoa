'use client'
import { useState } from 'react'
import { submitQueryResponseAction } from './actions'

export default function QueryResponseForm({ queryId }: { queryId: string }) {
  const [response, setResponse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await submitQueryResponseAction(queryId, response)
    setSubmitting(false)
    setDone(true)
  }

  if (done) return <div className="bg-card border border-border rounded-lg p-6">Response sent.</div>

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <textarea required rows={5} value={response} onChange={(e) => setResponse(e.target.value)}
        className="w-full border border-border rounded-md px-4 py-2.5 bg-background" placeholder="Your response…" />
      <button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground font-medium py-3 rounded-md disabled:opacity-60">
        {submitting ? 'Sending…' : 'Send Response'}
      </button>
    </form>
  )
}