'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getAmenityBySlug } from '@/lib/airtable'
import type { Amenity } from '@/lib/types'
import { ArrowLeft, Clock, Tag, Phone, Building2 } from 'lucide-react'

export default function AmenityDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [amenity, setAmenity] = useState<Amenity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAmenity = async () => {
      try {
        const data = await getAmenityBySlug(slug)
        setAmenity(data)
      } catch (error) {
        console.error('Error fetching amenity:', error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchAmenity()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Opening amenity records...</p>
        </div>
      </div>
    )
  }

  if (!amenity) {
    return (
      <div className="min-h-screen bg-slate-50/40 flex items-center justify-center px-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
          <Building2 className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">Amenity not found</h1>
          <p className="text-slate-450 mb-6 text-sm">We couldn&apos;t verify this facility&apos;s records. It may have been updated or renamed.</p>
          <Link
            href="/amenities"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-98"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Amenities
          </Link>
        </div>
      </div>
    )
  }

  // Get image from string or array field safely
  const getImageUrl = () => {
    if (!amenity.image) return null
    if (typeof amenity.image === 'string') return amenity.image
    if (Array.isArray(amenity.image) && amenity.image.length > 0) {
      const first = amenity.image[0]
      if (typeof first === 'string') return first
      if (first && typeof first === 'object' && first.url) return first.url
    }
    return null
  }

  const imageUrl = getImageUrl()

  return (
    <main className="min-h-screen bg-slate-50/30 text-slate-800 pb-16">
      {/* Navigation Breadcrumb container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          href="/amenities"
          className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-amber-500 hover:text-amber-800 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 transition-all shadow-2xs active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-800 transition-all" />
          Back to Amenities
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-4xl mx-auto px-4 sm:px-6"
      >
        {/* Banner Hero Image */}
        <div className="rounded-2xl overflow-hidden mb-8 h-80 sm:h-96 bg-slate-100 relative border border-slate-200/60 shadow-xs group">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={amenity.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-50/10 via-slate-100 to-slate-200/40 flex flex-col items-center justify-center">
              <Building2 className="w-16 h-16 text-slate-300 mb-3" />
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">No image available</p>
            </div>
          )}

          {/* Optional inline database status overlay badge */}
          {amenity.status && (
            <span className={`absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md backdrop-blur-xs shadow-2xs flex items-center gap-1.5 ${
              amenity.status === 'Open'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 text-white'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {amenity.status}
            </span>
          )}
        </div>

        {/* Header Block Section */}
        <div className="mb-8 space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            {amenity.name}
          </h1>

          <div className="flex flex-wrap gap-3">
            {amenity.category && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg text-xs font-bold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-amber-700" />
                <span>{amenity.category}</span>
              </div>
            )}
            {amenity.hours && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200/60 rounded-lg text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{amenity.hours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Body Description Description Text Card */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-3xs mb-10">
          <h3 className="font-serif font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 mb-4">
            Facility Description
          </h3>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-wrap text-justify">
            {amenity.description || 'This facility is managed and maintained under premium standards at Grand Mission.'}
          </p>
        </div>

        {/* Dynamic Rules Segment - only displayed if present in the database record */}
        {amenity.rules && amenity.rules.length > 0 && (
          <div className="bg-amber-50/40 border border-amber-200/40 p-6 sm:p-8 rounded-2xl mb-10 space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 pb-2 border-b border-amber-200/40">
              Access Guidelines & Rules
            </h3>
            <ul className="space-y-2.5">
              {amenity.rules.map((rule: string, idx: number) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-600 mt-2" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Card Section */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-xs relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.02] pointer-events-none select-none translate-x-12 translate-y-12">
            <Building2 className="w-72 h-72" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3 tracking-tight">Ready to Reserve?</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Contact the clubhouse to check current seasonal availability, access requirements, or to lock in a reservation for this amenity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 py-4 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-98"
              >
                <Phone className="w-4 h-4" />
                Contact HOA Clubhouse
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
