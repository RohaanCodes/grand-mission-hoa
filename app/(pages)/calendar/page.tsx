'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getUpcomingEvents } from '@/lib/airtable'
import type { Event } from '@/lib/types'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getUpcomingEvents(50)
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
      {/* Header */}
      <div className="bg-card border-b border-border py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Community Calendar
          </h1>
          <p className="text-lg text-muted-foreground">
            View all upcoming events and activities at Grand Mission.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading calendar...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No upcoming events scheduled.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i % 10) * 0.05 }}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col md:flex-row md:items-start gap-6"
                >
                  {/* Date Badge */}
                  <div className="bg-primary text-primary-foreground rounded-lg p-4 text-center flex-shrink-0 md:min-w-fit">
                    <div className="text-sm font-medium opacity-90">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </div>
                    <div className="text-3xl font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs opacity-90">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Image Thumbnail */}
                  {event.image_url && (
                    <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted hidden sm:block">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
