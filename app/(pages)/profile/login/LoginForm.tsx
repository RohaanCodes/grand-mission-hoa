'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { requestLoginLinkAction } from './actions'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await requestLoginLinkAction(email)
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-xl shadow-sm p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6 text-secondary"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </motion.div>
          <h2 className="font-serif text-xl text-primary mb-2">Check your inbox</h2>
          <p className="text-foreground/70 text-sm leading-relaxed">
            If an account exists for{' '}
            <span className="font-medium text-foreground">{email}</span>,
            you'll receive an email shortly with your login link.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-xl shadow-sm p-8 space-y-6"
        >
          <label className="block">
            <span className="block text-sm font-medium text-foreground mb-2">
              Email
            </span>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-border rounded-md px-4 py-2.5 text-foreground bg-background placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:opacity-90 text-accent-foreground font-medium py-3 rounded-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-accent-foreground/40 border-t-accent-foreground rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              'Send Login Link'
            )}
          </button>

          <p className="text-center text-xs text-foreground/50">
            Don't have a profile yet?{' '}
            <a href="/requests/new" className="text-primary underline underline-offset-2">
              Submit your first request
            </a>{' '}
            to get started.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}