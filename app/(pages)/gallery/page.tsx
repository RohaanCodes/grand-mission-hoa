'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllGalleryImages } from '@/lib/airtable'
import type { GalleryImage } from '@/lib/types'
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  
  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getAllGalleryImages()
        setImages(data)
      } catch (error) {
        console.error('Error fetching gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Categories extracted from loaded images
  const categories = ['All', ...Array.from(new Set(images.map(img => img.category).filter(Boolean) as string[]))]

  // Filtered images
  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory)

  // Lightbox navigation helpers
  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length)
    }
  }

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)
    }
  }

  // Keyboard controls for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, filteredImages])

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800">
      
      {/* Header - Consistent mobile alignments without layout double-padding */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
           
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
            Photo Gallery
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Explore breathtaking captures of the Grand Mission community, top-tier amenities, lakeside scenery, and seasonal neighborly gatherings.
          </p>

          {/* Category Filter Chips for ergonomic thumb filtering */}
          {images.length > 0 && (
            <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    setLightboxIndex(null)
                  }}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all whitespace-nowrap select-none touch-manipulation min-h-[40px] flex items-center ${
                    activeCategory === cat
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 active:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Space */}
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium text-sm">Loading community portfolio...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8 shadow-xs">
              <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No photos found matching your criteria.</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="mt-4 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Responsive Grid using aspect-ratio instead of raw heights for safe layouts */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredImages.map((image, i) => {
                const imageUrl = image.image && image.image.length > 0 
                  ? image.image[0].url 
                  : null

                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ delay: (i % 6) * 0.05, duration: 0.4 }}
                    onClick={() => setLightboxIndex(i)}
                    className="group relative aspect-[4/3] w-full rounded-xl overflow-hidden cursor-pointer bg-slate-100 hover:shadow-lg focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition-all border border-slate-100 active:scale-[0.99]"
                  >
                    {/* Media Display Container */}
                    <div className="w-full h-full relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 rounded-xl"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200/55 flex items-center justify-center p-6">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-400 font-semibold">Image Pending</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Permanent subtle category tag for mobile accessibility */}
                    {image.category && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow-xs pointer-events-none uppercase">
                        {image.category}
                      </div>
                    )}

                    <div className="absolute top-3 right-3 bg-slate-900/40 backdrop-blur-xs text-white p-1.5 rounded-lg opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Premium Ambient Infomart block */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent p-4 flex flex-col justify-end min-h-[50%]">
                      <h3 className="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-sm truncate">
                        {image.title}
                      </h3>
                      <p className="text-white/80 text-xs mt-0.5 md:hidden">
                        Tap to expand full screen
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX MODAL WITH VELOCITY EASE AND LARGE NAVIGATION TAP TARGETS */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-9999 flex flex-col justify-between p-4 select-none touch-manipulation"
          >
            {/* Top Toolbar */}
            <div className="flex justify-between items-center text-white py-3 px-2 z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                  {filteredImages[lightboxIndex].category || 'COMMUNITY'}
                </span>
                <span className="text-sm font-semibold text-slate-300">
                  {lightboxIndex + 1} of {filteredImages.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full transition-colors touch-manipulation focus:outline-none"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Immersive Main Frame */}
            <div className="flex-1 flex items-center justify-center relative my-4">
              
              {/* Prev Button - touch friendly */}
              {filteredImages.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 w-14 h-14 bg-black/40 hover:bg-black/60 rounded-full text-white flex items-center justify-center z-10 active:scale-95 transition-all focus:outline-none"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}

              {/* Central Image Container */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-[70vh] flex items-center justify-center"
              >
                {filteredImages[lightboxIndex].image && filteredImages[lightboxIndex].image![0] ? (
                  <img
                    src={filteredImages[lightboxIndex].image![0].url}
                    alt={filteredImages[lightboxIndex].title}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl pointer-events-none"
                  />
                ) : (
                  <div className="text-center p-8 bg-slate-900/50 rounded-xl">
                    <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">Image file unavailable</p>
                  </div>
                )}
              </motion.div>

              {/* Next Button - touch friendly */}
              {filteredImages.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 w-14 h-14 bg-black/40 hover:bg-black/60 rounded-full text-white flex items-center justify-center z-10 active:scale-95 transition-all focus:outline-none"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}
            </div>

            {/* Bottom Caption Info Frame */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-white/5 max-w-2xl mx-auto w-full text-center text-white z-10 mb-2">
              <h4 className="text-lg font-bold font-serif mb-1 leading-snug">
                {filteredImages[lightboxIndex].title}
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm">
                Proud moments of Richmond's signature neighborhood community.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}