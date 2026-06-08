'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2, Home, Landmark } from 'lucide-react'   // Proper icons
import type { Amenity } from '@/lib/types'

interface AmenitiesGridProps {
  amenities: Amenity[]
  featured?: boolean
}

export function AmenitiesGrid({
  amenities,
  featured = false,
}: AmenitiesGridProps) {
  const displayAmenities = featured ? amenities.slice(0, 3) : amenities

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayAmenities.map((amenity, index) => {
        const imageUrl = amenity.image && amenity.image.length > 0 
          ? amenity.image[0].url 
          : null

        return (
          <Link key={amenity.id} href={`/amenities/${amenity.slug}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="h-full bg-white border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
            >
              {/* Image / Placeholder */}
              <div className="relative h-48 overflow-hidden bg-muted">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={amenity.name}
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="w-16 h-16 text-primary/30 mx-auto mb-3" />
                      <p className="text-xs text-muted-foreground font-medium tracking-widest">
                        {amenity.category || 'AMENITY'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  {amenity.category && (
                    <p className="text-xs font-semibold bg-accent/10 text-accent px-3 py-1 rounded-full w-fit mb-2">
                      {amenity.category}
                    </p>
                  )}
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {amenity.name}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm flex-grow line-clamp-3 mb-4 leading-relaxed">
                  {amenity.description}
                </p>
                {amenity.hours && (
                  <p className="text-xs text-muted-foreground border-t border-border pt-3">
                    <strong>Hours:</strong> {amenity.hours}
                  </p>
                )}
              </div>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}