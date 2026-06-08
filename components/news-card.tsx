'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'   // Proper icon
import type { News } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface NewsCardProps {
  news: News
  index?: number
}

export function NewsCard({ news, index = 0 }: NewsCardProps) {
  const imageUrl = news.image && news.image.length > 0 ? news.image[0].url : null

  return (
    <Link href={`/news/${news.slug}`} className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="h-full bg-white border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      >
        {/* Image Section with Nice Placeholder */}
        <div className="relative h-56 overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={news.title}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
              <div className="text-center">
                <Newspaper className="w-16 h-16 text-primary/30 mx-auto mb-3" />
                 
              </div>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col h-full">
          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
            {formatDate(news.published_date)}
          </p>

          <h3 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {news.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
            {news.excerpt}
          </p>

          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
            Read More →
          </div>
        </div>
      </motion.div>
    </Link>
  )
}