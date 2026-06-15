'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Carousel } from '@/components/carousel'
import {
  getAllNews,
  getAllAmenities,
  getUpcomingEvents,
  getSiteSettings,
  getAllFAQs,
} from '@/lib/airtable'
import { HeroSection } from '@/components/hero-section'
import { ImageCard } from '@/components/image-card'
import { NewsCard } from '@/components/news-card'
import { AmenitiesGrid } from '@/components/amenities-grid'
import type { News, Amenity, Event, SiteSettings, FAQ } from '@/lib/types'
import { Calendar, MapPin, ArrowRight, Plus, Minus } from 'lucide-react'

export default function Home() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [news, setNews] = useState<News[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [settings, newsData, amenitiesData, eventsData, faqsData] =
          await Promise.all([
            getSiteSettings(),
            getAllNews(),
            getAllAmenities(),
            getUpcomingEvents(3),
            getAllFAQs(),
          ])

        setSiteSettings(settings)
        setNews(newsData)
        setAmenities(amenitiesData)
        setEvents(eventsData)
        setFaqs(faqsData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load content. Please check your Airtable configuration.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center w-full max-w-xs">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} 
            className="mb-5"
          >
            <div className="w-14 h-14 bg-primary rounded-full mx-auto shadow-md ring-4 ring-primary/10" />
          </motion.div>
          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            Loading community content...
          </p>
        </div>
      </div>
    )
  }

  const defaultTitle = 'Welcome to Grand Mission'
  const defaultSubtitle = 'An Upscale Community Featuring World-Class Amenities, Exceptional Architecture & Unparalleled Lifestyle'
  const heroTitle = siteSettings?.hero_title || defaultTitle
  const heroSubtitle = siteSettings?.hero_subtitle || defaultSubtitle

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        imageUrl="/images/hero-monument.png"
      />

      {/* ==================== BIG GALLERY CAROUSEL ==================== */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white transition-all">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 md:mb-4 tracking-tight leading-tight">
              Experience Grand Mission
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Luxury living surrounded by world-class amenities and breathtaking architecture
            </p>
          </motion.div>

          {/* Smooth Gallery Carousel optimized with safe device margin & rounded frame */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg border border-slate-100">
            <Carousel images={[
              {
                src: "/images/asset1.png",
                title: "Resort-Style Living",
                subtitle: "Luxury homes surrounding premium amenities"
              },
              {
                src: "/images/asset2.png",
                title: "World-Class Amenities",
                subtitle: "Recreation, pools, and family facilities"
              },
              {
                src: "/images/asset3.png",
                title: "Aquatic Excellence",
                subtitle: "State-of-the-art water park for all ages"
              },
              {
                src: "/images/asset4.png",
                title: "Prestigious Homes",
                subtitle: "Elegant architecture in a lakeside setting"
              },
            ]} />
          </div>
        </div>
      </section>

      {/* News Section */}
      {!error && news.length > 0 && (
        <section id="news" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white border-t border-slate-50 transition-all">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-12 text-center sm:text-left"
            >
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3 tracking-tight">
                Latest News
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Stay informed about community events and updates
              </p>
            </motion.div>

            {/* Grid with tightened gap on mobile to save scrolling length */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-8">
              {news.slice(0, 3).map((item, i) => (
                <NewsCard key={i} news={item} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                href="/news"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all font-semibold text-sm min-h-[44px] shadow-sm select-none touch-manipulation"
              >
                View All News
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Amenities Section */}
      {!error && amenities.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-background transition-all">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-12 text-center sm:text-left"
            >
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3 tracking-tight">
                Our Amenities
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover the exceptional facilities available to our residents
              </p>
            </motion.div>

            <AmenitiesGrid amenities={amenities.slice(0, 6)} />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center mt-10 md:mt-12"
            >
              <Link
                href="/amenities"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/95 active:scale-[0.98] transition-all font-semibold text-sm min-h-[44px] shadow-sm select-none touch-manipulation"
              >
                Explore All Amenities
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      {!error && events.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white border-t border-slate-50 transition-all">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-12 text-center sm:text-left"
            >
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3 tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Join us for community gatherings and celebrations
              </p>
            </motion.div>

            {/* Event list optimized for mobile with better photo-content spacing & thumb-friendly targets */}
            <div className="space-y-5 md:space-y-6">
              {events.map((event, i) => {
                const slug = event['Event Name']
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '');

                const hasImage = event['Banner Image'] && event['Banner Image'].length > 0;

                return (
                  <Link key={event.id} href={`/events/${slug}`} className="block group select-none touch-manipulation">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-6 bg-white border border-border/80 rounded-2xl overflow-hidden hover:shadow-xl active:scale-[0.99] transition-all duration-300"
                    >
                      {/* Image - Scaled down height on mobile to keep information in viewport fold */}
                      <div className="md:col-span-5 lg:col-span-4 relative h-44 sm:h-56 md:h-auto min-h-[160px] md:min-h-[220px] bg-muted/20">
                        {hasImage ? (
                          <img
                            src={event['Banner Image'][0].url}
                            alt={event['Event Name']}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                            <Calendar className="w-14 h-14 text-primary/20" />
                          </div>
                        )}
                      </div>

                      {/* Content - Compacted padding on mobile for superior text flow */}
                      <div className="md:col-span-7 lg:col-span-8 p-5 sm:p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif font-bold text-foreground text-xl md:text-2xl mb-2 md:mb-3 group-hover:text-primary transition-colors leading-tight">
                            {event['Event Name']}
                          </h3>

                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground/90 mb-3 md:mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
                              <span>
                                {event['Event Date']
                                  ? new Date(event['Event Date']).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })
                                  : 'Date TBD'}
                              </span>
                            </div>
                            {event.Location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="line-clamp-1">{event.Location}</span>
                              </div>
                            )}
                          </div>

                          {event.Description && (
                            <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed">
                              {event.Description}
                            </p>
                          )}
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-primary font-bold text-sm group-hover:gap-2.5 transition-all mt-auto pt-2 border-t border-slate-50 md:border-none min-h-[36px]">
                          View Details 
                          <span className="text-base font-sans transform group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Buttons - responsive column stack with 48px ergonomics */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-10 md:mt-12 flex flex-col sm:flex-row gap-3.5 justify-center"
            >
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all font-semibold text-sm min-h-[44px] shadow-sm select-none touch-manipulation"
              >
                View Full Calendar
                <ArrowRight className="w-4 h-4 shrink-0 animate-pulse" />
              </Link>

              <a
                href="https://airtable.com/app3AwDclb6uHhH1J/shrXQSRw0FuJLOd69"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all rounded-lg font-semibold text-sm min-h-[44px] shadow-xs select-none touch-manipulation"
              >
                View HOA Sponsorship Program
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* ==================== INTERACTIVE FAQs SECTION ==================== */}
      {!error && faqs.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white border-t border-slate-50 transition-all">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
                Quick answers to common questions about Grand Mission HOA
              </p>
            </motion.div>

            {/* Accordion List with polished microinter-activities and full touch target */}
            <div className="space-y-3">
              {faqs.slice(0, 6).map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border border-slate-100 rounded-xl overflow-hidden bg-white hover:border-slate-200 hover:shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left hover:bg-slate-50/50 active:bg-slate-100/50 focus:outline-none select-none touch-manipulation transition-colors min-h-[44px]"
                  >
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg text-slate-900 pr-4 leading-snug">
                      {faq.Question}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-primary transition-all">
                      {openFAQIndex === index ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFAQIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden bg-slate-50/30"
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-50 pt-3">
                          {faq.Answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 md:mt-10">
              <Link
                href="/faqs"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all font-semibold text-sm min-h-[44px] shadow-sm select-none touch-manipulation"
              >
                View All FAQs
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6 md:px-8 bg-gradient-to-br from-primary via-primary/95 to-slate-900 text-white transition-all">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">
              Ready to Join Our Community?
            </h2>
            <p className="text-white/80 text-sm sm:text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto px-1">
              Discover why Grand Mission is the premier choice for luxury residential living.
              Contact us to schedule a tour or learn more about available properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/95 active:scale-[0.98] transition-all font-bold text-base min-h-[44px] select-none touch-manipulation shadow-md"
              >
                Contact Us
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white border border-white/20 rounded-lg transition-all font-bold text-base min-h-[44px] backdrop-blur-sm select-none touch-manipulation"
              >
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {error && (
        <section className="py-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="p-5 bg-orange-50/80 border border-orange-200/60 rounded-xl text-center shadow-xs">
              <p className="text-orange-900 text-sm font-semibold">{error}</p>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}