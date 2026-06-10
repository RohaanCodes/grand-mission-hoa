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
    return <div className="min-h-screen flex items-center justify-center"><p>Loading event...</p></div>
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event not found</h1>
          <Link href="/events" className="text-primary hover:underline">← Back to Events</Link>
        </div>
      </div>
    )
  }

  const tiers = [
    { name: event['Tier 1 Name'], price: event['Tier 1 Price'], benefits: event['Tier 1 Benefits'] },
    { name: event['Tier 2 Name'], price: event['Tier 2 Price'], benefits: event['Tier 2 Benefits'] },
    { name: event['Tier 3 Name'], price: event['Tier 3 Price'], benefits: event['Tier 3 Benefits'] },
  ].filter(t => t.name && t.price);

  return (
    <main className="min-h-screen">
      {/* Back Button */}
<div className="max-w-6xl mx-auto px-4 py-6">
  <Link
    href="/events"
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 group"
    style={{
      background: "rgba(255, 255, 255, 0.12)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.25)",
      color: "#1A3A52",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.22)";
      e.currentTarget.style.boxShadow = "0 6px 24px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.25)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
    }}
  >
    <span className="text-base leading-none transition-transform duration-300 group-hover:-translate-x-0.5" style={{ color: "#1A3A52" }}>&lt;</span>
    Back to Events
  </Link>
</div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column - Description */}
          <div className="lg:col-span-7">
            {/* Image */}
            {event['Banner Image'] && event['Banner Image'].length > 0 && (
              <div className="rounded-2xl overflow-hidden mb-10 h-[420px] bg-muted">
                <img
                  src={event['Banner Image'][0].url}
                  alt={event['Event Name']}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title & Meta */}
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
                {event['Event Category'] && (
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {event['Event Category']}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.Description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-foreground">
                  {event.Description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sponsorship Tiers */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <h2 className="font-serif text-3xl font-bold mb-8">Sponsorship Opportunities</h2>

              {tiers.length > 0 ? (
                <div className="space-y-6">
                  {tiers.map((tier, index) => {
                    const tierLevel = index + 1; // 1 = cheapest, 3 = most expensive
                    
                    return (
                      <div 
                        key={index} 
                        className={`border-2 rounded-2xl p-7 bg-white transition-all hover:shadow-xl ${
                          tierLevel === 1 
                            ? 'border-slate-200 hover:border-slate-400'           // Tier 1 - Basic
                            : tierLevel === 2 
                            ? 'border-primary/30 hover:border-primary'            // Tier 2 - Standard
                            : 'border-amber-500/30 hover:border-amber-500'        // Tier 3 - Premium
                        }`}
                      >
                        <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${
                          tierLevel === 1 
                            ? 'bg-slate-100 text-slate-600' 
                            : tierLevel === 2 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {tier.name}
                        </div>
                        
                        <p className="text-4xl font-bold text-foreground mb-5">
                          ${tier.price}
                        </p>

                        {tier.benefits && (
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {tier.benefits}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No sponsorship tiers available for this event.</p>
              )}

              {/* Sponsor Application Button */}
              {event['Sponsor Application Link'] && (
                <div className="mt-8">
                  <a
                    href={event['Sponsor Application Link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-primary text-white py-4 rounded-xl hover:bg-primary/90 transition-all font-semibold text-lg"
                  >
                    Apply to Sponsor This Event
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}