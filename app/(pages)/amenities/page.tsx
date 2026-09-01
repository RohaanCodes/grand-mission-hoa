'use client'

import React, { useEffect, useState } from 'react'
import { getAllAmenities } from '@/lib/airtable'
import { AmenitiesGrid } from '@/components/amenities-grid'
import type { Amenity } from '@/lib/types'
import { AlertCircle, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react'

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

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

  // Dynamic set of categories
  const categories = ['All', ...Array.from(new Set(amenities.map(item => item.category).filter(Boolean) as string[]))]

  const filteredAmenities = amenities.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory
  })

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800 pb-16 animate-fade-in">
      
      {/* Premium Header spacer with styling matching other pages */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-block mb-3.5">
            World-Class Living
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
            Our Club & Amenities
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Discover first-class recreational centers, pools, lakeside paths, court sports, and leisure sanctuaries available exclusively to Grand Mission residents.
          </p>

          {/* Interactive controls for quick filtrations */}
          <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all whitespace-nowrap select-none touch-manipulation min-h-[40px] flex items-center ${
                  selectedCategory === cat
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 active:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium text-sm text-center">Opening community catalog registry...</p>
            </div>
          ) : filteredAmenities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-150 p-8 max-w-2xl mx-auto shadow-2xs">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">No facilities listed</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                All amenities in this filter categories are currently loading or unavailable. Select another filter.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all min-h-[40px] shadow-sm select-none"
              >
                Reset Amenities Directory
              </button>
            </div>
          ) : (
            <div>
              <AmenitiesGrid amenities={filteredAmenities} />

             

            </div>
          )}
        </div>
      </div>

    </main>
  )
}