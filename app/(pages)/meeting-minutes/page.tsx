'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Calendar, Users, CheckSquare, ChevronRight } from 'lucide-react'
import { getAllMeetingMinutes } from '@/lib/airtable'
import { formatDate } from '@/lib/utils'
import type { MeetingMinutes } from '@/lib/types'
import { useRouter } from 'next/navigation';

export default function MeetingMinutesPage() {
  const [meetings, setMeetings] = useState<MeetingMinutes[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter();

useEffect(() => {
  const validated = localStorage.getItem('meeting_minutes_access');
  const expiry = localStorage.getItem('meeting_minutes_access_expiry');

  if (!validated || !expiry || new Date(expiry) < new Date()) {
    router.push('/meeting-minutes/gateway');
  }
}, [router]);

  useEffect(() => {
    async function loadMeetings() {
      try {
        const data = await getAllMeetingMinutes()
        setMeetings(data)
      } catch (error) {
        console.error('Error fetching meetings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMeetings()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50/30 pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <div className="inline-block mb-3">
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Meeting Minutes
          </h1>
          <p className="text-sm sm:text-base text-slate-550 max-w-3xl leading-relaxed">
            Stay informed with summaries and detailed notes from Grand Mission HOA meetings. Review regular proceedings, official decisions, and key community agenda items.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-3xs">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-slate-500 font-medium text-sm">Opening archive records...</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-3xs">
            <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-550 text-sm">
              No meeting minutes are currently registered in our database. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting, index) => (
              <motion.article
                key={meeting.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="group flex flex-col justify-between bg-white border border-slate-200/80 hover:border-amber-400 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Date Tag */}
                  <div className="flex items-center gap-2 text-amber-800 mb-4 bg-amber-50/50 border border-amber-200/35 px-2.5 py-1 rounded-md w-fit">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {formatDate(meeting.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-900 transition-colors mb-2.5 line-clamp-2 leading-snug">
                    {meeting.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-slate-500 text-xs sm:text-sm mb-5 leading-relaxed line-clamp-3">
                    {meeting.summary}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {/* Metadata Stats */}
                  <div className="space-y-2 text-[11px] sm:text-xs text-slate-500 font-medium">
                    {meeting.attendees && (
                      <div className="flex items-start gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{meeting.attendees}</span>
                      </div>
                    )}
                    {meeting.decisions_made && (
                      <div className="flex items-start gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{meeting.decisions_made}</span>
                      </div>
                    )}
                  </div>

                  {/* Detailing Link */}
                  <Link
                    href={`/meeting-minutes/${meeting.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-900 font-bold uppercase tracking-wider group-hover:text-amber-800 transition-colors pt-1"
                  >
                    View Proceedings
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
