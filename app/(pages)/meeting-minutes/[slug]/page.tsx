'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getMeetingMinutesBySlug } from '@/lib/airtable'
import type { MeetingMinutes } from '@/lib/types'
import { ArrowLeft, Clock, Calendar, Users, CheckSquare, FileText, Download, ListTodo, Info, HelpCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function MeetingMinutesDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [meeting, setMeeting] = useState<MeetingMinutes | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    if (slug) fetchMeeting()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/45 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Opening archive proceedings...</p>
        </div>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-slate-50/45 flex items-center justify-center px-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
          <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">Record Not Found</h1>
          <p className="text-slate-450 mb-6 text-sm">We couldn&apos;t verify these matching archives. They may have been archived or updated.</p>
          <Link
            href="#/meeting-minutes"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-98"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Minutes
          </Link>
        </div>
      </div>
    )
  }

  // Parse fields (support comma or pipe separators) and trim them cleanly
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
    <main className="min-h-screen bg-slate-50/30 text-slate-800 pb-16">
      
      {/* Back button breadcrumb container with modern visual feedback */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          href="#/meeting-minutes"
          className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-amber-500 hover:text-amber-800 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 transition-all shadow-2xs active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-800 transition-all" />
          Back to Minutes
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8"
      >
        {/* Main Content Card Header */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 md:p-10 rounded-2xl shadow-3xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                {formatDate(meeting.date)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-650 rounded-lg text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Official Transcripts
              </span>
            </div>

            
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              {meeting.title}
            </h1>
            <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {meeting.summary}
            </p>
          </div>

          {meeting.attendees && (
            <div className="flex items-start gap-2.5 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
              <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-700 font-semibold">Attendees:</strong> {meeting.attendees}
              </p>
            </div>
          )}
        </div>

        {/* Detailed Logs Box */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-3xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
            Meeting Proceedings & Discussions
          </h3>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-wrap text-justify">
            {meeting.content || 'Official transcribed logs of proceedings are archived here under standard administrative rules.'}
          </p>
        </div>

        {/* Topics Discussed */}
        {topicsArray.length > 0 && (
          <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-3xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              Topics & Agenda Items Discussed
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {topicsArray.map((topic, index) => (
                <li key={index} className="flex gap-2.5 items-start p-3 bg-slate-50/50 border border-slate-200/50 rounded-xl text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Decisions */}
        {decisionsArray.length > 0 && (
          <div className="bg-amber-50/40 border border-amber-200/35 p-6 sm:p-8 rounded-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 pb-3 border-b border-amber-200/35 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-700" />
              Key Legislative Decisions
            </h3>
            <ul className="space-y-3">
              {decisionsArray.map((decision, index) => (
                <li key={index} className="flex gap-3 items-start p-3.5 bg-white/70 border border-amber-200/10 rounded-xl text-slate-700 text-xs sm:text-sm font-medium shadow-3xs leading-relaxed">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{decision}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Items */}
        {actionItemsArray.length > 0 && (
          <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-3xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-amber-600" />
              Assigned Community Action Items
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {actionItemsArray.map((item, index) => (
                <div key={index} className="flex gap-3.5 items-start p-4 bg-slate-50/40 border border-slate-100 rounded-xl">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-800 border border-amber-500/20 shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        

      </motion.div>
    </main>
  )
}