'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { RequestCategory } from '@/lib/types'
import { submitRequestAction } from './actions'

interface PrefillData {
  requesterName: string
  requesterEmail: string
  unitAddress: string
  phone: string
}

interface RequestFormProps {
  categories: RequestCategory[]
  prefill?: PrefillData | null
}

export default function RequestForm({ categories, prefill }: RequestFormProps) {
  const [requesterName, setRequesterName] = useState(prefill?.requesterName || '')
  const [requesterEmail, setRequesterEmail] = useState(prefill?.requesterEmail || '')
  const [unitAddress, setUnitAddress] = useState(prefill?.unitAddress || '')
  const [phone, setPhone] = useState(prefill?.phone || '')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [isNotMe, setIsNotMe] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  function clearPrefill() {
    setRequesterName('')
    setRequesterEmail('')
    setUnitAddress('')
    setPhone('')
    setIsNotMe(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(false)

    const result = await submitRequestAction({
      requesterName,
      requesterEmail,
      unitAddress,
      phone,
      category: category || 'Not Sure / Let System Decide',
      description,
    })

    setSubmitting(false)

    if (result.success) {
      setSubmitted(true)
    } else {
      setError(true)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-accent/30 rounded-lg shadow-sm p-10 text-center"
      >
        <h2 className="font-serif text-2xl text-primary mb-3">
          Request received
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          Thanks, {requesterName.split(' ')[0] || 'there'} — we've got your
          request and you'll hear from us shortly by email at{' '}
          <span className="font-medium">{requesterEmail}</span>.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-lg shadow-sm p-8 md:p-10 space-y-8"
    >
      {prefill && !isNotMe && (
        <div className="flex items-center justify-between gap-3 bg-primary/5 border border-primary/10 rounded-md px-4 py-3 text-sm">
          <span className="text-foreground/80">
            Submitting as <span className="font-medium text-primary">{prefill.requesterName}</span>
          </span>
          <button
            type="button"
            onClick={clearPrefill}
            className="text-primary underline underline-offset-2 whitespace-nowrap"
          >
            Not you?
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Full name" required>
          <input
            type="text"
            required
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            required
            value={requesterEmail}
            onChange={(e) => setRequesterEmail(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Unit / Address" required>
          <input
            type="text"
            required
            value={unitAddress}
            onChange={(e) => setUnitAddress(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Phone" required>
  <input
    type="tel"
    required
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className={inputClass}
  />
</Field>
      </div>

      <Field label="Category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">Not Sure / Let System Decide</option>
          {categories.map((c) => (
            <option key={c.id} value={c.category_name}>
              {c.category_name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Describe the issue" required>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Tell us what's going on — the more detail, the better we can help."
        />
      </Field>

      {error && (
        <p className="text-destructive text-sm">
          Something went wrong submitting your request. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-accent hover:opacity-90 text-accent-foreground font-medium py-3 rounded-md transition-all disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Request'}
      </button>
    </motion.form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full border border-border rounded-md px-4 py-2.5 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow'