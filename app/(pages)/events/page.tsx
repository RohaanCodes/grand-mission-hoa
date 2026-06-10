'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getAllEvents } from '@/lib/airtable'
import type { Event } from '@/lib/types'
import { Calendar, MapPin, ChevronLeft, X } from 'lucide-react'

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
    <main className="min-h-screen relative">
      {/* Header */}
      <div className="bg-card border-b border-border py-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Events & Calendar
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us for exciting community events and activities at Grand Mission.
            </p>
          </div>

          {/* Trigger Button */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium whitespace-nowrap shadow-sm hover:shadow-md"
          >
            HOA Sponsorship Program
            <ChevronLeft className={`w-4 h-4 transition-transform ${isPanelOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content - Categorized Events */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events at this time.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {sortedCategories.map((category) => (
                <section key={category}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-8 border-b border-border pb-4">
                    {category}
                  </h2>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedEvents[category].map((event, i) => {
                      const slug = event['Event Name']
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '')

                      const hasImage = event['Banner Image'] && event['Banner Image'].length > 0

                      return (
                        <Link key={event.id} href={`/events/${slug}`} className="block group">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: (i % 6) * 0.08 }}
                            whileHover={{ y: -6 }}
                            className="h-full bg-white border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                          >
                            <div className="h-48 overflow-hidden bg-muted relative">
                              {hasImage ? (
                                <img
                                  src={event['Banner Image'][0].url}
                                  alt={event['Event Name']}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                                  <Calendar className="w-16 h-16 text-primary/30" />
                                </div>
                              )}
                            </div>

                            <div className="p-6">
                              <h3 className="text-xl font-semibold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                                {event['Event Name']}
                              </h3>

                              <div className="space-y-3 mb-4">
                                <div className="flex gap-3 items-start">
                                  <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground">
                                    {event['Event Date']}
                                  </span>
                                </div>
                                {event.Location && (
                                  <div className="flex gap-3 items-start">
                                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">
                                      {event.Location}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <p className="text-muted-foreground text-sm line-clamp-3">
                                {event.Description}
                              </p>
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

      {/* Sliding Sponsorship Panel - Full Text + Image */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsPanelOpen(false)}
            />

            <motion.div
              ref={panelRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed top-0 right-0 h-full w-full md:w-[520px] lg:w-[580px] bg-white shadow-2xl z-50 overflow-auto"
            >
              {/* Red Top Bar */}
              <div
                className="h-16 flex items-center px-6 font-medium text-lg border-b text-white relative"
                style={{ backgroundColor: '#910118' }}
              >
                2026 HOA Opportunities
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-justify">
                  <p>On behalf of the Grand Mission Homeowners Association (HOA), we are excited to present you with an opportunity to become a valued sponsor for our community events and initiatives in 2026. At Grand Mission, we are committed to fostering a vibrant, connected neighborhood, and we believe that partnerships with local businesses like yours are key to making that happen.</p>

                  <p className="mt-4">Our HOA hosts a variety of community-building programs, including four main seasonal events and smaller community initiatives like Yard of the Month and Themed Decorating Contests, which encourage residents to engage with one another and take pride in their homes. We are seeking sponsors to help bring these initiatives to life, and we believe your company would be a perfect fit for this opportunity.</p>

                  <p className="mt-4">As a sponsor, your business will gain exposure through event promotions such as community recognition, printed materials, and signage at event locations. In addition, your support will directly contribute to the success of these community activities and help strengthen the bonds between residents of Grand Mission.</p>

                  <p className="mt-4">Enclosed, you will find our sponsorship packet, which outlines the various sponsorship levels and benefits available. We would love to discuss how we can tailor this partnership to meet your goals and maximize your brand’s visibility within our community.</p>

                  <p className="mt-4">If you have any questions or would like to schedule a meeting to explore this opportunity further, please do not hesitate to contact me at (281) 232-6621. We look forward to the possibility of working together to make 2026 a memorable year for the Grand Mission community.</p>

                  <p className="mt-6 font-medium">Thank you for your consideration.</p>

                  <p className="mt-8 font-medium">Sincerely,</p>

                  {/* Signature Image */}
                  <div className="mt-3 mb-6">
                    <img
                      src="/images/signature.png"
                      alt="Valerie Silva Signature"
                      className="h-24 w-auto"
                    />
                  </div>

                  <p className="text-sm">Valerie Silva, Community Manager<br />Grand Mission Homeowners Association</p>
                </div>

                <a
                  href="https://airtable.com/app3AwDclb6uHhH1J/shrXQSRw0FuJLOd69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-12 block w-full text-center bg-primary text-white py-4 rounded-xl hover:bg-primary/90 font-semibold text-lg"
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