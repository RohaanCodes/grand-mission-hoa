'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2, Home, Landmark, AlertCircle } from 'lucide-react'   // Proper icons
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
        const isNotOpen = amenity.status && amenity.status !== 'Open'

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
                {isNotOpen && (
                  <div className="absolute top-3 right-3 z-10 group/status">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm cursor-default ${
                        amenity.status === 'Closed'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {amenity.status === 'Under Maintenance' ? 'Maintenance' : 'Closed'}
                    </div>
                    {amenity.statusNote && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 leading-relaxed opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-150 shadow-lg z-20">
                        {amenity.statusNote}
                        <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 rotate-45" />
                      </div>
                    )}
                  </div>
                )}
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