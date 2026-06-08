'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllGalleryImages } from '@/lib/airtable'
import type { GalleryImage } from '@/lib/types'
import { Image as ImageIcon } from 'lucide-react'   // Proper icon

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <main className="min-h-screen">
     {/* Header - Consistent Alignment */}
<div className="bg-card border-b border-border py-12 px-4">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
      Photo Gallery
    </h1>
    <p className="text-lg text-muted-foreground max-w-3xl">
      Explore photos of our community, amenities, and events.
    </p>
  </div>
</div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No photos available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, i) => {
                const imageUrl = image.image && image.image.length > 0 
                  ? image.image[0].url 
                  : null

                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (i % 9) * 0.05 }}
                    className="group relative h-64 rounded-lg overflow-hidden cursor-pointer"
                  >
                    {/* Image or Placeholder */}
                    <div className="relative w-full h-full">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-16 h-16 text-primary/30 mx-auto mb-3" />
                            <p className="text-xs text-muted-foreground font-medium">No photo</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end">
                      <div className="p-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white font-semibold">{image.title}</h3>
                        {image.category && (
                          <p className="text-white/80 text-sm">{image.category}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}