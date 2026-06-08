'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getEventBySlug } from '@/lib/airtable'
import { formatDate } from '@/lib/utils'
import type { Event } from '@/lib/types'
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event not found</h1>
          <Link href="/events" className="text-primary hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
 {/* Transparent Blurry Back Button - Improved */}
<div className="max-w-4xl mx-auto px-4 py-6">
  <Link
    href="/events"
    className="inline-flex items-center gap-2 px-6 py-3 
               bg-white border-2 border-border 
               hover:bg-primary hover:text-white hover:border-primary 
               rounded-xl text-foreground font-medium 
               transition-all duration-300 shadow-sm hover:shadow-md"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Events
  </Link>
</div>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        {/* Image */}
        {event['Banner Image'] && event['Banner Image'].length > 0 && (
          <div className="rounded-lg overflow-hidden mb-8 h-[420px] bg-muted">
            <img
              src={event['Banner Image'][0].url}
              alt={event['Event Name']}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & Date */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {event['Event Name']}
          </h1>
          <div className="flex flex-wrap gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(event['Event Date'])}</span>
            </div>
            {event['End Date'] && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Ends: {formatDate(event['End Date'])}</span>
              </div>
            )}
            {event.Location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.Location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        {event.Status && (
          <div className="inline-block mb-6 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {event.Status}
          </div>
        )}

        {/* Description */}
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground">
            {event.Description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/events"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl hover:bg-primary/90 transition-all font-medium"
          >
            Back to All Events
          </Link>
        </div>
      </motion.article>
    </main>
  )
}