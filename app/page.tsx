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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <motion.div animate={{ opacity: [0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="mb-4">
            <div className="w-12 h-12 bg-primary rounded-full mx-auto" />
          </motion.div>
          <p className="text-muted-foreground">Loading community content...</p>
        </div>
      </div>
    )
  }

  const defaultTitle = 'Welcome to Grand Mission'
  const defaultSubtitle = 'An Upscale Community Featuring World-Class Amenities, Exceptional Architecture & Unparalleled Lifestyle'
  const heroTitle = siteSettings?.hero_title || defaultTitle
  const heroSubtitle = siteSettings?.hero_subtitle || defaultSubtitle

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        imageUrl="/images/hero-monument.png"
      />

      {/* ==================== BIG GALLERY CAROUSEL ==================== */}
<section className="py-20 px-4 md:px-8 bg-white">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
        Experience Grand Mission
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Luxury living surrounded by world-class amenities and breathtaking architecture
      </p>
    </motion.div>

    {/* Smooth Gallery Carousel */}
    <div className="relative overflow-hidden rounded-3xl">
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
        <section id="news" className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="font-serif text-4xl font-bold text-primary mb-4">
                Latest News
              </h2>
              <p className="text-muted-foreground">
                Stay informed about community events and updates
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                View All News
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Amenities Section */}
      {!error && amenities.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="font-serif text-4xl font-bold text-primary mb-4">
                Our Amenities
              </h2>
              <p className="text-muted-foreground">
                Discover the exceptional facilities available to our residents
              </p>
            </motion.div>

            <AmenitiesGrid amenities={amenities.slice(0, 6)} />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/amenities"
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors font-medium"
              >
                Explore All Amenities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

                  {/* Upcoming Events Section */}
      {!error && events.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="font-serif text-4xl font-bold text-primary mb-4">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Join us for community gatherings and celebrations
              </p>
            </motion.div>

            <div className="space-y-6">
              {events.map((event, i) => {
                const slug = event['Event Name']
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '');

                const hasImage = event['Banner Image'] && event['Banner Image'].length > 0;

                return (
                  <Link key={event.id} href={`/events/${slug}`} className="block group">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                      className="grid md:grid-cols-12 gap-6 bg-white border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                    >
                      {/* Image - Right Side on Desktop */}
                      <div className="md:col-span-5 lg:col-span-4 relative h-64 md:h-auto bg-muted">
                        {hasImage ? (
                          <img
                            src={event['Banner Image'][0].url}
                            alt={event['Event Name']}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                            <Calendar className="w-20 h-20 text-primary/30" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="md:col-span-7 lg:col-span-8 p-6 md:p-8 flex flex-col">
                        <h3 className="font-semibold text-foreground text-2xl mb-3 group-hover:text-primary transition-colors">
                          {event['Event Name']}
                        </h3>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
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
                              <MapPin className="w-4 h-4" />
                              <span>{event.Location}</span>
                            </div>
                          )}
                        </div>

                        {event.Description && (
                          <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow">
                            {event.Description}
                          </p>
                        )}

                        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                          View Details →
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                View Full Calendar
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://airtable.com/app3AwDclb6uHhH1J/shrXQSRw0FuJLOd69"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-border hover:bg-primary hover:text-white hover:border-primary rounded-md transition-all duration-300 font-medium"
              >
                View HOA Sponsorship Program
              </a>
            </motion.div>
          </div>
        </section>
      )}

{/* ==================== INTERACTIVE FAQs SECTION ==================== */}
      {!error && faqs.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-5xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions about Grand Mission HOA
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.slice(0, 6).map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-border rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-medium text-lg pr-8 text-left">
                      {faq.Question}
                    </h3>
                    {openFAQIndex === index ? (
                      <Minus className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {openFAQIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                          {faq.Answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/faqs"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                View All FAQs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Discover why Grand Mission is the premier choice for luxury residential living.
              Contact us to schedule a tour or learn more about available properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors font-medium text-lg"
              >
                Contact Us
              </Link>
              <Link
                href="/gallery"
                className="px-8 py-4 bg-white/20 text-white border-2 border-white/50 rounded-md hover:bg-white/30 transition-colors font-medium text-lg backdrop-blur-sm"
              >
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {error && (
        <section className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <p className="text-orange-800">{error}</p>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}