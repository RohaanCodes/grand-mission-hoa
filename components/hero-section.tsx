'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface HeroSectionProps {
  title: string
  subtitle: string
  imageUrl?: string
}

export function HeroSection({ title, subtitle, imageUrl }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[500px] md:h-[680px] lg:h-[780px] overflow-hidden">
      {/* Background Image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className="absolute inset-0 object-cover"
          quality={75}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative h-full flex flex-col px-4 md:px-8 text-center">
        {/* Title + Subtitle — sits in upper-center area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 flex flex-col justify-center"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-block">
                <div className="h-1 w-12 bg-accent rounded-full mx-auto mb-4" />
              </div>
            </motion.div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white/95 text-pretty max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        </motion.div>

        {/* Buttons — pinned to the bottom of the hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pb-24 md:pb-32"
        >
          <Link
            href="#news"
            className="px-8 py-4 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl"
          >
            Explore Community
          </Link>
          <Link
            href="/amenities"
            className="px-8 py-4 bg-white/20 text-white border-2 border-white/50 rounded-md hover:bg-white/30 transition-all duration-300 font-medium text-lg backdrop-blur-sm"
          >
            View Amenities
          </Link>
        </motion.div>
      </div>
    </section>
  )
}