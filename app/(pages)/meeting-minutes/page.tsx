'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, Calendar, Users } from 'lucide-react'
import { getAllMeetingMinutes } from '@/lib/airtable'
import { formatDate } from '@/lib/utils'
import { useEffect, useState } from 'react'
import type { MeetingMinutes } from '@/lib/types'

export default function MeetingMinutesPage() {
  const [meetings, setMeetings] = useState<MeetingMinutes[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadMeetings() {
      const data = await getAllMeetingMinutes()
      setMeetings(data)
      setIsLoading(false)
    }
    loadMeetings()
  }, [])

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-block mb-4">
            <div className="h-1 w-12 bg-accent rounded-full" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            Meeting Minutes
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Stay informed with summaries and detailed notes from Grand Mission HOA meetings. Review discussions, decisions, and action items from our community leadership.
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-border p-12 text-center"
          >
            <p className="text-muted-foreground text-lg">Loading...</p>
          </motion.div>
        ) : meetings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-border p-12 text-center"
          >
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">
              No meeting minutes available yet. Check back soon for updates.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting, index) => (
              <Link key={meeting.id} href={`/meeting-minutes/${meeting.slug}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="h-full bg-white border border-border rounded-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Date Badge */}
                  <div className="flex items-center gap-2 text-accent mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {formatDate(meeting.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                    {meeting.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                    {meeting.summary}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 border-t border-border pt-4">
                    {meeting.attendees && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {meeting.attendees}
                        </span>
                      </div>
                    )}
                    {meeting.decisions_made && (
                      <div className="text-xs text-accent font-semibold">
                        {meeting.decisions_made.split(',').length} Key Decisions
                      </div>
                    )}
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors">
                      View Details
                      <span>→</span>
                    </span>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
