'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getAmenityBySlug } from '@/lib/airtable'
import type { Amenity, AirtableAttachment } from '@/lib/types'
import { ArrowLeft, Clock, Tag, Phone, Building2 } from 'lucide-react'

export default function AmenityDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [amenity, setAmenity] = useState<Amenity | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchAmenity = async () => {
      try {
        const data = await getAmenityBySlug(slug)
        setAmenity(data)

        // Set first image as selected by default
        if (data?.image && data.image.length > 0) {
          setSelectedImage(data.image[0].url)
        }
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
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Amenities
          </Link>
        </div>
      </div>
    )
  }

  const images: AirtableAttachment[] = amenity.image || []

  return (
    <main className="min-h-screen bg-slate-50/30 text-slate-800 pb-16">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          href="/amenities"
          className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-amber-500 hover:text-amber-800 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 transition-all shadow-2xs"
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
        {/* Main Image */}
        <div className="rounded-2xl overflow-hidden mb-4 h-80 sm:h-96 bg-slate-100 relative border border-slate-200/60 shadow-xs">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={amenity.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-50/10 via-slate-100 to-slate-200/40 flex flex-col items-center justify-center">
              <Building2 className="w-16 h-16 text-slate-300 mb-3" />
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">No image available</p>
            </div>
          )}
        </div>

        {/* Thumbnail Gallery (only shows if more than 1 image) */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {images.map((img, index) => (
              <button
                key={img.id || index}
                onClick={() => setSelectedImage(img.url)}
                className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img.url
                    ? 'border-amber-500 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img
                  src={img.url}
                  alt={`${amenity.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}

        {/* Header */}
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

        {/* Description */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-3xs mb-10">
          <h3 className="font-serif font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 mb-4">
            Facility Description
          </h3>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-wrap text-justify">
            {amenity.description || 'This facility is managed and maintained under premium standards at Grand Mission.'}
          </p>
        </div>

        
      </motion.div>
    </main>
  )
}