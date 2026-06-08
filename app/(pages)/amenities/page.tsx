'use client'

import { useEffect, useState } from 'react'
import { getAllAmenities } from '@/lib/airtable'
import { AmenitiesGrid } from '@/components/amenities-grid'
import type { Amenity } from '@/lib/types'

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAllAmenities()
        setAmenities(data)
      } catch (error) {
        console.error('Error fetching amenities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAmenities()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Header - Consistent Alignment */}
<div className="bg-card border-b border-border py-12 px-4">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
      Our Amenities
    </h1>
    <p className="text-lg text-muted-foreground max-w-3xl">
      Discover all the wonderful facilities and services available to our
      residents at Grand Mission.
    </p>
  </div>
</div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading amenities...</p>
            </div>
          ) : amenities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No amenities available yet.
              </p>
            </div>
          ) : (
            <AmenitiesGrid amenities={amenities} />
          )}
        </div>
      </div>
    </main>
  )
}
