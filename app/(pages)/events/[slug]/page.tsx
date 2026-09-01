'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getEventBySlug } from '@/lib/airtable'
import { formatDate } from '@/lib/utils'
import type { Event } from '@/lib/types'
import { ArrowLeft, Calendar, MapPin, Clock, Mail, Phone, MapPinIcon, Award, User } from 'lucide-react'

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventBySlug(slug)
        setEvent(data)
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchEvent()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50/40 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
          <Calendar className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-slate-950 mb-2">Event not found</h1>
          <p className="text-slate-500 mb-6 text-sm">The event you are looking for may have passed or does not exist.</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-98 cursor-pointer select-none touch-manipulation min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Modern breadcrumbs navigation for seamless returns */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 px-3.5 py-2 bg-white/80 hover:bg-white border border-slate-200/65 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-amber-700 transition-all shadow-2xs active:scale-[0.98] select-none touch-manipulation min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-all" />
            Back to Events
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column - Description */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Banner Image with beautiful shadow-sm & frame sizing */}
            {event['Banner Image'] && event['Banner Image'].length > 0 ? (
              <div className="rounded-2xl overflow-hidden shadow-sm aspect-video sm:aspect-21/9 lg:aspect-16/10 bg-slate-100 relative border border-slate-100">
                <img
                  src={event['Banner Image'][0].url}
                  alt={event['Event Name']}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl aspect-video sm:aspect-21/9 lg:aspect-16/10 bg-gradient-to-br from-indigo-50 to-amber-50/40 flex items-center justify-center border border-slate-100">
                <Calendar className="w-16 h-16 text-indigo-200" />
              </div>
            )}

            {/* Title & Meta Header */}
            <div>
              {event['Event Category'] && (
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-3">
                  {event['Event Category']}
                </span>
              )}
              <h1 className="font-serif text-2xl sm:text-3.5xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                {event['Event Name']}
              </h1>
              
              {/* Event metadata items in an easy-to-read grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-200/60 py-4 text-xs sm:text-sm font-medium text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Start Date</p>
                    <span className="text-slate-800">{formatDate(event['Event Date'])}</span>
                  </div>
                </div>
                {event['End Date'] && (
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">End Date</p>
                      <span className="text-slate-800">{formatDate(event['End Date'])}</span>
                    </div>
                  </div>
                )}
                {event.Location && (
                  <div className="flex items-start gap-2.5 sm:col-span-2 border-t border-slate-100/60 pt-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Location</p>
                      <span className="text-slate-800">{event.Location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.Description && (
              <div className="bg-white border border-slate-100/60 p-6 sm:p-8 rounded-2xl shadow-xs">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Event Details
                </h3>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-650 text-justify whitespace-pre-line">
                  {event.Description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sponsors list to enrich active engagement */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Sponsors Header */}
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <Award className="w-6 h-6 text-amber-600" />
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                    Proud Sponsors
                  </h2>
                </div>
                <p className="font-sans text-xs sm:text-sm text-slate-500 pl-8.5 leading-tight">
                  Supporting our beautiful community activities and neighborhood bonds
                </p>
              </div>

              {/* Sponsors List */}
              {event.sponsors && event.sponsors.length > 0 ? (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {event.sponsors.map((sponsor, index) => {
                    const displayName = sponsor['Brand Name'] || sponsor['Sponsor Name / Business']
                    const subName = sponsor['Brand Name'] && sponsor['Brand Name'] !== sponsor['Sponsor Name / Business'] 
                      ? sponsor['Sponsor Name / Business'] 
                      : null
                    const logoUrl = sponsor.Logo && sponsor.Logo.length > 0 ? sponsor.Logo[0].url : null

                    return (
                      <motion.div
                        key={sponsor.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-amber-200 transition-all duration-300"
                      >
                        {/* Sponsor Card - Two Column Layout */}
                        <div className="grid grid-cols-5 h-full">
                          {/* Left - Logo Image (40% width) */}
                          <div className="col-span-2 bg-slate-50 border-r border-slate-100 overflow-hidden relative min-h-[140px] flex items-center justify-center">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={displayName}
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="p-4 flex flex-col items-center justify-center text-center">
                                <Award className="w-10 h-10 text-slate-300 mb-1" />
                                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Logo Unavailable</span>
                              </div>
                            )}
                          </div>

                          {/* Right - Content Section (60% width) */}
                          <div className="col-span-3 p-4 flex flex-col justify-between">
                            {/* Name & Badge */}
                            <div>
                              <h3 className="font-serif font-bold text-sm sm:text-base leading-snug text-slate-900 group-hover:text-amber-700 transition-colors">
                                {displayName}
                              </h3>
                              {subName && (
                                <p className="font-sans text-[11px] text-slate-500 mt-0.5 font-medium">
                                  {subName}
                                </p>
                              )}
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md mt-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Active Sponsor
                              </span>
                            </div>

                            {/* Contact Information */}
                            {(sponsor['Contact Name'] || sponsor['Contact Email'] || sponsor['Contact Phone'] || sponsor['Address']) && (
                              <div className="space-y-1.5 pt-3 border-t border-slate-100 mt-3 text-[11px] font-medium text-slate-600">
                                {sponsor['Contact Name'] && (
                                  <div className="flex items-center gap-2 text-slate-700">
                                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span>{sponsor['Contact Name']}</span>
                                  </div>
                                )}
                                {sponsor['Contact Email'] && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <a 
                                      href={`mailto:${sponsor['Contact Email']}`} 
                                      className="text-slate-500 hover:text-amber-700 hover:underline truncate"
                                    >
                                      {sponsor['Contact Email']}
                                    </a>
                                  </div>
                                )}
                                {sponsor['Contact Phone'] && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <a 
                                      href={`tel:${sponsor['Contact Phone']}`} 
                                      className="text-slate-500 hover:text-amber-700 hover:underline"
                                    >
                                      {sponsor['Contact Phone']}
                                    </a>
                                  </div>
                                )}
                                {sponsor['Address'] && (
                                  <div className="flex items-start gap-2 pt-0.5">
                                    <MapPinIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-500 leading-snug">
                                      {sponsor['Address']}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : (
                <div className="bg-gradient-to-br from-indigo-50/50 to-amber-50/20 border border-slate-200/50 rounded-xl p-8 text-center shadow-xs">
                  <p className="font-sans text-slate-500 text-sm leading-relaxed">
                    No sponsors yet for this event. Reach out to the HOA manager if you are interested in sponsoring!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}