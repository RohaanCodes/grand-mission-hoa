'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ImageCardProps {
  src: string
  alt: string
  title?: string
  subtitle?: string
  overlay?: boolean
  children?: ReactNode
  className?: string
  imageClassName?: string
}

export function ImageCard({
  src,
  alt,
  title,
  subtitle,
  overlay = false,
  children,
  className = '',
  imageClassName = '',
}: ImageCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={600}
        className={`w-full h-full object-cover ${imageClassName}`}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      )}
      {(title || subtitle || children) && (
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          {title && (
            <h3 className="font-serif text-3xl font-bold mb-2">{title}</h3>
          )}
          {subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
          {children}
        </div>
      )}
    </motion.div>
  )
}
