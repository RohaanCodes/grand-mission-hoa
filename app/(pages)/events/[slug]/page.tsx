'use client'

import { useEffect, useState } from 'react'
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

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-border hover:bg-primary hover:text-white hover:border-primary rounded-xl text-foreground font-medium transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column - Description */}
          <div className="lg:col-span-7">
            {/* Banner Image */}
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
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
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
                <p className="font-sans text-lg leading-relaxed text-foreground text-justify whitespace-pre-line">
                  {event.Description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sponsors */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              {/* Sponsors Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-accent" />
                  <h2 className="font-serif text-3xl font-bold text-primary">
                    Proud Sponsors
                  </h2>
                </div>
                <p className="font-sans text-sm text-muted-foreground pl-9">
                  Supporting our community
                </p>
              </div>

              {/* Sponsors List */}
              {event.sponsors && event.sponsors.length > 0 ? (
                <motion.div 
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                      >
                        {/* Sponsor Card - Two Column Layout */}
                        <div className="grid grid-cols-5 gap-0">
                          {/* Left - Logo Image (40% width) */}
                          <div className="col-span-2 bg-muted overflow-hidden min-h-[280px]">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                                <Award className="w-16 h-16 text-muted-foreground/30 mb-2" />
                                <span className="text-xs text-muted-foreground/50 text-center px-2">Brand Logo</span>
                              </div>
                            )}
                          </div>

                          {/* Right - Content Section (60% width) */}
                          <div className="col-span-3 p-5 flex flex-col justify-between">
                            {/* Name & Badge */}
                            <div>
                              <h3 className="font-serif font-bold text-lg leading-snug text-foreground group-hover:text-primary transition-colors">
                                {displayName}
                              </h3>
                              {subName && (
                                <p className="font-sans text-xs text-muted-foreground mt-1">
                                  {subName}
                                </p>
                              )}
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mt-3">
                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                                Sponsor
                              </span>
                            </div>

                            {/* Contact Information */}
                            {(sponsor['Contact Name'] || sponsor['Contact Email'] || sponsor['Contact Phone'] || sponsor['Address']) && (
                              <div className="space-y-2.5 text-sm pt-4 border-t border-border/50 mt-4">
                                {sponsor['Contact Name'] && (
                                  <div className="flex items-center gap-2.5 font-sans text-foreground">
                                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm">{sponsor['Contact Name']}</span>
                                  </div>
                                )}
                                {sponsor['Contact Email'] && (
                                  <div className="flex items-center gap-2.5">
                                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <a 
                                      href={`mailto:${sponsor['Contact Email']}`} 
                                      className="font-sans text-muted-foreground hover:text-primary hover:underline truncate text-xs"
                                    >
                                      {sponsor['Contact Email']}
                                    </a>
                                  </div>
                                )}
                                {sponsor['Contact Phone'] && (
                                  <div className="flex items-center gap-2.5">
                                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <a 
                                      href={`tel:${sponsor['Contact Phone']}`} 
                                      className="font-sans text-muted-foreground hover:text-primary hover:underline text-xs"
                                    >
                                      {sponsor['Contact Phone']}
                                    </a>
                                  </div>
                                )}
                                {sponsor['Address'] && (
                                  <div className="flex items-start gap-2.5">
                                    <MapPinIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 flex-shrink-0" />
                                    <span className="font-sans text-muted-foreground text-xs leading-snug">
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
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-10 text-center">
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                    No sponsors yet for this event.
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