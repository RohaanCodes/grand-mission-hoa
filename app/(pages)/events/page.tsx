'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getAllEvents } from '@/lib/airtable'
import type { Event } from '@/lib/types'
import { Calendar, MapPin } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <main className="min-h-screen">
      {/* Header with Button - Consistent Alignment */}
<div className="bg-card border-b border-border py-12 px-4">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row md:items-end gap-6">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          Events & Calendar
        </h1>
        <p className="text-lg text-muted-foreground">
          Join us for exciting community events and activities at Grand Mission.
        </p>
      </div>

      {/* Blue Sponsorship Button */}
      <a
        href="https://airtable.com/app3AwDclb6uHhH1J/shrXQSRw0FuJLOd69"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium whitespace-nowrap shadow-sm hover:shadow-md mt-4 md:mt-0"
      >
        HOA Sponsorship Program
      </a>
    </div>
  </div>
</div>

      {/* Content */}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => {
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
                      transition={{ delay: (i % 3) * 0.1 }}
                      whileHover={{ y: -6 }}
                      className="h-full bg-white border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    >
                      {/* Image / Placeholder */}
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
          )}
        </div>
      </div>
    </main>
  )
}