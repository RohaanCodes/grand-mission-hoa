'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllNews } from '@/lib/airtable'
import { NewsCard } from '@/components/news-card'
import type { News } from '@/lib/types'

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getAllNews()
        setNews(newsData)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Header - Aligned with Navbar */}
<div className="bg-card border-b border-border py-12 px-4">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
      News & Updates
    </h1>
    <p className="text-lg text-muted-foreground max-w-3xl">
      Stay informed about the latest community news, announcements, and
      updates from Grand Mission HOA.
    </p>
  </div>
</div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No news articles available yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 3) * 0.1 }}
                >
                  <NewsCard news={article} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
