'use client'
import { useState } from 'react'
import { requestBoardLinkAction } from './actions'

export default function BoardLoginForm() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await requestBoardLinkAction(email)
    setSubmitting(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-sm text-foreground/80">
        If that email matches a board member, a sign-in link has been sent.
        It expires in 15 minutes.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <label className="block">
        <span className="block text-sm font-medium mb-2">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border rounded-md px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-accent text-accent-foreground font-medium py-3 rounded-md disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send Sign-In Link'}
      </button>
    </form>
  )
}