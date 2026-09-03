'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const result = await submitBoardRequestAction({
      category,
      description,
      locationLink: locationLink || undefined,
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
    setSubmitted(false)
  }

  return (
    <>
      {/* Persistent Dashboard Navigation */}
      <Link
        href="/board/"
        className="
          fixed
          top-24
          left-6
          z-40
          group
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-foreground/70
          transition-colors
          duration-200
          hover:text-foreground
        "
      >
        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-border/70
            bg-background/80
            backdrop-blur-sm
            shadow-sm
            transition-all
            duration-200
            group-hover:-translate-x-0.5
            group-hover:border-border
            group-hover:bg-card
          "
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.8}
          />
        </span>

        <span>Dashboard</span>
      </Link>

      {/* Form / Success State */}
      {submitted ? (
        <div
          className="
            bg-card
            border
            border-border
            rounded-xl
            p-8
            text-center
            space-y-6
          "
        >
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Request submitted
            </h2>

            <p className="text-sm text-muted-foreground">
              Your request has been successfully submitted.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogAnother}
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-accent
              px-5
              py-3
              text-sm
              font-medium
              text-accent-foreground
              transition-all
              duration-200
              hover:opacity-90
              active:scale-[0.98]
            "
          >
            Log Another Request
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="
            bg-card
            border
            border-border
            rounded-xl
            p-8
            space-y-6
          "
        >
          <label className="block">
            <span className="block text-sm font-medium mb-2">
              Category
            </span>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                w-full
                border
                border-border
                rounded-lg
                px-4
                py-2.5
                bg-background
                outline-none
                transition-colors
                focus:border-foreground/30
              "
            >
              <option value="">
                Not Sure / Let System Decide
              </option>

              {categories.map((c) => (
                <option
                  key={c.id}
                  value={c.category_name}
                >
                  {c.category_name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium mb-2">
              Description
            </span>

            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
                w-full
                border
                border-border
                rounded-lg
                px-4
                py-2.5
                bg-background
                outline-none
                resize-y
                transition-colors
                focus:border-foreground/30
              "
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium mb-2">
              Location link (optional)
            </span>

            <input
              type="url"
              placeholder="Paste a Google Maps link"
              value={locationLink}
              onChange={(e) => setLocationLink(e.target.value)}
              className="
                w-full
                border
                border-border
                rounded-lg
                px-4
                py-2.5
                bg-background
                outline-none
                transition-colors
                focus:border-foreground/30
              "
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="
              w-full
              rounded-lg
              bg-accent
              text-accent-foreground
              font-medium
              py-3
              transition-all
              duration-200
              hover:opacity-90
              active:scale-[0.99]
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {submitting ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      )}
    </>
  )
}