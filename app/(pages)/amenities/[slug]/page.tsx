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
  const slug = params.slug as string
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
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  if (!amenity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Amenity not found</h1>
          <Link href="/amenities" className="text-primary hover:underline">← Back to Amenities</Link>
        </div>
      </div>
    )
  }

  // Get image from attachment field
  const imageUrl = amenity.image && amenity.image.length > 0 
    ? amenity.image[0].url 
    : null

  return (
    <main className="min-h-screen">
    <div className="max-w-4xl mx-auto px-4 py-6">
  <Link
    href="/amenities"
    className="inline-flex items-center gap-2 px-6 py-3 
               bg-white border-2 border-border 
               hover:bg-primary hover:text-white hover:border-primary 
               rounded-xl text-foreground font-medium 
               transition-all duration-300 shadow-sm hover:shadow-md"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Amenities
  </Link>
</div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Hero Image with Nice Placeholder */}
        <div className="rounded-lg overflow-hidden mb-8 h-96 bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={amenity.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <Building2 className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{amenity.name}</h1>
          <div className="flex flex-wrap gap-4">
            {amenity.category && (
              <div className="flex items-center gap-2 text-primary">
                <Tag className="w-4 h-4" />
                <span>{amenity.category}</span>
              </div>
            )}
            {amenity.hours && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{amenity.hours}</span>
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{amenity.description}</p>
        </div>

        {/* CTA Section */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl font-semibold mb-3">Ready to Reserve?</h2>
          <p className="text-muted-foreground mb-8">
            Contact the clubhouse to check availability and make a reservation for this amenity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-center hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Contact HOA
            </Link>
 
          </div>
        </div>
      </motion.div>
    </main>
  )
}