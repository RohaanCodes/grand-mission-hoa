'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getAllEvents } from '@/lib/airtable'
import type { Event } from '@/lib/types'
import { Calendar, MapPin, ChevronLeft, X, Trophy } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false)
      }
    }
    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isPanelOpen])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Group events by category
  const groupedEvents = events.reduce((acc, event) => {
    const category = event['Event Category']?.trim() || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  const sortedCategories = Object.keys(groupedEvents).sort()

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800">
      
      {/* Header - Consistent with Gallery portfolio spacing */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded inline-block mb-3.5">
              Active Community
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Events & Calendar
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Join us for exciting, memory-making seasonal events and healthy activities at Grand Mission. Meet your neighbors, get involved, and strengthen community bonds.
            </p>
          </div>

          {/* Trigger Button - Enhanced for finger target alignment */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white rounded-xl transition-all font-bold text-sm tracking-wide shadow-sm hover:shadow-md cursor-pointer self-start md:self-end min-h-[44px] select-none touch-manipulation"
          >
            <Trophy className="w-4 h-4" />
            HOA Sponsorship Program
            <ChevronLeft className={`w-4 h-4 transition-transform ${isPanelOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content - Categorized Events */}
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium text-sm">Loading upcoming community calendar...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8">
              <Calendar className="w-16 h-16 text-slate-350 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No upcoming events listed at this time.</p>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {sortedCategories.map((category) => (
                <section key={category} className="animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-6 sm:mb-8 border-b border-slate-200/60 pb-3">
                    {category}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {groupedEvents[category].map((event, i) => {
                      const hasImage = event['Banner Image'] && event['Banner Image'].length > 0
                      const slug = event['Event Name']
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '')

                      return (
                        <Link
                          key={event.id}
                          href={`/events/${slug}`}
                          className="block group select-none touch-manipulation cursor-pointer"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ delay: (i % 6) * 0.05 }}
                            className="h-full flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
                          >
                            <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
                              {hasImage ? (
                                <img
                                  src={event['Banner Image']![0].url}
                                  alt={event['Event Name']}
                                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-amber-50/40 flex items-center justify-center">
                                  <Calendar className="w-12 h-12 text-indigo-200" />
                                </div>
                              )}
                              {/* Small Badge on card top-right */}
                              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                                {category}
                              </div>
                            </div>

                            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 mb-4 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
                                  {event['Event Name']}
                                </h3>

                                <div className="space-y-2.5 mb-4 text-xs sm:text-sm font-medium text-slate-600">
                                  <div className="flex gap-2.5 items-start">
                                    <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <span>
                                      {event['Event Date']}
                                    </span>
                                  </div>
                                  {event.Location && (
                                    <div className="flex gap-2.5 items-start">
                                      <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                      <span className="line-clamp-1">
                                        {event.Location}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                  {event.Description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sliding Sponsorship Panel - Enhanced for extreme mobile reading ergonomic success */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-999"
              onClick={() => setIsPanelOpen(false)}
            />

            <motion.div
              ref={panelRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full md:w-[520px] lg:w-[560px] bg-white shadow-2xl z-9999 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Red Brand Top Bar */}
                <div
                  className="h-16 flex items-center justify-between px-6 font-serif font-bold text-lg text-white sticky top-0 z-10"
                  style={{ backgroundColor: '#910118' }}
                >
                  <span>2026 HOA Opportunities</span>
                  <button
                    onClick={() => setIsPanelOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/35 rounded-full text-white transition-colors cursor-pointer select-none touch-manipulation focus:outline-none"
                    aria-label="Close Panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base space-y-4">
                    <p>
                      On behalf of the <strong>Grand Mission Homeowners Association (HOA)</strong>, we are excited to present you with an opportunity to become a valued sponsor for our community events and initiatives in 2026. At Grand Mission, we are committed to fostering a vibrant, connected neighborhood, and we believe that partnerships with local businesses like yours are key to making that happen.
                    </p>

                    <p>
                      Our HOA hosts a variety of community-building programs, including four main seasonal events and smaller community initiatives like Yard of the Month and Themed Decorating Contests, which encourage residents to engage with one another and take pride in their homes. We are seeking sponsors to help bring these initiatives to life, and we believe your company would be a perfect fit for this opportunity.
                    </p>

                    <p>
                      As a sponsor, your business will gain exposure through event promotions such as community recognition, printed materials, and signage at event locations. In addition, your support will directly contribute to the success of these community activities and help strengthen the bonds between residents of Grand Mission.
                    </p>

                    <p>
                      Enclosed, you will find our sponsorship packet, which outlines the various sponsorship levels and benefits available. We would love to discuss how we can tailor this partnership to meet your goals and maximize your brand’s visibility within our community.
                    </p>

                    <p>
                      If you have any questions or would like to schedule a meeting to explore this opportunity further, please do not hesitate to contact me at <strong>(281) 232-6621</strong>. We look forward to the possibility of working together to make 2026 a memorable year for the Grand Mission community.
                    </p>

                    <p className="pt-2 font-semibold text-slate-800">Thank you for your consideration.</p>

                    <p className="text-slate-800">Sincerely,</p>

                    {/* Signature Image with resilient visual fallback */}
                    <div className="mt-4 mb-6 relative">
                      <img
                        src="/images/signature.png"
                        alt="Valerie Silva Signature"
                        className="h-16 w-auto object-contain"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallbackNode = document.getElementById('signature-fallback-node');
                          if (fallbackNode) fallbackNode.classList.remove('hidden');
                        }}
                      />
                      <div
                        id="signature-fallback-node"
                        className="hidden font-serif italic text-2xl text-slate-800 tracking-wide mt-2 select-none border-l-2 border-amber-500 pl-4 py-1 bg-amber-50/50 rounded-r-md text-amber-900"
                      >
                        Valerie Silva
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 leading-snug">
                      <strong>Valerie Silva</strong>, Community Manager<br />
                      Grand Mission Homeowners Association
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Button */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 sticky bottom-0">
                <a
                  href="https://airtable.com/app3AwDclb6uHhH1J/shrXQSRw0FuJLOd69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-sm select-none touch-manipulation"
                >
                  Become a Sponsor
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}