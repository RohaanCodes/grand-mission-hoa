'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Download, Calendar, Users, CheckSquare, ListTodo } from 'lucide-react'
import { getMeetingMinutesBySlug } from '@/lib/airtable'
import { formatDate } from '@/lib/utils'
import type { MeetingMinutes } from '@/lib/types'

export default function MeetingDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [meeting, setMeeting] = useState<MeetingMinutes | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    const fetchMeeting = async () => {
      try {
        const data = await getMeetingMinutesBySlug(slug)
        setMeeting(data)
      } catch (error) {
        console.error('Error fetching meeting:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeeting()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading meeting minutes...</p>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Meeting not found</h1>
          <Link href="/meeting-minutes" className="text-primary hover:underline">
            ← Back to All Meetings
          </Link>
        </div>
      </div>
    )
  }

  // Parse fields (support comma or pipe separators)
  const topicsArray = meeting.topics_discussed
    ? meeting.topics_discussed.split(/[,|]/).map(t => t.trim()).filter(Boolean)
    : []

  const decisionsArray = meeting.decisions_made
    ? meeting.decisions_made.split(/[,|]/).map(d => d.trim()).filter(Boolean)
    : []

  const actionItemsArray = meeting.action_items
    ? meeting.action_items.split(/[,|]/).map(a => a.trim()).filter(Boolean)
    : []

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Rectangular Glassmorphism Back Button */}
<div className="max-w-4xl mx-auto px-4 py-8">
  <Link
    href="/meeting-minutes"
    className="inline-flex items-center gap-2 px-6 py-3 
               bg-white border-2 border-border 
               hover:bg-primary hover:text-white hover:border-primary 
               rounded-xl text-foreground font-medium 
               transition-all duration-300 shadow-sm hover:shadow-md"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Meeting Minutes
  </Link>
</div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg border border-border p-8 md:p-12"
        >
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-accent">
                <Calendar className="w-5 h-5" />
                <time className="text-sm font-semibold">{formatDate(meeting.date)}</time>
              </div>

              {meeting.document_url && (
                <a
                  href={meeting.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Full PDF
                </a>
              )}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {meeting.title}
            </h1>

            {meeting.attendees && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <p><strong>Attendees:</strong> {meeting.attendees}</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">Summary</h2>
            <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
              {meeting.summary}
            </p>
          </section>

          {/* Topics Discussed */}
          {topicsArray.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-accent rounded" />
                Topics Discussed
              </h2>
              <ul className="space-y-4">
                {topicsArray.map((topic, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                    <span className="text-foreground leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Key Decisions */}
          {decisionsArray.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                <CheckSquare className="w-6 h-6 text-accent" />
                Key Decisions
              </h2>
              <div className="bg-accent/5 border-l-4 border-accent p-6 rounded-lg">
                <ul className="space-y-4">
                  {decisionsArray.map((decision, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckSquare className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground leading-relaxed">{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Action Items */}
          {actionItemsArray.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                <ListTodo className="w-6 h-6 text-primary" />
                Action Items
              </h2>
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg">
                <ul className="space-y-4">
                  {actionItemsArray.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded border-2 border-primary text-primary font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </motion.article>
      </div>
    </main>
  )
}